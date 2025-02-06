from datetime import datetime

from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Customer, Deposit, Purchase, WishList, Subscriber
from .serializers import CustomerSerializer, RegistrationSerializer, UserLoginSerializer, DepositSerializer, \
    PurchaseSerializer, WishListSerializer, UpdatePasswordSerializer, SubscriberSerializer


class CustomerViewset(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, queryset):
        return queryset.filter(user=self.request.user)


class DepositViewset(viewsets.ModelViewSet):
    queryset = Deposit.objects.all()
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, queryset):
        return queryset.filter(customer__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            customer = Customer.objects.get(user=request.user)
            amount = serializer.validated_data['amount']
            customer.balance += amount
            customer.save()
            deposit = serializer.save(customer=customer)

            email_subject = "Deposit Confirmation"
            email_body = render_to_string('deposit.html', {
                'customer_name': f"{customer.user.first_name} {customer.user.last_name}",
                'amount': amount,
                'new_balance': customer.balance,
                'deposit_date': deposit.deposit_date,
                'year': datetime.now().year
            })
            email = EmailMultiAlternatives(
                email_subject,
                '',
                to=[customer.user.email]
            )
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PurchaseViewset(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, queryset):
        return queryset.filter(customer__user=self.request.user)


class WishListViewset(viewsets.ModelViewSet):
    queryset = WishList.objects.all()
    serializer_class = WishListSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, queryset):
        return queryset.filter(customer__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = WishListSerializer(data=request.data)
        if serializer.is_valid():
            customer = Customer.objects.get(user=request.user)
            product = serializer.validated_data['product']
            wish_list = serializer.save(customer=customer)
            return Response({'message': "Product added to wishlist successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationApiView(APIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                password=data['password'],
                is_active=False
            )
            print(6, "HIT AFTER USER")

            Customer.objects.create(user=user, mobile_no=data['mobile_no'])
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"https://grocery-mart-tsa.vercel.app/customer/activate/{uid}/{token}"
            email_subject = "Activate your account"
            email_body = render_to_string('activate.html', {
                'confirm_link': confirm_link
            })
            email = EmailMultiAlternatives(
                email_subject,
                '',
                to=[user.email]
            )
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


def activate(request, uid64, token):
    try:
        uid = urlsafe_base64_decode(uid64).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        return JsonResponse({'error': 'Activation link is invalid'}, status=400)
    if user.is_active:
        return JsonResponse({'message': 'Account already activated'}, status=200)
    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return JsonResponse({'message': 'Account successfully activated'}, status=200)
    else:
        return JsonResponse({'error': 'Activation link is invalid'}, status=400)


class UserLoginApiView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['user'])
            customer = Customer.objects.get(user=user)
            token, created = Token.objects.get_or_create(user=user)
            response_data = {
                'token': token.key,
                'user_id': user.id,
                'email': user.email,
                'username': user.username,
                'full_name': f"{user.first_name} {user.last_name}",
                'balance': customer.balance
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response({
            'error': serializer.errors['non_field_errors'][0]
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutApiView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request.user.auth_token.delete()
        logout(request)
        return JsonResponse({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


class UpdateUserPasswordView(APIView):
    serializer_class = UpdatePasswordSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = UpdatePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserAndCustomerView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(username=request.user)
        customer = Customer.objects.get(user=request.user)
        response_data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'mobile_no': customer.mobile_no,
            'balance': customer.balance,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class SubscriptionView(APIView):
    serializer_class = SubscriberSerializer

    def get(self, request):
        return Response({'message': 'Method "GET" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def put(self, request):
        return Response({'message': 'Method "PUT" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request):
        return Response({'message': 'Method "PATCH" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def delete(self, request):
        return Response({'message': 'Method "DELETE" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            subscriber = Subscriber.objects.create(email=email)
            email_subject = "Subscription Confirmation"
            email_body = render_to_string('subscribe.html', {
                'email': email,
                'year': datetime.now().year
            })
            email = EmailMultiAlternatives(
                email_subject,
                '',
                to=[email]
            )
            email.attach_alternative(email_body, "text/html")
            email.send()
            return Response({'message': 'Subscription successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import authenticate, login, logout
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

from .models import Customer, Deposit, Purchase, WishList
from .serializers import CustomerSerializer, RegistrationSerializer, UserLoginSerializer, DepositSerializer, \
    PurchaseSerializer, WishListSerializer


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
                'deposit_date': deposit.deposit_date
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
            user = serializer.save()
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"http://localhost:3000/customer/activate/{uid}/{token}"
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        serializer = UserLoginSerializer(data=self.request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                login(request, user)
                response_data = {
                    'token': token.key,
                    'user_id': user.id,
                    'email': user.email,
                    'username': user.username,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials or Need to Activate'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutApiView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request.user.auth_token.delete()
        logout(request)
        return JsonResponse({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


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

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Customer, Deposit, Purchase, WishList
from .serializers import CustomerSerializer, RegistrationSerializer, UserLoginSerializer, DepositSerializer, \
    PurchaseSerializer, WishListSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


class CustomerViewset(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class DepositViewset(viewsets.ModelViewSet):
    queryset = Deposit.objects.all()
    serializer_class = DepositSerializer

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


class WishListViewset(viewsets.ModelViewSet):
    queryset = WishList.objects.all()
    serializer_class = WishListSerializer


class UserRegistrationApiView(APIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"http://127.0.0.1:8000/customer/activate/{uid}/{token}"
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
        user = User._default_manager.get(pk=uid)
    except User.DoesNotExist:
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('login')
    else:
        return Response({'error': 'Activation link is invalid'}, status=status.HTTP_400_BAD_REQUEST)


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
                return Response({'token': token.key, 'user_id': user.id}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials or Need to Activate'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutApiView(APIView):
    def get(self, request):
        request.user.auth_token.delete()
        logout(request)
        return redirect('login')

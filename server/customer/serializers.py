from rest_framework import serializers
from .models import Customer, Deposit, Purchase, WishList
from django.contrib.auth.models import User

class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)
    class Meta:
        model = Customer
        fields = '__all__'

class DepositSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(many=False)
    class Meta:
        model = Deposit
        fields = '__all__'

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value

class PurchaseSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(many=False)
    product = serializers.StringRelatedField(many=False)
    class Meta:
        model = Purchase
        fields = '__all__'

class WishListSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(many=False)
    product = serializers.StringRelatedField(many=False)
    class Meta:
        model = WishList
        fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required=True)
    mobile_no = serializers.CharField(required=True,write_only=True)
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password','confirm_password', 'mobile_no']

    def save(self):
        username = self.validated_data['username']
        email = self.validated_data['email']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        password = self.validated_data['password']
        password2 = self.validated_data['confirm_password']
        mobile_no = self.validated_data['mobile_no']

        if password != password2:
            raise serializers.ValidationError({'error': 'Passwords must match.'})

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'error': 'Email is already in use.'})

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'error': 'Username is already in use.'})

        account = User(username=username, email=email, first_name=first_name, last_name=last_name)
        account.is_active = False
        account.set_password(password)
        account.save()
        Customer.objects.create(user=account, mobile_no=mobile_no)
        return account


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    class Meta:
        model = User
        fields = ['username', 'password']
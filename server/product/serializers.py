from decimal import Decimal

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from customer.models import Customer
from .models import Product, Category, Order, OrderItem


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True, source='product')
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    total_price = serializers.ReadOnlyField(source='total_order_price')
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), required=False)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'order_date', 'order_items', 'total_price']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        user = self.context['request'].user
        if not user.is_authenticated:
            raise ValidationError("You must be authenticated to create an order.")
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            raise ValidationError("Customer does not exist. Create customer first.")

        order = Order.objects.create(**validated_data)

        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)

        order_total = customer.balance - Decimal(order.total_order_price())
        customer.balance = order_total
        customer.save()

        return order

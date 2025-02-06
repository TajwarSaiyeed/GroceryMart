from rest_framework import serializers

from customer.models import Customer, WishList
from .models import Product, Category, Order, OrderItem, Review


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(many=False)
    wishlist_users = serializers.SerializerMethodField()
    avg_rating = serializers.FloatField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_wishlist_users(self, obj):
        wishlist_users = WishList.objects.filter(product=obj).values_list('customer__user__username', flat=True)
        return list(wishlist_users)


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


class ReviewSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField(many=False)
    customer = serializers.StringRelatedField(many=False)
    class Meta:
        model = Review
        fields = '__all__'

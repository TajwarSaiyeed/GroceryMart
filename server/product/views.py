from decimal import Decimal
from rest_framework import viewsets, filters, pagination
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS, IsAdminUser as IsAdmin

from customer.models import Customer, Purchase
from .models import Category, Product, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff


class ProductPagination(pagination.PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 200


class CategoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductForSpecificCategory(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        category_id = request.query_params.get('category_id')
        if category_id:
            return queryset.filter(category=category_id)
        return queryset


class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [ProductForSpecificCategory]
    pagination_class = ProductPagination
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        try:
            customer = Customer.objects.get(user=user)
            return customer.orders.all()
        except Customer.DoesNotExist:
            return Order.objects.none()

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        request = self.context.get('request')

        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            raise ValidationError("Customer does not exist.")

        total_price = Decimal(0)
        for item in order_items_data:
            product = item['product']
            quantity = item['quantity']
            if product.stock < quantity:
                raise ValidationError(f"Only {product.stock} of {product.name} available.")
            total_price += Decimal(product.price) * quantity

        if total_price > customer.balance:
            raise ValidationError("Insufficient balance.")

        customer.balance -= total_price
        customer.save()

        # Create the order.
        order = Order.objects.create(customer=customer, **validated_data)

        for item in order_items_data:
            product = item['product']
            quantity = item['quantity']
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            product.quantity -= quantity
            product.save()
            Purchase.objects.create(customer=customer, product=product, quantity=quantity)

        return order

class OrderItemViewset(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdmin]

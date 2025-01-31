from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS

from customer.models import Customer
from .models import Category, Product, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_staff


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
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [ProductForSpecificCategory]


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

    def perform_create(self, serializer):
        user = self.request.user
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            raise ValidationError("Customer does not exist!!")
        serializer.save(customer=customer)


class OrderItemViewset(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return OrderItem.objects.all()
        try:
            customer = Customer.objects.get(user=user)
            order_ids = customer.orders.values_list('id', flat=True)
            return OrderItem.objects.filter(order__in=order_ids)
        except Customer.DoesNotExist:
            return OrderItem.objects.none()

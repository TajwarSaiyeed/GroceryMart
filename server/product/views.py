from datetime import datetime
from decimal import Decimal
from django.db.models import Avg

from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.template.loader import render_to_string
from rest_framework import viewsets, filters, pagination, status
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS, IsAdminUser as IsAdmin, \
    IsAuthenticatedOrReadOnly

from customer.models import Customer, Purchase
from .models import Category, Product, Order, OrderItem, Review
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, ReviewSerializer


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

class TopRatedProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')[:4]
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

class WeeklyDealProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.order_by('-timestamp')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = ProductPagination

    def filter_queryset(self, queryset):
        if self.request.query_params.get('weekly_deal'):
            return queryset[:4]
        return queryset

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

    def create(self, request, *args, **kwargs):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            customer = Customer.objects.get(user=request.user)
            order_items = serializer.validated_data['order_items']
            for item in order_items:
                product = item['product']
                quantity = item['quantity']
                if product.quantity < quantity:
                    return JsonResponse(
                        {'error': True, 'message': f"Only {product.quantity} items left in stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            total_price = Decimal(sum(item['product'].price * item['quantity'] for item in order_items))

            if total_price > customer.balance:
                return JsonResponse(
                    {'error': True, 'message': "Insufficient balance"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            customer.balance -= total_price
            customer.save()

            order = Order.objects.create(customer=customer)
            for item in order_items:
                product = item['product']
                quantity = item['quantity']
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
                Purchase.objects.create(customer=customer, product=product, quantity=quantity)
                product.quantity -= quantity
                product.save()
            order.save()

            email_subject = "Order Confirmation"
            email_body = render_to_string('order_confirmation.html', {
                'customer_name': f"{customer.user.first_name} {customer.user.last_name}",
                'order_number': order.id,
                'order_date': order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
                'order_items': order.order_items.all(),
                'total_price': total_price,
                'new_balance': customer.balance,
                'year': datetime.now().year
            })
            email = EmailMultiAlternatives(
                email_subject,
                '',
                to=[customer.user.email]
            )
            email.attach_alternative(email_body, "text/html")
            email.send()

            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemViewset(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdmin]

class ReviewForSpecificProduct(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        product_id = request.query_params.get('product_id')
        if product_id:
            return queryset.filter(product=product_id)
        return queryset

class ReviewViewset(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [ReviewForSpecificProduct]

    def create(self, request, *args, **kwargs):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            customer = Customer.objects.get(user=request.user)
            product = Product.objects.get(id=request.data['product'])
            serializer.save(customer=customer, product=product)
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

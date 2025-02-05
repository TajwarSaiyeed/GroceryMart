from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProductViewset, CategoryViewset, OrderViewset, OrderItemViewset, ReviewViewset

router = DefaultRouter()

router.register(r'products', ProductViewset, basename='product')
router.register(r'categories', CategoryViewset, basename='category')
router.register(r'orders', OrderViewset, basename='order')
router.register(r'order-items', OrderItemViewset, basename='order-item')
router.register(r'reviews', ReviewViewset, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]

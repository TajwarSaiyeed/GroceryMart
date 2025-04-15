from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProductViewset, CategoryViewset, OrderViewset, OrderItemViewset, ReviewViewset, \
    TopRatedProductViewset, WeeklyDealProductViewset

router = DefaultRouter()

router.register(r'products', ProductViewset, basename='product')
router.register(r'top-rated-products', TopRatedProductViewset, basename='top-rated-product')
router.register(r'weekly-deal-products', WeeklyDealProductViewset, basename='weekly-deal-product')
router.register(r'categories', CategoryViewset, basename='category')
router.register(r'orders', OrderViewset, basename='order')
router.register(r'order-items', OrderItemViewset, basename='order-item')
router.register(r'reviews', ReviewViewset, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]

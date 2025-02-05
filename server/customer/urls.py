from django.urls import include,path
from rest_framework.routers import DefaultRouter
from .views import CustomerViewset, DepositViewset, PurchaseViewset, WishListViewset, UserRegistrationApiView, \
    UserLoginApiView, UserLogoutApiView, activate, GetUserAndCustomerView, UpdateUserPasswordView

router = DefaultRouter()

router.register('list', CustomerViewset)
router.register('deposit', DepositViewset)
router.register('purchase', PurchaseViewset)
router.register('wishlist', WishListViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationApiView.as_view(), name='register'),
    path('login/', UserLoginApiView.as_view(), name='login'),
    path('logout/', UserLogoutApiView.as_view(), name='logout'),
    path('activate/<uid64>/<token>/', activate, name='activate'),
    path('profile/', GetUserAndCustomerView.as_view(), name='profile'),
    path('update-password/', UpdateUserPasswordView.as_view(), name='update-password'),
]
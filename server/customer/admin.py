from django.contrib import admin

from .models import Customer, Deposit, Purchase, WishList


class CustomerAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'mobile_no', 'balance']

    def user(self, obj):
        return obj.user.username


class DepositAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'amount', 'deposit_date', 'timestamp']

    def customer(self, obj):
        return obj.customer.user.username


class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'product', 'quantity', 'purchase_date', 'timestamp']

    def customer(self, obj):
        return obj.customer.user.username

    def product(self, obj):
        return obj.product.name


class WishListAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'product', 'timestamp']

    def customer(self, obj):
        return obj.customer.user.username

    def product(self, obj):
        return obj.product.name


admin.site.register(Customer, CustomerAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(WishList, WishListAdmin)

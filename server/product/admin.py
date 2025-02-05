from django.contrib import admin

from .models import Category, Product, Order, OrderItem, Review


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_price', 'order_date', 'timestamp']
    list_filter = ['order_date', 'timestamp']

    def customer(self, obj):
        return obj.customer.user.username

    def total_price(self, obj):
        return obj.total_order_price()


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'quantity', 'description', 'image', 'timestamp']
    list_filter = ['category', 'timestamp']

    def category(self, obj):
        return obj.category.name

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'customer', 'rating', 'description', 'timestamp']
    list_filter = ['product', 'customer', 'rating', 'timestamp']

    def customer(self, obj):
        return obj.customer.user.username

admin.site.register(Order, OrderAdmin)
admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(OrderItem)
admin.site.register(Review, ReviewAdmin)

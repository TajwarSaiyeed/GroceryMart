from django.db import models
from django.contrib.auth.models import User


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_user')
    mobile_no = models.CharField(max_length=12)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.user.username


class Purchase(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='purchases_customer')
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE, related_name='purchases_customer_product')
    quantity = models.IntegerField()
    purchase_date = models.DateTimeField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.product} - {self.customer.user.username}'


class Deposit(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='deposits_customer')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_date = models.DateTimeField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.amount} - {self.customer.user.username}'

    class Meta:
        ordering = ['timestamp']


class WishList(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='wishlist_customer')
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE, related_name='wishlist_product')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.product} - {self.customer.user.username}'

    class Meta:
        ordering = ['timestamp']

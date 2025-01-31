from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['timestamp']


class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.FloatField()
    quantity = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='product/images/')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['timestamp']


class Order(models.Model):
    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def total_order_price(self):
        return sum(item.total_price() for item in self.order_items.all())

    def __str__(self):
        return f'Order #{self.id} - {self.customer}'

    class Meta:
        ordering = ['-timestamp']


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.product.price * self.quantity} (Order #{self.order.id})"

    class Meta:
        ordering = ['-timestamp']

from django.db import models

class ROM(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    image = models.ImageField(upload_to='img/')
    file = models.FileField(upload_to='roms/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

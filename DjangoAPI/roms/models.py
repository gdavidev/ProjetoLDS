from django.db import models

class ROM(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    emulador = models.CharField(max_length=125)
    image = models.ImageField(upload_to='img/')
    file = models.FileField(upload_to='roms/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class User(models.Model):
    username = models.CharField(max_length=125)
    email = models.EmailField()
    password = models.CharField(max_length=125)
    imagem_perfil = models.ImageField(upload_to='img/perfil/')
    wishlist = models.ManyToManyField(ROM, related_name='wishlist', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

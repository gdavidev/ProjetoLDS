from django.contrib.auth.hashers import make_password
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=125)
    email = models.EmailField()
    password = models.CharField(max_length=128)  
    admin = models.BooleanField(default=False)
    imagem_perfil = models.ImageField(upload_to='img-perfil/')
    wishlist = models.ManyToManyField('ROM', related_name='wishlist', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, password):
        self.password = make_password(password)

    def check_password(self, password):
        from django.contrib.auth.hashers import check_password
        return check_password(password, self.password)


class ROM(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    emulador = models.CharField(max_length=125)
    image = models.ImageField(upload_to='img/')
    file = models.FileField(upload_to='roms/')
    qtd_download = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
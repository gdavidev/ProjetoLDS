from rest_framework import serializers
from .models import ROM
from django.contrib.auth.models import User
from django.contrib.auth.models import User

class ROMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ROM
        fields = ['id', 'title', 'image', 'file', 'description', 'emulador']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'imagem_perfil', 'wishlist']
from rest_framework import serializers
from .models import ROM, User



class ROMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ROM
        fields = ['id', 'title', 'image', 'file', 'description', 'emulador']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'admin']
        extra_kwargs = {
            'password': {'write_only': True},
            'admin': {'required': False},
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            admin=validated_data.get('admin', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

from rest_framework import serializers
from .models import ROM, User



class ROMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ROM
        fields = ['id', 'title', 'image', 'file', 'description', 'emulador']

        def get_image_url(self, obj):
            request = self.context.get('request')
            if obj.image and hasattr(obj.image, 'url'):
                return request.build_absolute_uri(obj.image.url)
            return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'admin']
        extra_kwargs = {
            'password': {'write_only': True},
            'admin': {'required': False},
        }
    
    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Este nome de usuário já está em uso."})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Este email já está em uso."})
        
        return data

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            admin=validated_data.get('admin', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

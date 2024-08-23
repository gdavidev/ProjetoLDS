from rest_framework import serializers
from .models import ROM

class ROMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ROM
        fields = ['id', 'title', 'image', 'file', 'description']
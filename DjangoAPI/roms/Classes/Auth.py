import jwt
from datetime import datetime, timedelta

from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings

from ..serializer import UserSerializer
from ..models import User
from .token import Token

class Auth:
    def __init__(self):
        self.Token = Token()
        
    def login(self, email, password):
        try:
            user = User.objects.get(email=email)
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            token = self.Token.create_token(user.id, datetime.utcnow() + timedelta(minutes=15))
            refresh_token = self.Token.create_token(user.id, datetime.utcnow() + timedelta(days=7))

            response = Response({'token': token, 'user': UserSerializer(user).data})
            response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
            return response

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

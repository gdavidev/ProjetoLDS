from django.shortcuts import render
from rest_framework import generics
from django.http import HttpResponse, FileResponse, Http404
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


import jwt
from datetime import datetime, timedelta

from .Classes.token import Token
from .models import ROM, User
from .serializer import ROMSerializer, UserSerializer

create_Token = Token()


class ROMList(generics.ListCreateAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer
    
class ROMDetail(generics.RetrieveAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

class ROMDownload(generics.RetrieveAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        file_path = obj.file.path
        if file_path:
            try:
                response = FileResponse(open(file_path, 'rb'), as_attachment=True)
                return response
            except FileNotFoundError:
                raise Http404("File not found.")
            except Exception as e:
                raise Http404("An error occurred.")
        else:
            raise Http404("No file associated with this object.")

class ROMCreate(generics.CreateAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ROMUpdate(generics.UpdateAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ROMDelete(generics.DestroyAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


#Views User
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class UserDelete(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class UserWishlist(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        wishlist = obj.wishlist.all()
        serializer = ROMSerializer(wishlist, many=True)
        return Response(serializer.data)

class UserAddWishlist(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        obj = self.get_object()
        rom_id = request.data.get('rom_id')
        rom = ROM.objects.get(id=rom_id)
        obj.wishlist.add(rom)
        serializer = UserSerializer(obj)
        return Response(serializer.data)

class UserRemoveWishlist(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        obj = self.get_object()
        rom_id = request.data.get('rom_id')
        rom = ROM.objects.get(id=rom_id)
        obj.wishlist.remove(rom)
        serializer = UserSerializer(obj)
        return Response(serializer.data)
        


class Login(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            token = create_Token.create_token(user.id, datetime.utcnow() + timedelta(minutes=15))
            refresh_token = create_Token.create_token(user.id, datetime.utcnow() + timedelta(days=7))

            response = Response({'token': token, 'user': UserSerializer(user).data})
            response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
            return response

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class RefreshToken(APIView):
    def get(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload['id'])
            token = create_Token.create_token(user.id, datetime.utcnow() + timedelta(minutes=15))
            serializer = UserSerializer(user)
            return Response({'token': token, 'user': serializer.data})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

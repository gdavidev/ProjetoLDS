from django.shortcuts import render
from rest_framework import generics
from django.http import HttpResponse, FileResponse, Http404, JsonResponse
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.files.storage import default_storage


import base64
import jwt
from datetime import datetime, timedelta

from .Classes.token import Token
from .models import ROM, User
from .serializer import ROMSerializer, UserSerializer

Token = Token()

import base64
import logging

from django.core.files.storage import default_storage
from django.http import JsonResponse, Http404
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from .models import ROM
from .serializer import ROMSerializer
from .Classes.token import Token

logger = logging.getLogger(__name__)

def encode_image_to_base64(image):
    try:
        with image.open('rb') as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding image: {e}")
        return None

class ROMListView(APIView):
    def get(self, request):
        roms = ROM.objects.all()
        data = [
            {
                'id': rom.id,
                'title': rom.title,
                'description': rom.description,
                'emulador': rom.emulador,
                'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
            }
            for rom in roms
        ]
        return JsonResponse(data, safe=False)

class ROMDetailView(APIView):
    def get(self, request):
        rom_id = request.GET.get('rom_id')
        try:
            rom = ROM.objects.get(id=rom_id)
        except ROM.DoesNotExist:
            raise NotFound()

        data = {
            'id': rom.id,
            'title': rom.title,
            'description': rom.description,
            'emulador': rom.emulador,
            'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
        }
        return JsonResponse(data, safe=False)

class ROMSearch(APIView):
    def get(self, request):
        rom_title = request.GET.get('rom_title')
        roms = ROM.objects.filter(title__icontains=rom_title)
        serializer = ROMSerializer(roms, many=True)
        return Response(serializer.data)

class ROMCreate(APIView):
    def post(self, request):
        token = request.headers.get('Authorization', '').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ROMSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ROMDelete(APIView):
    def delete(self, request):
        token = request.headers.get('Authorization', '').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        rom_id = request.data.get('rom_id')
        ROM.objects.filter(id=rom_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ROMDownload(generics.RetrieveAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        file_path = obj.file.path
        if file_path:
            try:
                response = FileResponse(open(file_path, 'rb'), as_attachment=True)
                obj.qtd_download += 1
                obj.save()
                return response
            except FileNotFoundError:
                raise Http404("File not found.")
            except Exception as e:
                logger.error(f"Error during file download: {e}")
                raise Http404("An error occurred.")
        else:
            raise Http404("No file associated with this object.")

class MostPlayed(APIView):
    def get(self, request):
        roms = ROM.objects.order_by('-qtd_download')[:4]
        data = [
            {
                'id': rom.id,
                'title': rom.title,
                'description': rom.description,
                'emulador': rom.emulador,
                'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
            }
            for rom in roms
        ]
        return JsonResponse(data, safe=False)

#Views User

class UserListView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetailView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = payload['user_id']
        if user_id:
            user = self.get_object(user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)

class UserRegister(APIView):            
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserUpdate(APIView):
    def put(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDelete(APIView):
    def delete(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'ID do usuário não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class UserViewWishlist(APIView):
    def get(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
        wishlist = user.wishlist.all()
        serializer = ROMSerializer(wishlist, many=True)
        return Response(serializer.data)

class UserAddWishlist(APIView):
    def post(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)
        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload['user_id']
        rom_id = request.data.get('rom_id')

        user = User.objects.get(id=user_id)
        rom = ROM.objects.get(id=rom_id)

        user.wishlist.add(rom)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserRemoveWishlist(APIView):
    def delete(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        payload = Token.decode_token(token)

        if payload is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
        rom_id = request.data.get('rom_id')
        rom = ROM.objects.get(id=rom_id)
        user.wishlist.remove(rom)
        serializer = UserSerializer(user)
        return Response(serializer.data)

#autenticacao
        
class Login(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email, password)

        try:
            user = User.objects.get(email=email)
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            print(user)

            token = Token.create_token(user.id, datetime.utcnow() + timedelta(minutes=15))
            refresh_token = Token.create_token(user.id, datetime.utcnow() + timedelta(days=7))

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
            token = Token.create_token(user.id, datetime.utcnow() + timedelta(minutes=15))
            serializer = UserSerializer(user)
            return Response({'token': token, 'user': serializer.data})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)



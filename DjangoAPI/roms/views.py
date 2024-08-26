from django.shortcuts import render
from rest_framework import generics
from django.http import HttpResponse, FileResponse, Http404
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import ROM, User
from .serializer import ROMSerializer, UserSerializer


class Lists(generics.ListCreateAPIView):
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

class ROMUpdate(generics.UpdateAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

class ROMDelete(generics.DestroyAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

#Views User

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDelete(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserWishlist(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        wishlist = obj.wishlist.all()
        serializer = ROMSerializer(wishlist, many=True)
        return Response(serializer.data)

class UserAddWishlist(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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

    def put(self, request, *args, **kwargs):
        obj = self.get_object()
        rom_id = request.data.get('rom_id')
        rom = ROM.objects.get(id=rom_id)
        obj.wishlist.remove(rom)
        serializer = UserSerializer(obj)
        return Response(serializer.data)

class Login(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email, password=password)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            raise NotFound("User not found.")

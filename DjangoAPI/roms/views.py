from django.shortcuts import render
from rest_framework import generics
from django.http import HttpResponse, FileResponse, Http404
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import ROM
from .serializer import ROMSerializer


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

class ROMUpdate(generics.UpdateAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer

class ROMDelete(generics.DestroyAPIView):
    queryset = ROM.objects.all()
    serializer_class = ROMSerializer
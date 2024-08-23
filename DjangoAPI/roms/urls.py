from django.urls import path
from .views import ROMList, ROMDetail, ROMDownload, ROMCreate, ROMUpdate, ROMDelete 
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("roms/", ROMList.as_view(), name="rom-list"),
    path("roms/<int:pk>/", ROMDetail.as_view(), name="rom-detail"),
    path("roms/<int:pk>/download/", ROMDownload.as_view(), name="rom-download"), 
    path("roms/<int:pk>/update/", ROMUpdate.as_view(), name="rom-update"),
    path("roms/<int:pk>/delete/", ROMDelete.as_view(), name="rom-delete"),
    path("roms/create/", ROMCreate.as_view(), name="rom-create"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
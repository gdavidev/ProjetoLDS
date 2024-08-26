from django.urls import path
from .views import ROMList, ROMDetail, ROMDownload, ROMCreate, ROMUpdate, ROMDelete, UserCreate, UserAddWishlist, UserDelete, UserDetail, UserList, UserRemoveWishlist, UserUpdate, UserWishlist, RefreshToken, Login
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("roms/", ROMList.as_view(), name="rom-list"),
    path("roms/<int:pk>/", ROMDetail.as_view(), name="rom-detail"),
    path("roms/<int:pk>/download/", ROMDownload.as_view(), name="rom-download"), 
    path("roms/<int:pk>/update/", ROMUpdate.as_view(), name="rom-update"),
    path("roms/<int:pk>/delete/", ROMDelete.as_view(), name="rom-delete"),
    path("roms/create/", ROMCreate.as_view(), name="rom-create"),
    path("users/", UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetail.as_view(), name="user-detail"),
    path("users/<int:pk>/update/", UserUpdate.as_view(), name="user-update"),
    path("users/<int:pk>/delete/", UserDelete.as_view(), name="user-delete"),
    path("users/create/", UserCreate.as_view(), name="user-create"),
    path("users/<int:pk>/wishlist/", UserWishlist.as_view(), name="user-wishlist"),
    path("users/<int:pk>/wishlist/add/", UserAddWishlist.as_view(), name="user-add-wishlist"),
    path("users/<int:pk>/wishlist/remove/", UserRemoveWishlist.as_view(), name="user-remove-wishlist"),
    path("token/refresh/", RefreshToken.as_view(), name="token-refresh"),
    path("token/", Login.as_view(), name="token")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
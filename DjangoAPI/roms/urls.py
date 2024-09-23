from django.urls import path
from .views import ROMDelete, ROMCreate, ROMListView, ROMUpdate, ROMDownload, UserRegister, UserViewWishlist, UserAddWishlist, UserDelete, UserListView, UserRemoveWishlist, UserUpdate, RefreshToken, Login, MostPlayed ,ROMDetailView, UserDetailView, ROMSearch
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("roms/", ROMListView.as_view(), name="rom-list"),
    path("roms/detail/", ROMDetailView.as_view(), name="rom-detail"),
    path("roms/search/", ROMSearch.as_view(), name="rom-search"),
    path('roms/mostplayed/', MostPlayed.as_view(), name='rom-mostplayed'),
    path("roms/<str:emulator_name>/<str:game_name>/download/", ROMDownload.as_view(), name="rom-download"),
    path("roms/update/", ROMUpdate.as_view(), name="rom-update"),
    path("roms/delete/", ROMDelete.as_view(), name="rom-delete"),
    path("roms/create/", ROMCreate.as_view(), name="rom-create"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/detail/", UserDetailView.as_view(), name="user-detail"),
    path("users/update/", UserUpdate.as_view(), name="user-update"),
    path("users/delete/", UserDelete.as_view(), name="user-delete"),
    path("register/", UserRegister.as_view(), name="user-create"),
    path("users/wishlist/", UserViewWishlist.as_view(), name="user-wishlist"),
    path("users/wishlist/add/", UserAddWishlist.as_view(), name="user-add-wishlist"),
    path("users/wishlist/remove/", UserRemoveWishlist.as_view(), name="user-remove-wishlist"),
    path("token/refresh/", RefreshToken.as_view(), name="token-refresh"),
    path("token/", Login.as_view(), name="token")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
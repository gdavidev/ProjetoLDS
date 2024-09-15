from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, ROM
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse

class UserViewsTest(APITestCase):
    def setUp(self):
        # Criação manual do usuário
        self.user = User(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.user.set_password('testpassword')
        self.user.save()
        
        self.token = RefreshToken.for_user(self.user).access_token
        
        # Criação manual do ROM
        self.rom = ROM(
            title='Test ROM',
            description='Test Description',
            emulador='Test Emulator',
            image='test_image.png',
            file='test_file.rom'
        )
        self.rom.save()
        
        self.create_url = reverse('user-create')
        self.list_url = reverse('user-list')
        self.detail_url = reverse('user-detail')
        self.update_url = reverse('user-update')
        self.delete_url = reverse('user-delete')
        self.wishlist_url = reverse('user-wishlist')
        self.add_wishlist_url = reverse('user-add-wishlist')
        self.remove_wishlist_url = reverse('user-remove-wishlist')
        self.rom_list_url = reverse('rom-list')
        self.rom_create_url = reverse('rom-create')
        self.rom_search_url = reverse('rom-search')
        self.rom_mostplayed_url = reverse('rom-mostplayed')
        self.rom_download_url = reverse('rom-download', args=[self.rom.id])

    def test_get_user_list(self):
        response = self.client.get(self.list_url, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'testuser')

    def test_get_user_detail(self):
        response = self.client.get(self.detail_url, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_create_user(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'newuser')

    def test_update_user(self):
        data = {
            'username': 'updateduser',
            'email': 'updateduser@example.com',
            'password': 'updatedpassword'
        }
        response = self.client.put(self.update_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'updateduser')

    def test_view_user_wishlist(self):
        self.user.wishlist.add(self.rom)
        
        response = self.client.get(self.wishlist_url, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test ROM')

    def test_add_user_wishlist(self):
        data = {
            'rom_id': self.rom.id
        }
        response = self.client.post(self.add_wishlist_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifique se a ROM foi adicionada ao wishlist
        self.user.refresh_from_db()
        self.assertIn(self.rom, self.user.wishlist.all())

    def test_remove_user_wishlist(self):
        # Adiciona ROM ao wishlist do usuário
        self.user.wishlist.add(self.rom)
        
        data = {
            'rom_id': self.rom.id
        }
        response = self.client.delete(self.remove_wishlist_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifique se a ROM foi removida do wishlist
        self.user.refresh_from_db()
        self.assertNotIn(self.rom, self.user.wishlist.all())

    def test_list_roms(self):
        response = self.client.get(self.rom_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Verifique se há 1 ROM na resposta

    def test_get_rom_detail(self):
        # Passa o ID no corpo da requisição
        data = {'rom_id': self.rom.id}
        response = self.client.get(self.rom_detail_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rom_id'], self.rom.id)

    def test_search_rom(self):
        response = self.client.get(self.rom_search_url, {'rom_title': 'Test ROM'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_rom(self):
        data = {
            'title': 'New ROM',
            'description': 'A description',
            'emulador': 'Some Emulator',
            'image': 'new_image.png',
            'file': 'new_file.rom'
        }
        response = self.client.post(self.rom_create_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New ROM')

    def test_update_rom(self):
        data = {'rom_id': self.rom.id, 'title': 'Updated Title'}
        response = self.client.put(self.rom_update_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')

    def test_delete_rom(self):
        data = {'rom_id': self.rom.id}
        response = self.client.delete(self.rom_delete_url, data, HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ROM.objects.filter(id=self.rom.id).exists())

    def test_download_rom(self):
        # Para o endpoint de download, o ID é passado na URL
        url = f'/roms/download/{self.rom.id}/'
        response = self.client.get(url)  # Sem autenticação necessária
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('Content-Disposition' in response)

    def test_most_played_roms(self):
        response = self.client.get(self.rom_mostplayed_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Verifique se há ROMs na resposta

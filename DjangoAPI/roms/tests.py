from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import ROM, User

class ROMTestCase(APITestCase):
    def setUp(self):
        # Criando um usuário de teste
        self.user = User.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpassword'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Criando ROM de teste
        self.rom = ROM.objects.create(
            title='Test ROM', description='Test ROM description', qtd_download=0
        )
    
    def test_rom_list_view(self):
        url = reverse('rom-list')  # Verifique o nome da URL para a lista de ROMs
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_rom_detail_view(self):
        url = reverse('rom-detail', args=[self.rom.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.rom.title)

    def test_rom_create_view(self):
        url = reverse('rom-create')
        data = {'title': 'New ROM', 'description': 'Description of new ROM'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ROM.objects.count(), 2)

    def test_rom_update_view(self):
        url = reverse('rom-update', args=[self.rom.id])
        data = {'title': 'Updated ROM', 'description': 'Updated description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.rom.refresh_from_db()
        self.assertEqual(self.rom.title, 'Updated ROM')

    def test_rom_delete_view(self):
        url = reverse('rom-delete', args=[self.rom.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ROM.objects.count(), 0)


class UserTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpassword'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_user_register(self):
        url = reverse('user-create')
        data = {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'newpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_user_wishlist_view(self):
        url = reverse('user-wishlist')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_to_wishlist(self):
        rom = ROM.objects.create(title='New ROM', description='Description of new ROM')
        url = reverse('user-add-wishlist')
        data = {'rom_id': rom.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(rom, self.user.wishlist.all())

    def test_remove_from_wishlist(self):
        rom = ROM.objects.create(title='New ROM', description='Description of new ROM')
        self.user.wishlist.add(rom)
        url = reverse('user-remove-wishlist')
        data = {'rom_id': rom.id}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(rom, self.user.wishlist.all())


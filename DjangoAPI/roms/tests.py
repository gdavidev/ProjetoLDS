from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import ROM, User, Categoria_Jogo
from .serializer import ROMSerializer
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class ROMTests(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='user', email='leonardolcp@live.com', password='senha')
        self.client.force_authenticate(user=self.user)
        self.categoria_jogo = Categoria_Jogo.objects.create(nome='Ação')
        self.rom = ROM.objects.create(
            title='Test ROM',
            description='A test ROM',
            emulador='nes',
            id_categoria='1',
        )
        self.rom_data = {
            'title': 'Test ROM 2',
            'description': 'A test ROM 2',
            'emulador': 'nes',
            'id_categoria': '1',
        }
    def test_create_rom(self):
        url = reverse('rom-list')
        response = self.client.post(url, self.rom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ROM.objects.count(), 2)

    def test_get_roms(self):
        url = reverse('rom-list')
        response = self.client.get(url, format='json')
        
        roms = ROM.objects.all()
        serializer = ROMSerializer(roms, many=True)
        
        response_data = response.json()

        for item in response_data:
            item.pop('image_base64', None)
        for item in serializer.data:
            item.pop('image', None)
            item.pop('file', None)
        
        self.assertEqual(response_data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_rom(self):
        url = reverse('rom-detail') + f'?rom_id={self.rom.id}'
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_data = response.json()
        
        self.assertEqual(response_data['id'], self.rom.id)
        self.assertEqual(response_data['title'], self.rom.title)
        self.assertEqual(response_data['description'], self.rom.description)
        self.assertEqual(response_data['emulador'], self.rom.emulador)

    def test_update_rom(self):
        url = reverse('rom-detail') 
        self.rom_data['rom_id'] = self.rom.id
        response = self.client.put(url, self.rom_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.rom.refresh_from_db()
        self.assertEqual(self.rom.title, self.rom_data['title'])
        self.assertEqual(self.rom.description, self.rom_data['description'])
        self.assertEqual(self.rom.emulador, self.rom_data['emulador'])

    def test_forgot_password(self):
        url = reverse('forgot-password')
        response = self.client.post(url, email='leonardolcp@live.com', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login(self):
        url = reverse('token')
        response = self.client.post(url, email='leonardolcp@live.com', password='senha', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
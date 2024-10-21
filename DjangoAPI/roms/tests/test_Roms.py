from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import ROM, Categoria_Jogo, Emulador, User
from django.conf import settings
import jwt

class RomsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='joao',
            email='test@example.com',
            password='123',
            admin=True,
        )
        self.categoria = Categoria_Jogo.objects.create(
            nome='Test Category',
        )
        self.emulador = Emulador.objects.create(
            nome='Test Emulator',
            console='Test Console',
            empresa='Test Manufacturer',
        )
        self.rom = ROM.objects.create(
            title='Test ROM',
            description='Test ROM description',
            categoria_id=1,
            emulador_id=1,
        )

    def _generate_token(self):
        token = jwt.encode(
            {'user_id': self.user.id,
            'admin': self.user.admin},
            settings.SECRET_KEY,
            algorithm='HS256'
        )
        return token

    def test_list_roms(self):
        url = reverse('rom-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_rom(self):
        token = self._generate_token()
        url = reverse('rom-list')
        data = {
            'title': 'Test ROM 2',
            'description': 'Test ROM description 2',
            'categoria_id': 1,
            'emulador_id': 1,
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ROM.objects.count(), 2)

    
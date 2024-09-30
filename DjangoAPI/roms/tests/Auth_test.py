from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import User
from django.conf import settings
import jwt

class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='leonardolcp@live.com',
            password='password'
        )

    def test_login_success(self):
        url = reverse('token')
        data = {'email': 'leonardolcp@live.com', 'password': 'password'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        url = reverse('token')
        data = {'email': 'leonardolcp@live.com', 'password': 'wrongpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_forgot_password(self):
        url = reverse('forgot-password')
        data = {'email': 'leonardolcp@live.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_reset_password(self):
        # Primeiro, você deve gerar um token válido para o usuário
        token = self._generate_reset_token(self.user)

        url = reverse('reset-password')
        data = {'password': 'newpassword'}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def _generate_reset_token(self, user):
        token = jwt.encode(
            {'user_id': user.id},
            settings.SECRET_KEY,
            algorithm='HS256'
        )

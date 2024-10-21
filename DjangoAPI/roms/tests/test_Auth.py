from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import User
from django.conf import settings
import jwt

class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='leonardolcp@live.com',
            password='123456',
            username='Admin',
        )
        self.user.set_password('123456') 
        self.user.save()

    def test_login_success(self):
        url = reverse('token') 
        data = {'email': 'leonardolcp@live.com', 'password': '123456'}
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
        token = self._generate_token()

        url = reverse('reset-password')
        data = {'password': 'newpassword'}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_register_user(self):
        url = reverse('user-create')
        data = {
            'email': 'newuser@example.com',
            'password': '123',
            'username': 'joao'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_refresh_token(self):
        test_login_success()
        url = reverse('refresh-token')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def _generate_token(self):
        token = jwt.encode(
            {'user_id': self.user.id},
            settings.SECRET_KEY,
            algorithm='HS256'
        )
        return token

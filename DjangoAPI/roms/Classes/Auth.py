import jwt
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings

from ..serializer import UserSerializer
from ..models import User
from .token import Token


class Auth:
    def __init__(self):
        self.Token = Token()
        
    def login(self, email, password):
        try:
            user = User.objects.get(email=email)
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            token = self.Token.create_token(user.id, user.admin, datetime.utcnow() + timedelta(minutes=15))
            refresh_token = self.Token.create_token(user.id, user.admin, datetime.utcnow() + timedelta(days=7))

            response = Response({'token': token, 'user': UserSerializer(user).data})
            response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
            return response

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

    def refresh_token(self, refresh_token):
        if refresh_token is None:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload['id'])
            token = Token.create_token(user.id, user.admin, datetime.utcnow() + timedelta(minutes=15))
            serializer = UserSerializer(user)
            return Response({'token': token, 'user': serializer.data})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

    def send_ForgotPassword_email(self, email):
        try:
            print(email)
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = self.Token.create_token(user.id, user.admin, datetime.utcnow() + timedelta(minutes=15))

            subject = "Reset your password"
            message = f'''Olá,<br><br>
            Clique no link abaixo para alterar a senha:<br><br>
            <a href="http://localhost:5173/reset-password?token={token}">Clique aqui</a>'''

            msg = MIMEMultipart()
            msg['From'] = settings.EMAIL_HOST_USER
            msg['To'] = email
            msg['Subject'] = subject
            msg.attach(MIMEText(message, 'html'))

            smtp_server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
            smtp_server.starttls()
            smtp_server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            smtp_server.sendmail(settings.EMAIL_HOST_USER, email, msg.as_string())
            smtp_server.quit()

            return Response({'message': 'Password reset email sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def reset_password(self, token, password):
        try:
            payload = self.Token.decode_token(token)

            if payload is None:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                user_id = payload['user_id']
                user = User.objects.get(id=user_id)
                user.set_password(password)
                user.save()
                return Response({'message': 'Password reset successfully'})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Reset token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid reset token'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def protected_route(self, token):
        if token is None:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = self.Token.decode_token(token)
            user = User.objects.get(id=payload['user_id'])
            return Response({'user': UserSerializer(user).data})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
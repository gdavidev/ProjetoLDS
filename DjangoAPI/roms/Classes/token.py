import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.http import HttpResponse, FileResponse, Http404
from rest_framework.response import Response

class Token:
    def __init__(self):
        pass
    
    def create_token(self, user_id, admin, expire):    

        if not isinstance(expire, datetime):
            raise ValueError("Expire must be a datetime instance")

        payload = {
            'user_id': user_id,  
            'admin': admin,
            'exp': expire,      
            'iat': datetime.utcnow()  
        }
        
        encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        
        return encoded_jwt

    def decode_token(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

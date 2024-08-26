import jwt
import datetime
from django.conf import settings

class Token:
    def __init__(self):
        pass
    
    def create_token(self, id, expire):
        payload = {
            'User_id': id,
            'exp': expire
        }
        encoded_jwt = jwt.encode(payload, settings.SECRET_KEY , algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt

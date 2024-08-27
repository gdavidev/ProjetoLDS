import jwt
from django.conf import settings
from datetime import datetime, timedelta

class Token:
    def __init__(self):
        pass
    
    def create_token(self, user_id, expire):    

        if not isinstance(expire, datetime):
            raise ValueError("Expire must be a datetime instance")
        
        print(user_id)
        payload = {
            'user_id': user_id,  
            'exp': expire,      
            'iat': datetime.utcnow()  
        }
        
        encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        
        return encoded_jwt

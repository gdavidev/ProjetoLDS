from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import User
from django.conf import settings
import jwt
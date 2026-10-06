from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationTests(APITestCase):

    def test_user_registration(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "Test@12345",
        }

        response = self.client.post(
            "/api/auth/register/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(username="testuser").exists()
        )

    def test_user_login(self):
        User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="Test@12345",
        )

        data = {
            "username": "loginuser",
            "password": "Test@12345",
        }

        response = self.client.post(
            "/api/auth/login/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_registration_requires_password(self):
        data = {
            "username": "testuser2",
            "email": "test2@example.com",
        }

        response = self.client.post(
            "/api/auth/register/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Dataset


class DatasetProfileTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="profileuser",
            password="Test@12345",
        )

        csv_content = (
            "name,email,age\n"
            "Kunal,kunal@example.com,22\n"
            "Rahul,rahul@example.com,24\n"
            "Priya,priya@example.com,21\n"
        ).encode("utf-8")

        csv_file = SimpleUploadedFile(
            "test_profile.csv",
            csv_content,
            content_type="text/csv",
        )

        self.dataset = Dataset.objects.create(
            owner=self.user,
            name="Profile Test",
            file=csv_file,
            file_size=len(csv_content),
        )

        self.client.force_authenticate(user=self.user)

    def test_dataset_profile(self):
        response = self.client.get(
            f"/api/datasets/{self.dataset.id}/profile/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        profile = response.data["profile"]

        self.assertEqual(profile["total_rows"], 3)
        self.assertEqual(profile["total_columns"], 3)

        self.assertEqual(
            profile["columns"][0]["name"],
            "name",
        )

        self.assertEqual(
            profile["columns"][0]["missing_values"],
            0,
        )

    def test_user_cannot_access_another_users_dataset(self):
        another_user = User.objects.create_user(
            username="anotheruser",
            password="Test@12345",
        )

        self.client.force_authenticate(user=another_user)

        response = self.client.get(
            f"/api/datasets/{self.dataset.id}/profile/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from datasets.models import Dataset
from .models import ValidationRule
from .services import validate_dataset


class ValidationEngineTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="validationuser",
            password="Test@12345"
        )

        csv_content = (
            "name,email,age\n"
            "Kunal,kunal@example.com,22\n"
            "Rahul,rahul@example.com,24\n"
            "Priya,priya@example.com,21\n"
        ).encode("utf-8")

        csv_file = SimpleUploadedFile(
            "validation_test.csv",
            csv_content,
            content_type="text/csv"
        )

        self.dataset = Dataset.objects.create(
            owner=self.user,
            name="Validation Test",
            file=csv_file,
            file_size=len(csv_content)
        )

    def test_required_validation_passes(self):
        ValidationRule.objects.create(
            dataset=self.dataset,
            column_name="email",
            rule_type="required",
            parameters={}
        )

        run = validate_dataset(self.dataset)

        self.assertEqual(run.total_rows, 3)
        self.assertEqual(run.failed_rows, 0)
        self.assertEqual(run.passed_rows, 3)
        self.assertEqual(run.quality_score, 100)

    def test_unique_validation_passes(self):
        ValidationRule.objects.create(
            dataset=self.dataset,
            column_name="email",
            rule_type="unique",
            parameters={}
        )

        run = validate_dataset(self.dataset)

        self.assertEqual(run.failed_rows, 0)
        self.assertEqual(run.quality_score, 100)

    def test_range_validation(self):
        ValidationRule.objects.create(
            dataset=self.dataset,
            column_name="age",
            rule_type="range",
            parameters={
                "min": 18,
                "max": 60
            }
        )

        run = validate_dataset(self.dataset)

        self.assertEqual(run.failed_rows, 0)
        self.assertEqual(run.quality_score, 100)

    def test_email_validation(self):
        ValidationRule.objects.create(
            dataset=self.dataset,
            column_name="email",
            rule_type="email",
            parameters={}
        )

        run = validate_dataset(self.dataset)

        self.assertEqual(run.failed_rows, 0)
        self.assertEqual(run.quality_score, 100)
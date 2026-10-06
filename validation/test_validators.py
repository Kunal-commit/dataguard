from django.test import SimpleTestCase

from .validators.required import RequiredValidator


class RequiredValidatorTests(SimpleTestCase):

    def setUp(self):
        self.validator = RequiredValidator()

    def test_valid_value(self):
        self.assertTrue(
            self.validator.validate("Kunal")
        )

    def test_none_value(self):
        self.assertFalse(
            self.validator.validate(None)
        )

    def test_empty_string(self):
        self.assertFalse(
            self.validator.validate("")
        )

    def test_whitespace_string(self):
        self.assertFalse(
            self.validator.validate("   ")
        )
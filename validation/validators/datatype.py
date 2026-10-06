from typing import Any
from .base import BaseValidator


class DataTypeValidator(BaseValidator):
    def __init__(self, expected_type):
        self.expected_type = expected_type

    def validate(self, value: Any) -> bool:
        if value is None:
            return False

        if self.expected_type == "integer":
            try:
                int(value)
                return True
            except (ValueError, TypeError):
                return False

        if self.expected_type == "float":
            try:
                float(value)
                return True
            except (ValueError, TypeError):
                return False

        if self.expected_type == "string":
            return isinstance(value, str)

        return False
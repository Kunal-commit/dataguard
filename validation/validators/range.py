from typing import Any
from .base import BaseValidator


class RangeValidator(BaseValidator):
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value

    def validate(self, value: Any) -> bool:
        try:
            value = float(value)

            if self.min_value is not None and value < self.min_value:
                return False

            if self.max_value is not None and value > self.max_value:
                return False

            return True

        except (ValueError, TypeError):
            return False
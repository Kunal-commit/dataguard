import re
from typing import Any
from .base import BaseValidator


class EmailValidator(BaseValidator):
    def validate(self, value: Any) -> bool:
        if value is None:
            return False

        pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
        return bool(re.match(pattern, str(value)))
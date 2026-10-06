from typing import Any
from .base import BaseValidator


class UniqueValidator(BaseValidator):
    def validate(self, value: Any) -> bool:
        return True
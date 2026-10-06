from abc import ABC, abstractmethod
from typing import Any


class BaseValidator(ABC):

    @abstractmethod
    def validate(self, value: Any) -> bool:
        """
        Return True when the value passes validation.
        """
        pass
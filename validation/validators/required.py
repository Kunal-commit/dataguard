from typing import Any

import pandas as pd

from .base import BaseValidator


class RequiredValidator(BaseValidator):

    def validate(self, value: Any) -> bool:
        if value is None:
            return False

        if pd.isna(value):
            return False

        if isinstance(value, str) and not value.strip():
            return False

        return True
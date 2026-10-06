import pandas as pd

from .models import ValidationIssue, ValidationRun
from .validators.required import RequiredValidator
from .validators.unique import UniqueValidator
from .validators.range import RangeValidator
from .validators.datatype import DataTypeValidator
from .validators.email import EmailValidator


VALIDATORS = {
    "required": RequiredValidator,
    "email": EmailValidator,
}


def validate_dataset(dataset):
    dataframe = pd.read_csv(dataset.file.path)

    validation_run = ValidationRun.objects.create(
        dataset=dataset,
        total_rows=len(dataframe),
    )

    failed_row_numbers = set()

    for rule in dataset.validation_rules.all():

        # Column doesn't exist
        if rule.column_name not in dataframe.columns:
            for index in range(len(dataframe)):
                row_number = index + 1

                ValidationIssue.objects.create(
                    validation_run=validation_run,
                    row_number=row_number,
                    column_name=rule.column_name,
                    rule_type=rule.rule_type,
                    message="Column does not exist.",
                )

                failed_row_numbers.add(row_number)

            continue

        column = dataframe[rule.column_name]

        # REQUIRED
        if rule.rule_type == "required":

            validator = RequiredValidator()

            for index, value in column.items():
                if pd.isna(value) or not validator.validate(value):
                    row_number = index + 1

                    ValidationIssue.objects.create(
                        validation_run=validation_run,
                        row_number=row_number,
                        column_name=rule.column_name,
                        rule_type=rule.rule_type,
                        message="Value is required.",
                    )

                    failed_row_numbers.add(row_number)

        # UNIQUE
        elif rule.rule_type == "unique":

            duplicated = column.duplicated(keep=False)

            for index, is_duplicate in duplicated.items():
                if is_duplicate:
                    row_number = index + 1

                    ValidationIssue.objects.create(
                        validation_run=validation_run,
                        row_number=row_number,
                        column_name=rule.column_name,
                        rule_type=rule.rule_type,
                        message="Value must be unique.",
                    )

                    failed_row_numbers.add(row_number)

        # RANGE
        elif rule.rule_type == "range":

            min_value = rule.parameters.get("min")
            max_value = rule.parameters.get("max")

            validator = RangeValidator(
                min_value=min_value,
                max_value=max_value,
            )

            for index, value in column.items():

                if pd.isna(value) or not validator.validate(value):
                    row_number = index + 1

                    ValidationIssue.objects.create(
                        validation_run=validation_run,
                        row_number=row_number,
                        column_name=rule.column_name,
                        rule_type=rule.rule_type,
                        message="Value is outside the allowed range.",
                    )

                    failed_row_numbers.add(row_number)

        # DATA TYPE
        elif rule.rule_type == "datatype":

            expected_type = rule.parameters.get("type")

            validator = DataTypeValidator(expected_type)

            for index, value in column.items():

                if pd.isna(value) or not validator.validate(value):
                    row_number = index + 1

                    ValidationIssue.objects.create(
                        validation_run=validation_run,
                        row_number=row_number,
                        column_name=rule.column_name,
                        rule_type=rule.rule_type,
                        message=f"Expected data type: {expected_type}.",
                    )

                    failed_row_numbers.add(row_number)

        # EMAIL
        elif rule.rule_type == "email":

            validator = EmailValidator()

            for index, value in column.items():

                if pd.isna(value) or not validator.validate(value):
                    row_number = index + 1

                    ValidationIssue.objects.create(
                        validation_run=validation_run,
                        row_number=row_number,
                        column_name=rule.column_name,
                        rule_type=rule.rule_type,
                        message="Invalid email address.",
                    )

                    failed_row_numbers.add(row_number)

    validation_run.failed_rows = len(failed_row_numbers)

    validation_run.passed_rows = (
        validation_run.total_rows - validation_run.failed_rows
    )

    if validation_run.total_rows > 0:
        validation_run.quality_score = (
            validation_run.passed_rows /
            validation_run.total_rows
        ) * 100

    validation_run.save()

    return validation_run
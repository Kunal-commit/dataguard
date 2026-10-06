from django.db import models

from datasets.models import Dataset


class ValidationRule(models.Model):

    RULE_TYPES = [
        ("required", "Required"),
        ("unique", "Unique"),
        ("range", "Range"),
        ("datatype", "Data Type"),
        ("email", "Email"),
    ]

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
        related_name="validation_rules",
    )
    column_name = models.CharField(max_length=255)
    rule_type = models.CharField(
        max_length=20,
        choices=RULE_TYPES,
    )
    parameters = models.JSONField(
        default=dict,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.column_name} - {self.rule_type}"


class ValidationRun(models.Model):

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
        related_name="validation_runs",
    )
    total_rows = models.PositiveIntegerField(default=0)
    passed_rows = models.PositiveIntegerField(default=0)
    failed_rows = models.PositiveIntegerField(default=0)
    quality_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Validation Run {self.id} - {self.dataset.name}"


class ValidationIssue(models.Model):

    validation_run = models.ForeignKey(
        ValidationRun,
        on_delete=models.CASCADE,
        related_name="issues",
    )
    row_number = models.PositiveIntegerField()
    column_name = models.CharField(max_length=255)
    rule_type = models.CharField(max_length=20)
    message = models.TextField()

    class Meta:
        ordering = ["row_number"]

    def __str__(self):
        return (
            f"Row {self.row_number} - "
            f"{self.column_name} - "
            f"{self.rule_type}"
        )
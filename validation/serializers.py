from rest_framework import serializers

from .models import ValidationRule, ValidationRun, ValidationIssue


class ValidationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationRule
        fields = [
            "id",
            "column_name",
            "rule_type",
            "parameters",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        rule_type = data.get("rule_type")
        parameters = data.get("parameters") or {}

        if rule_type == "range":
            if "min" not in parameters and "max" not in parameters:
                raise serializers.ValidationError(
                    "Range rule requires min or max."
                )

        if rule_type == "datatype":
            if parameters.get("type") not in ["integer", "float", "string"]:
                raise serializers.ValidationError(
                    "Datatype must be integer, float, or string."
                )

        return data


class ValidationRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationRun
        fields = [
            "id",
            "dataset",
            "total_rows",
            "passed_rows",
            "failed_rows",
            "quality_score",
            "created_at",
        ]


class ValidationIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationIssue
        fields = [
            "id",
            "row_number",
            "column_name",
            "rule_type",
            "message",
        ]
from rest_framework import serializers

from .models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = [
            "id",
            "name",
            "file",
            "file_size",
            "uploaded_at",
        ]
        read_only_fields = [
            "id",
            "file_size",
            "uploaded_at",
        ]

    def validate_file(self, value):
        if not value.name.lower().endswith(".csv"):
            raise serializers.ValidationError(
                "Only CSV files are allowed."
            )

        return value
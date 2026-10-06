
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from datasets.models import Dataset

from .models import ValidationIssue, ValidationRule, ValidationRun
from .serializers import (
    ValidationIssueSerializer,
    ValidationRuleSerializer,
    ValidationRunSerializer,
)
from .services import validate_dataset


class ValidationRuleListCreateView(generics.ListCreateAPIView):
    serializer_class = ValidationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_dataset(self):
        return Dataset.objects.filter(
            id=self.kwargs["dataset_id"],
            owner=self.request.user,
        ).first()

    def get_queryset(self):
        dataset = self.get_dataset()

        if dataset is None:
            return ValidationRule.objects.none()

        return ValidationRule.objects.filter(dataset=dataset)

    def perform_create(self, serializer):
        dataset = self.get_dataset()

        if dataset is None:
            raise NotFound("Dataset not found.")

        serializer.save(dataset=dataset)


class DatasetValidationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, dataset_id):
        dataset = Dataset.objects.filter(
            id=dataset_id,
            owner=request.user,
        ).first()

        if dataset is None:
            raise NotFound("Dataset not found.")

        validation_run = validate_dataset(dataset)

        return Response({
            "id": validation_run.id,
            "dataset_id": dataset.id,
            "total_rows": validation_run.total_rows,
            "passed_rows": validation_run.passed_rows,
            "failed_rows": validation_run.failed_rows,
            "quality_score": validation_run.quality_score,
        })


class ValidationRunDetailView(generics.RetrieveAPIView):
    serializer_class = ValidationRunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ValidationRun.objects.filter(
            dataset__owner=self.request.user,
        )


class ValidationIssueListView(generics.ListAPIView):
    serializer_class = ValidationIssueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        run_id = self.kwargs["run_id"]

        return ValidationIssue.objects.filter(
            validation_run_id=run_id,
            validation_run__dataset__owner=self.request.user,
        )
from django.urls import path

from .views import (
    DatasetValidationView,
    ValidationRuleListCreateView,
    ValidationRunDetailView,
    ValidationIssueListView,
)


urlpatterns = [
    path(
        "datasets/<int:dataset_id>/rules/",
        ValidationRuleListCreateView.as_view(),
        name="validation-rule-list-create",
    ),

    path(
        "datasets/<int:dataset_id>/validate/",
        DatasetValidationView.as_view(),
        name="dataset-validation",
    ),

    path(
        "validation-runs/<int:pk>/",
        ValidationRunDetailView.as_view(),
        name="validation-run-detail",
    ),

    path(
        "validation-runs/<int:run_id>/issues/",
        ValidationIssueListView.as_view(),
        name="validation-issues",
    ),
]
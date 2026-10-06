from django.urls import path

from .views import (
    DatasetListCreateView,
    DatasetProfileView,
)


urlpatterns = [
    path(
        "datasets/",
        DatasetListCreateView.as_view(),
        name="dataset-list-create",
    ),
    path(
        "datasets/<int:pk>/profile/",
        DatasetProfileView.as_view(),
        name="dataset-profile",
    ),
]
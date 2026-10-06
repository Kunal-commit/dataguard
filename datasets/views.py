from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Dataset
from .serializers import DatasetSerializer
from .services import profile_dataset


class DatasetListCreateView(generics.ListCreateAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Dataset.objects.filter(owner=self.request.user)

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES["file"]

        serializer.save(
            owner=self.request.user,
            file_size=uploaded_file.size,
        )


class DatasetProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            dataset = Dataset.objects.get(
                id=pk,
                owner=request.user,
            )
        except Dataset.DoesNotExist:
            return Response(
                {"detail": "Dataset not found."},
                status=404,
            )

        profile = profile_dataset(dataset.file.path)

        return Response({
            "dataset_id": dataset.id,
            "dataset_name": dataset.name,
            "profile": profile,
        })
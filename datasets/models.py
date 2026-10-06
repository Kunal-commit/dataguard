from django.contrib.auth.models import User
from django.db import models


class Dataset(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="datasets",
    )
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="datasets/")
    file_size = models.PositiveBigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.name
from rest_framework import generics, permissions
from .models import JobListing, Application
from .serializers import JobListingSerializer, ApplicationSerializer
from rest_framework.permissions import IsAuthenticated

class EligibleJobsView(generics.ListAPIView):
    serializer_class = JobListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return JobListing.objects.filter(
            min_cgpa__lte=user.cgpa,
            eligible_branches=user.branch
        )

class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        job_id = self.kwargs['job_id']
        job = JobListing.objects.get(id=job_id)
        serializer.save(student=self.request.user, job=job)

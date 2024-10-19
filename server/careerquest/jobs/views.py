from rest_framework import generics, permissions, serializers, status, viewsets
from .models import JobListing, Application
from .serializers import JobListingSerializer, ApplicationSerializer, RegisterSerializer, UserProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

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

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(TokenObtainPairView): #handling of JWT token generation (access and refresh tokens) for login.
    pass


class JobCreateView(viewsets.ModelViewSet):
    serializer_class = JobListingSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = JobListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)  # Set posted_by here
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class JobUpdateView(viewsets.ModelViewSet):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, pk=None):
        job = self.get_object()
        serializer = self.get_serializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JobDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            job = JobListing.objects.get(pk=pk)
            job.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except JobListing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AppliedJobsView(APIView): #API to show jobs a student has applied for
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applied_jobs = request.user.applied_jobs.all()
        serializer = JobListingSerializer(applied_jobs, many=True)
        return Response(serializer.data)

class JobApplicantsView(APIView): #API to show all students that applied for a job
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = JobListing.objects.get(pk=pk)
        applicants = job.applied_students.all()  # assuming a relation exists
        serializer = UserSerializer(applicants, many=True)
        return Response(serializer.data)

class JobsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = JobListing.objects.all()
        serializer = JobListingSerializer(jobs, many=True)
        return Response(serializer.data)
    
class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = JobListing.objects.get(pk=pk)
        serializer = JobListingSerializer(job)
        return Response(serializer.data)


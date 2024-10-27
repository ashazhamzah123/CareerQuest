from rest_framework import generics, permissions, serializers, status, viewsets
from .models import JobListing, Application, User
from .serializers import JobListingSerializer, ApplicationSerializer, RegisterSerializer, UserProfileSerializer, UserSerializer, AdminProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, update_session_auth_hash
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StudentRegisterView(APIView):
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

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        data['is_admin'] = self.user.is_admin
        
        return data


class LoginView(TokenObtainPairView): #handling of JWT token generation (access and refresh tokens) for login.
    serializer_class = CustomTokenObtainPairSerializer


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

    def patch(self, request):
        user = request.user
        data = request.data
        serializer = UserProfileSerializer(user, data=request.data)
        if serializer.is_valid():

            if 'password' in data and data['password']:
                user.set_password(data['password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        return request.user  # Assuming the admin is the logged-in user

    def get(self, request):
        user = self.get_object(request)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = self.get_object(request)
        data = request.data
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in data and data['password']:
                user.set_password(data['password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AppliedJobsView(APIView): #API to show jobs a student has applied for
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        applied_jobs = Application.objects.filter(student = user)
        if not applied_jobs.exists():
            return Response([], status=status.HTTP_200_OK) 
        serializer = ApplicationSerializer(applied_jobs, many=True)
        return Response(serializer.data)

class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            job = JobListing.objects.get(pk=pk)
            applications = Application.objects.filter(job=job)
            applicants = [app.student for app in applications]  # Extracting the students from the applications
            serializer = UserProfileSerializer(applicants, many=True)
            return Response(serializer.data)
        except JobListing.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

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

User = get_user_model()

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class AdminDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = AdminProfileSerializer(user)
        return Response(serializer.data)
    
class StudentDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    

class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can apply for jobs

    def post(self, request, job_id):
        try:
            job = JobListing.objects.get(id=job_id)
            student = request.user

            # Check if the user has already applied for this job
            if Application.objects.filter(student=student, job=job).exists():
                return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new application
            Application.objects.create(student=student, job=job)

            return Response({'detail': 'Application successful!'}, status=status.HTTP_201_CREATED)

        except JobListing.DoesNotExist:
            return Response({'detail': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)


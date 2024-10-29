from rest_framework import generics, permissions, serializers, status, viewsets
from .models import JobListing, Application, User
from .serializers import JobListingSerializer, ApplicationSerializer, RegisterSerializer, UserProfileSerializer, UserSerializer, AdminProfileSerializer, ApplicationStatusUpdateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, update_session_auth_hash
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from collections import Counter

from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin
    
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
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        serializer = JobListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)  # Set posted_by here
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class JobUpdateView(viewsets.ModelViewSet):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def partial_update(self, request, pk=None):
        job = self.get_object()
        serializer = self.get_serializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JobDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

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
        serializer = UserProfileSerializer(user, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            if 'password' in data and data['password']:
                user.set_password(data['password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

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
            serializer.save()
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
            applicants_data = []
            
            for application in applications:
                student_data = UserProfileSerializer(application.student).data
                student_data['status'] = application.status
                student_data['application_id'] = application.id  # Add application ID for status updates
                applicants_data.append(student_data)
            
            return Response(applicants_data)
        
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
    permission_classes = [IsAuthenticated, IsAdminUser]

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

class ApplicationStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]  # Only allow admin users

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
            new_status = request.data.get('status')

            if new_status:
                application.status = new_status
                application.save()

                return Response({
                    "message": "Application status updated successfully.",
                    "status": application.status
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Status is required."}, status=status.HTTP_400_BAD_REQUEST)

        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
class DashboardMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        applications = Application.objects.filter(student = user)

        if not applications.exists():
            return Response({"message": "You haven't applied for anything. You can start applying to jobs by clicking the Job listings section in the sidebar."
                             ,"status_counts":{status: 0 for status in ['Pending', 'Shortlisted', 'Selected', 'Rejected', 'On hold']}})

        # Prepare response messages based on statuses
        status_counts = Counter(application.status for application in applications)
        messages = set()
        all_pending = True  # Track if all applications are pending

        for application in applications:
            if application.status == 'Pending':
                pass
            elif application.status == 'Shortlisted':
                messages.add(f"{application.job.company} has shortlisted you for {application.job.title}. The OT is on {application.job.OT_date}.")
                all_pending = False
            elif application.status == 'Selected':
                messages.add(f"Congratulations! You have been selected for {application.job.title} at {application.job.company}. You will receive further information via email.")
                all_pending = False
            elif application.status == 'Rejected':
                messages.add(f"You have not been selected for {application.job.title} at {application.job.company}.")
                all_pending = False
            elif application.status == 'On hold':
                messages.add(f"Your application for {application.job.title} at {application.job.company} is currently on hold.")
                all_pending = False

        if all_pending:
            messages = {"All applications are currently being reviewed."}

        return Response({"messages": messages,"status_counts":status_counts})



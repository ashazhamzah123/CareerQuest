from django.urls import path
from . import views
from rest_framework.authtoken import views as drf_views
from .views import RegisterView, LoginView, JobCreateView, JobUpdateView, JobsListView, JobDetailView, JobDeleteView, UserProfileUpdateView, AppliedJobsView, JobApplicantsView, AdminDetails, UserDetails,ApplyJobView, StudentDetails, StudentRegisterView, AdminProfileUpdateView, ApplicationStatusUpdateView, DashboardMessageView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('jobs/', views.EligibleJobsView.as_view(), name='eligible-jobs'),
    path('register/', RegisterView.as_view(), name='register'),
    path('register/student/', StudentRegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('jobs/admin/', JobsListView.as_view(), name='jobs_list'),
    path('user-details/', UserDetails.as_view(), name='user-details'),
    path('admin-details/', AdminDetails.as_view(), name='admin-details'),
    path('student-details/', StudentDetails.as_view(), name='student_details'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('jobs/create/', JobCreateView.as_view({'post': 'create'}), name='job_create'),
    path('jobs/<int:pk>/update/', JobUpdateView.as_view({'patch': 'partial_update'}), name='job_update'),
    path('jobs/<int:pk>/delete/', JobDeleteView.as_view(), name='job_delete'),
    path('user/update/', UserProfileUpdateView.as_view(), name='user_update'),
    path('admin/update/', AdminProfileUpdateView.as_view(), name='admin_update'),
    path('jobs/applied/', AppliedJobsView.as_view(), name='applied_jobs'),
    path('jobs/<int:pk>/applicants/', JobApplicantsView.as_view(), name='job_applicants'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('jobs/<int:job_id>/apply/',ApplyJobView.as_view(), name='apply_job'),
    path('applications/<int:pk>/update-status/', ApplicationStatusUpdateView.as_view(), name='application-update-status'),
    path('message/', DashboardMessageView.as_view(), name='dashboard-message')
]

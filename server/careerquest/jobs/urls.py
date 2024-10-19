from django.urls import path
from . import views

urlpatterns = [
    path('jobs/', views.EligibleJobsView.as_view(), name='eligible-jobs'),
    path('jobs/<int:job_id>/apply/', views.ApplyJobView.as_view(), name='apply-job'),
]

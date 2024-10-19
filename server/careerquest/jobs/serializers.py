from rest_framework import serializers
from .models import User, JobListing, Application, Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    branch = BranchSerializer()

    class Meta:
        model = User
        fields = ['username', 'roll_number', 'branch', 'cgpa', 'is_student', 'is_admin']

class JobListingSerializer(serializers.ModelSerializer):
    eligible_branches = BranchSerializer(many=True)

    class Meta:
        model = JobListing
        fields = ['title', 'description', 'company', 'min_cgpa', 'eligible_branches', 'post_date']

class ApplicationSerializer(serializers.ModelSerializer):
    student = UserSerializer()
    job = JobListingSerializer()

    class Meta:
        model = Application
        fields = ['student', 'job', 'application_date', 'status']

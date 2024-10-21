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
        fields = ['username','first_name', 'roll_number', 'branch', 'cgpa', 'is_student', 'is_admin']

class JobListingSerializer(serializers.ModelSerializer):
    eligible_branches = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        many = True
    )
    #eligible_branches = BranchSerializer(many=True)

    class Meta:
        model = JobListing
        fields = ['id','title', 'description', 'company', 'min_cgpa', 'eligible_branches', 'salary', 'due_date', 'post_date']

class ApplicationSerializer(serializers.ModelSerializer):
    student = UserSerializer()
    job = JobListingSerializer()

    class Meta:
        model = Application
        fields = ['student', 'job', 'application_date', 'status']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name','last_name','roll_number', 'branch','cgpa','is_student','is_admin')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data['first_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            roll_number=validated_data['roll_number'],
            is_student=validated_data.get('is_student', True),
            is_admin=validated_data.get('is_admin', False)
        )
        if user.is_student: #Ensuring the branch and cgpa is provided for students.
            branch = validated_data.get('branch')
            cgpa = validated_data.get('cgpa')
            if not branch or not cgpa:
                raise serializers.ValidationError("Branch and CGPA are required for students.")
            user.branch = branch
            user.cgpa = cgpa
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
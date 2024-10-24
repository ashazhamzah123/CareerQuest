from rest_framework import serializers
from .models import User, JobListing, Application, Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(required=False)  # Make branch optional since admins don't need it

    class Meta:
        model = User
        fields = ['username', 'first_name', 'password','roll_number', 'branch', 'cgpa', 'is_student', 'is_admin']

    def validate(self, data):
        # If the user is a student, ensure roll_number and branch are provided
        if data.get('is_student'):
            if not data.get('roll_number'):
                raise serializers.ValidationError({"roll_number": "Roll number is required for students."})
            if not data.get('branch'):
                raise serializers.ValidationError({"branch": "Branch is required for students."})
        
        # If the user is an admin, roll_number and branch should not be provided
        if data.get('is_admin'):
            data.pop('roll_number', None)  # Remove roll_number if it's present for admins
            data.pop('branch', None)  # Remove branch if it's present for admins
        
        return data

    def create(self, validated_data):
        # Extract branch data separately, if it exists
        branch_data = validated_data.pop('branch', None)
        
        # Create the user
        user = User.objects.create(**validated_data)

        # If the user is a student and branch is provided, set the branch
        if validated_data.get('is_student') and branch_data:
            branch = Branch.objects.get(id=branch_data['id'])
            user.branch = branch
        
        user.set_password(validated_data['password'])  # Set password securely
        user.save()

        return user


class JobListingSerializer(serializers.ModelSerializer):
    eligible_branches = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        many = True
    )
    #eligible_branches = BranchSerializer(many=True)

    class Meta:
        model = JobListing
        fields = ['id','title', 'description', 'company', 'location','min_cgpa', 'eligible_branches', 'salary', 'due_date', 'post_date']

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
'''
    class Meta:
        model = User
        fields = ['username', 'first_name', 'roll_number', 'branch', 'cgpa', 'is_student', 'is_admin']

    def validate(self, data):
        # If the user is a student, ensure roll_number and branch are provided
        if data.get('is_student'):
            if not data.get('roll_number'):
                raise serializers.ValidationError({"roll_number": "Roll number is required for students."})
            if not data.get('branch'):
                raise serializers.ValidationError({"branch": "Branch is required for students."})
        
        # If the user is an admin, roll_number and branch should not be provided
        if data.get('is_admin'):
            data.pop('roll_number', None)  # Remove roll_number if it's present for admins
            data.pop('branch', None)  # Remove branch if it's present for admins
        
        return data

    def create(self, validated_data):
        # Extract branch data separately, if it exists
        branch_data = validated_data.pop('branch', None)
        
        # Create the user
        user = User.objects.create(**validated_data)

        # If the user is a student and branch is provided, set the branch
        if validated_data.get('is_student') and branch_data:
            branch = Branch.objects.get(id=branch_data['id'])
            user.branch = branch
        
        user.set_password(validated_data['password'])  # Set password securely
        user.save()

        return user
'''

        
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import datetime
from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    def create_user(self, roll_number, username, email, password=None, branch=None, cgpa=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')

        # If the user is a student, validate branch and cgpa
        if not extra_fields.get('is_admin'):
            if branch is None:
                raise ValueError('Branch is required for students')
            if cgpa is None:
                raise ValueError('CGPA is required for students')

        user = self.model(
            roll_number=roll_number,
            username=username,
            email=self.normalize_email(email),
            branch=branch,
            cgpa=cgpa,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, roll_number, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(roll_number, username, email, password, branch=None, cgpa=None, **extra_fields)

class Branch(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class User(AbstractUser):
    roll_number = models.CharField(max_length=10, unique=True, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    course = models.CharField(max_length=10, null=True, blank=True, default='Btech')
    is_student = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    def clean(self):
        # Ensure students have a roll number
        if not self.is_admin and not self.roll_number:
            raise ValidationError("Roll number is required for students.")
        # Ensure admins do not have a roll number
        if self.is_admin and self.roll_number:
            raise ValidationError("Admins should not have a roll number.")

    def __str__(self):
        return self.username

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    min_cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    eligible_branches = models.ManyToManyField(Branch)
    salary = models.DecimalField(max_digits=10, decimal_places= 2, default=3000000)
    due_date = models.DateField()
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs_posted', null=True, blank= True)
    post_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Application(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applied_jobs')
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='applications')
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')
    class Meta:
        unique_together = ('student','job')

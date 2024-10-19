from django.contrib.auth.models import AbstractUser
from django.db import models

class Branch(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class User(AbstractUser):
    roll_number = models.CharField(max_length=15, unique=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    is_student = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

class JobListing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255)
    min_cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    eligible_branches = models.ManyToManyField(Branch)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs_posted')
    post_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Application(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')

from django.contrib import admin
from .models import User, JobListing, Application, Branch

admin.site.register(User)
admin.site.register(JobListing)
admin.site.register(Application)
admin.site.register(Branch)

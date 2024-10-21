from django.contrib import admin
from .models import User, JobListing, Application, Branch
from django import forms


class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name','last_name','roll_number', 'username', 'email', 'password', 'branch', 'cgpa', 'is_student', 'is_admin')

    def clean(self):
        cleaned_data = super().clean()
        is_admin = cleaned_data.get('is_admin')

        # Ensure branch and cgpa are provided only for students
        if not is_admin:
            if not cleaned_data.get('branch'):
                self.add_error('branch', 'Branch is required for students.')
            if cleaned_data.get('cgpa') is None:
                self.add_error('cgpa', 'CGPA is required for students.')

class UserAdmin(admin.ModelAdmin):
    form = UserCreationForm

admin.site.register(User, UserAdmin)
admin.site.register(JobListing)
admin.site.register(Application)
admin.site.register(Branch)

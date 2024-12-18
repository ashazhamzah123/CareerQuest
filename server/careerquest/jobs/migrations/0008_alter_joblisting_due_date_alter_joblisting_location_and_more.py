# Generated by Django 5.1.2 on 2024-10-24 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0007_joblisting_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joblisting',
            name='due_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='joblisting',
            name='location',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='roll_number',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]

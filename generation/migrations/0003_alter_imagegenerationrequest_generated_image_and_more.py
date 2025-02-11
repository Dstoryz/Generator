# Generated by Django 5.1.4 on 2025-01-07 10:02

import django.db.models.deletion
import generation.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('generation', '0002_imagegenerationrequest_guidance_scale_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagegenerationrequest',
            name='generated_image',
            field=models.ImageField(upload_to='generated/', validators=[generation.models.validate_image]),
        ),
        migrations.CreateModel(
            name='PromptTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('prompt', models.TextField()),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(default='general', max_length=50)),
                ('is_public', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prompt_templates', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]

# users/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserProfile
from generation.models import ImageGenerationRequest
from django.db import models

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            return user
        raise serializers.ValidationError('Invalid credentials')

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'bio', 'avatar']

class UserStatsSerializer(serializers.Serializer):
    total_images = serializers.IntegerField()
    favorite_model = serializers.CharField()
    favorite_style = serializers.CharField()
    last_generated = serializers.DateTimeField()

    def to_representation(self, instance):
        user = instance
        images = ImageGenerationRequest.objects.filter(user=user)
        
        stats = {
            'total_images': images.count(),
            'favorite_model': images.values('model').annotate(
                count=models.Count('model')
            ).order_by('-count').first()['model'] if images.exists() else None,
            'favorite_style': images.values('style').annotate(
                count=models.Count('style')
            ).order_by('-count').first()['style'] if images.exists() else None,
            'last_generated': images.order_by('-created_at').first().created_at if images.exists() else None
        }
        
        return stats


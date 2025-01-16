# generation/serializers.py
from rest_framework import serializers
from .models import ImageGenerationRequest
import logging

logger = logging.getLogger(__name__)

class ImageGenerationRequestSerializer(serializers.ModelSerializer):
    generated_image = serializers.ImageField(read_only=True)
    original_prompt = serializers.CharField(read_only=True)

    class Meta:
        model = ImageGenerationRequest
        fields = [
            'id', 'original_prompt', 'prompt', 'model', 'style', 
            'n_steps', 'guidance_scale', 'seed', 'generated_image', 
            'thumbnail', 'created_at', 'width', 'height', 'safety_checker',
            'color_scheme',
            'sampler', 'clip_skip', 'tiling', 'hires_fix', 
            'denoising_strength', 'negative_prompt'
        ]
        read_only_fields = ['created_at', 'generated_image']

    def create(self, validated_data):
        # Проверка на наличие пользователя в запросе
        logger.debug("Validated data: %s", validated_data)
        validated_data.pop('user', None)
        user = self.context['request'].user
        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        # Убираем дополнительные параметры из validated_data
        n_steps = validated_data.pop('n_steps', 75)
        # high_noise_frac = validated_data.pop('high_noise_frac', 0.7)
        guidance_scale = validated_data.pop('guidance_scale', 9.5)
        logger.debug("Extracted n_steps: %s", n_steps)
        # Создаем запрос
        instance = ImageGenerationRequest.objects.create(user=user, **validated_data)

        # Добавляем параметры генерации
        instance.n_steps = n_steps
        # instance.high_noise_frac = high_noise_frac
        instance.guidance_scale = guidance_scale

        instance.save()

        return instance

    def validate_prompt(self, value):
        if not value.strip():
            raise serializers.ValidationError("Prompt cannot be empty.")
        return value

    def get_thumbnail_url(self, obj):
        if obj.generated_image:
            return obj.get_thumbnail_url()
        return None

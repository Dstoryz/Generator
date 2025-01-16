# generation/serializers.py
from rest_framework import serializers
from .models import ImageGenerationRequest
import logging
from .models_config import MODEL_CONFIG

logger = logging.getLogger(__name__)

class ImageGenerationRequestSerializer(serializers.ModelSerializer):
    generated_image = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    original_prompt = serializers.CharField(required=False)  # Делаем поле необязательным

    class Meta:
        model = ImageGenerationRequest
        fields = [
            'id', 'original_prompt', 'prompt', 'model', 'style', 
            'n_steps', 'guidance_scale', 'seed', 'generated_image', 
            'thumbnail', 'created_at', 'width', 'height', 'safety_checker',
            'color_scheme', 'sampler', 'clip_skip', 'tiling', 'hires_fix', 
            'denoising_strength', 'negative_prompt'
        ]
        read_only_fields = ['created_at', 'generated_image', 'thumbnail']

    def create(self, validated_data):
        try:
            # Получаем пользователя из контекста
            user = self.context['request'].user
            
            # Создаем запись с пользователем
            instance = ImageGenerationRequest.objects.create(
                user=user,
                **validated_data
            )
            
            return instance
        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            raise serializers.ValidationError(str(e))

    def validate(self, data):
        try:
            # Проверяем обязательные поля
            if not data.get('prompt'):
                raise serializers.ValidationError({"prompt": "This field is required."})
            
            if not data.get('model'):
                data['model'] = 'stable-diffusion-v1-5'  # Значение по умолчанию
            
            # Устанавливаем значения по умолчанию
            data.setdefault('style', 'none')
            data.setdefault('n_steps', 20)
            data.setdefault('guidance_scale', 7.5)
            data.setdefault('width', 512)
            data.setdefault('height', 512)
            data.setdefault('color_scheme', 'none')
            data.setdefault('safety_checker', True)
            data.setdefault('tiling', False)
            data.setdefault('hires_fix', False)
            data.setdefault('negative_prompt', '')

            # Проверяем параметры модели
            model_name = data['model']
            if model_name in MODEL_CONFIG:
                model_params = MODEL_CONFIG[model_name]["parameters"]
                
                # Проверяем n_steps
                if data['n_steps'] < model_params['steps']['min'] or data['n_steps'] > model_params['steps']['max']:
                    data['n_steps'] = model_params['steps']['default']
                
                # Проверяем guidance_scale
                if data['guidance_scale'] < model_params['guidance_scale']['min'] or data['guidance_scale'] > model_params['guidance_scale']['max']:
                    data['guidance_scale'] = model_params['guidance_scale']['default']

            return data
            
        except Exception as e:
            logger.error(f"Validation error: {str(e)}", exc_info=True)
            raise serializers.ValidationError(str(e))

    def get_generated_image(self, obj):
        if obj.generated_image:
            return self.context['request'].build_absolute_uri(obj.generated_image.url)
        return None

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return self.context['request'].build_absolute_uri(obj.thumbnail.url)
        return None

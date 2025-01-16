# generation/views.py
import io
import logging
from random import randint
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
from diffusers import AutoPipelineForText2Image
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated, AllowAny
import torch
from .models import ImageGenerationRequest
from .serializers import ImageGenerationRequestSerializer
from .models_config import MODEL_CONFIG, COMMON_SETTINGS  # Импорт конфигурации
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from .services import TranslationService

logger = logging.getLogger(__name__)

# Добавляем класс GetCSRFToken
@method_decorator(ensure_csrf_cookie, name='dispatch') # CSRF отключён, убедитесь, что токен не требуется
class GetCSRFToken(View):
    permission_classes = []  # Разрешаем доступ без аутентификации
    
    def get(self, request):
        return JsonResponse({'detail': 'CSRF cookie set'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({'detail': 'Successfully logged in'})
        else:
            return Response(
                {'detail': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

@method_decorator(csrf_exempt, name='dispatch')
class ImageGenerationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ImageGenerationRequestSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                # Получаем модель и параметры
                model_name = serializer.validated_data['model']
                prompt = serializer.validated_data['prompt']
                
                # Инициализируем пайплайн для выбранной модели
                model_config = MODEL_CONFIG[model_name]
                pipeline = AutoPipelineForText2Image.from_pretrained(
                    model_config["path"],
                    torch_dtype=model_config["torch_dtype"],
                    variant=model_config.get("variant")
                )

                # Генерируем изображение
                image_io = self.generate_image_with_pipeline(
                    pipeline=pipeline,
                    prompt=prompt,
                    n_steps=serializer.validated_data.get('n_steps', 20),
                    guidance_scale=serializer.validated_data.get('guidance_scale', 7.5),
                    seed=serializer.validated_data.get('seed'),
                    height=serializer.validated_data.get('height', 512),
                    width=serializer.validated_data.get('width', 512),
                    safety_checker=serializer.validated_data.get('safety_checker', True),
                    tiling=serializer.validated_data.get('tiling', False),
                    hires_fix=serializer.validated_data.get('hires_fix', False)
                )

                # Сохраняем результат
                instance = serializer.save()
                instance.generated_image.save(
                    f'generated_{instance.id}.png',
                    ContentFile(image_io.getvalue()),
                    save=True
                )

                return Response(
                    ImageGenerationRequestSerializer(
                        instance,
                        context={'request': request}
                    ).data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.error(f"Image generation failed: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def generate_image_with_pipeline(self, pipeline, prompt, n_steps, guidance_scale=7.5, seed=None, height=512, width=512, safety_checker=False, tiling=False, hires_fix=False):
        """
        Генерирует изображение с помощью заданного пайплайна.
        """
        try:
            # Перемещаем пайплайн на CUDA
            pipeline = pipeline.to("cuda")
            
            # Используем переданный seed или генерируем случайный
            if seed is None:
                seed = randint(0, 2 ** 32 - 1)
            
            # Создаем генератор на том же устройстве, что и пайплайн
            generator = torch.Generator(device=pipeline.device).manual_seed(seed)

            # Подробное логирование всех параметров генерации
            logger.info("=" * 50)
            logger.info("GENERATION PARAMETERS:")
            logger.info("=" * 50)
            logger.info(f"Model: {pipeline.__class__.__name__}")
            logger.info(f"Device: {pipeline.device}")
            logger.info(f"Prompt: {prompt}")
            logger.info(f"Steps: {n_steps}")
            logger.info(f"Guidance Scale: {guidance_scale}")
            logger.info(f"Seed: {seed}")
            logger.info(f"Height: {height}")
            logger.info(f"Width: {width}")
            logger.info(f"Safety Checker: {safety_checker}")
            logger.info(f"Tiling: {tiling}")
            logger.info(f"Hires Fix: {hires_fix}")
            logger.info("=" * 50)

            # Генерация изображения с полными параметрами
            image = pipeline(
                prompt=prompt,
                num_inference_steps=n_steps,
                guidance_scale=guidance_scale,
                generator=generator,
                height=height,
                width=width,
                safety_checker=safety_checker,
                tiling=tiling,
                hires_fix=hires_fix,
            ).images[0]

            # Очистка памяти CUDA
            del pipeline
            torch.cuda.empty_cache()

            # Сохранение результата
            image_io = io.BytesIO()
            image.save(image_io, format="PNG")
            image_io.seek(0)
            return image_io

        except Exception as e:
            logger.error(f"Error in generate_image_with_pipeline: {str(e)}")
            raise

@method_decorator(ensure_csrf_cookie, name='dispatch')
class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logger.info(f"Getting history for user: {request.user.username}")
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 12))
            
            queryset = ImageGenerationRequest.objects.filter(
                user=request.user
            ).order_by('-created_at')
            
            total_count = queryset.count()
            logger.info(f"Total records found: {total_count}")
            
            start = (page - 1) * per_page
            end = start + per_page
            
            paginated_queryset = queryset[start:end]
            logger.info(f"Returning records {start} to {end}")
            
            serializer = ImageGenerationRequestSerializer(
                paginated_queryset, 
                many=True,
                context={'request': request}
            )
            
            response_data = {
                'results': serializer.data,
                'count': total_count,
                'next': page * per_page < total_count,
                'previous': page > 1
            }
            logger.info("Successfully serialized history data")
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Error fetching history: {str(e)}", exc_info=True)
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk=None):
        """
        Удаляет запись из истории.
        """
        try:
            item = ImageGenerationRequest.objects.get(id=pk, user=request.user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ImageGenerationRequest.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


def process_prompt(prompt, style=None, color_scheme=None):
    """
    Обрабатывает пользовательский промпт на основе переданных параметров,
    добавляя настройки в конец промпта через запятую.
    """
    settings = []
    if style:
        settings.append(f"{style.capitalize()} style")
    if color_scheme:
        if color_scheme == 'vibrant':
            settings.append("vibrant and saturated colors")
        elif color_scheme == 'monochrome':
            settings.append("monochromatic color scheme")
        elif color_scheme == 'pastel':
            settings.append("soft pastel colors")
        elif color_scheme == 'dark':
            settings.append("dark and moody tones")
        elif color_scheme == 'neon':
            settings.append("bright neon colors")
        elif color_scheme == 'sepia':
            settings.append("warm sepia tones")
        elif color_scheme == 'vintage':
            settings.append("faded vintage colors")
        elif color_scheme == 'cyberpunk':
            settings.append("cyberpunk neon and dark contrast")
        elif color_scheme == 'autumn':
            settings.append("warm autumn colors")
        elif color_scheme == 'winter':
            settings.append("cool winter tones")
        elif color_scheme == 'summer':
            settings.append("bright summer colors")
        elif color_scheme == 'spring':
            settings.append("fresh spring colors")
        elif color_scheme == 'muted':
            settings.append("muted and subtle colors")
        elif color_scheme == 'earthy':
            settings.append("natural earth tones")
        elif color_scheme == 'rainbow':
            settings.append("full spectrum of rainbow colors")
        elif color_scheme == 'duotone':
            settings.append("two-color contrast scheme")
        elif color_scheme == 'noir':
            settings.append("high contrast black and white, film noir style")
        elif color_scheme == 'watercolor':
            settings.append("soft watercolor palette")
        elif color_scheme == 'synthwave':
            settings.append("retro synthwave purple and blue neon")
    
    return f"{prompt}, {', '.join(settings)}" if settings else prompt

class ModelParametersView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, model_name):
        if model_name not in MODEL_CONFIG:
            return Response(
                {"error": "Model not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Объединяем общие настройки и настройки конкретной модели
        parameters = {
            **COMMON_SETTINGS,
            **MODEL_CONFIG[model_name]["parameters"]
        }
        
        return Response(parameters)

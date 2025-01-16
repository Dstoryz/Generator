from django.apps import AppConfig
import os
from django.conf import settings


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        # Создаем директорию для аватаров при запуске приложения
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'avatars'), exist_ok=True)

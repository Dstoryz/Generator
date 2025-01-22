from django.core.management.base import BaseCommand
from generation.models import ImageGenerationRequest
from generation.utils.storage import YandexStorage
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Migrate existing images to Yandex Object Storage'

    def handle(self, *args, **kwargs):
        storage = YandexStorage()
        images = ImageGenerationRequest.objects.all()
        total = images.count()
        
        self.stdout.write(f'Found {total} images to migrate')
        
        success = 0
        errors = 0
        
        for i, image in enumerate(images, 1):
            self.stdout.write(f'Processing image {i}/{total}...')
            
            if image.generated_image:
                try:
                    # Получаем путь к файлу в media директории
                    local_path = os.path.join(settings.MEDIA_ROOT, str(image.generated_image))
                    
                    if os.path.exists(local_path):
                        with open(local_path, 'rb') as f:
                            key = f"generated/{image.user.id}/{os.path.basename(local_path)}"
                            url = storage.upload_image(f.read(), key)
                            image.generated_image = url
                            image.save()
                            success += 1
                            self.stdout.write(
                                self.style.SUCCESS(f'Successfully migrated image {image.id}')
                            )
                    else:
                        self.stdout.write(
                            self.style.WARNING(f'File not found: {local_path}')
                        )
                except Exception as e:
                    errors += 1
                    self.stdout.write(
                        self.style.ERROR(f'Error migrating image {image.id}: {e}')
                    )
            
            # Обрабатываем миниатюры
            if image.thumbnail:
                try:
                    local_path = os.path.join(settings.MEDIA_ROOT, str(image.thumbnail))
                    
                    if os.path.exists(local_path):
                        with open(local_path, 'rb') as f:
                            key = f"thumbnails/{image.user.id}/{os.path.basename(local_path)}"
                            url = storage.upload_image(f.read(), key)
                            image.thumbnail = url
                            image.save()
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error migrating thumbnail {image.id}: {e}')
                    )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nMigration completed:\n'
                f'Successfully migrated: {success}\n'
                f'Errors: {errors}\n'
                f'Total processed: {total}'
            )
        ) 
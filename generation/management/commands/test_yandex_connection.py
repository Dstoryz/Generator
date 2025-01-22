from django.core.management.base import BaseCommand
import boto3
from django.conf import settings

class Command(BaseCommand):
    help = 'Test connection to Yandex Object Storage'

    def handle(self, *args, **kwargs):
        try:
            # Создаем сессию
            session = boto3.session.Session(
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

            # Создаем клиент
            s3 = session.client(
                service_name='s3',
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                region_name=settings.AWS_S3_REGION_NAME,
                config=boto3.session.Config(
                    signature_version='s3v4',
                    s3={'addressing_style': 'virtual'}
                )
            )

            # Пробуем получить список объектов
            response = s3.list_objects_v2(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME
            )
            
            self.stdout.write(
                self.style.SUCCESS('Successfully connected to Yandex Storage')
            )
            
            # Пробуем загрузить тестовый файл
            test_content = b'Test content'
            s3.put_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key='test.txt',
                Body=test_content
            )
            
            self.stdout.write(
                self.style.SUCCESS('Successfully uploaded test file')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error: {str(e)}')
            ) 
from django.core.management.base import BaseCommand
import boto3
from django.conf import settings
import logging

class Command(BaseCommand):
    help = 'Test Yandex Storage connection with detailed logging'

    def handle(self, *args, **kwargs):
        # Включаем подробное логирование boto3
        logging.basicConfig(level=logging.DEBUG)

        try:
            self.stdout.write(f"Using settings:")
            self.stdout.write(f"Endpoint: {settings.AWS_S3_ENDPOINT_URL}")
            self.stdout.write(f"Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
            self.stdout.write(f"Region: {settings.AWS_S3_REGION_NAME}")
            self.stdout.write(f"Access Key: {settings.AWS_ACCESS_KEY_ID[:10]}...")
            
            session = boto3.session.Session()
            s3 = session.client(
                service_name='s3',
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

            # Пробуем получить список объектов
            self.stdout.write("Testing list_objects...")
            response = s3.list_objects_v2(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME
            )
            self.stdout.write(self.style.SUCCESS("List objects successful"))

            # Пробуем загрузить маленький тестовый файл
            self.stdout.write("Testing put_object...")
            s3.put_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key='test.txt',
                Body=b'test content',
                ContentType='text/plain'
            )
            self.stdout.write(self.style.SUCCESS("Put object successful"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error details: {str(e)}"))
            if hasattr(e, 'response'):
                self.stdout.write(self.style.ERROR(f"Error response: {e.response}")) 
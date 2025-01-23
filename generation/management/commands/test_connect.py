from django.core.management.base import BaseCommand
import boto3
from django.conf import settings

class Command(BaseCommand):
    help = 'Simple test to upload a file to Yandex Object Storage'

    def handle(self, *args, **kwargs):
        try:
            # Создаем клиент
            s3 = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                endpoint_url='https://storage.yandexcloud.net'
            )

            # Загружаем файл
            file_content = b'Hello, this is a test file!'
            file_name = 'test.txt'

            self.stdout.write('Trying to upload file...')
            
            s3.put_object(
                Bucket='my-first-storage123',
                Key=file_name,
                Body=file_content
            )
            
            self.stdout.write(self.style.SUCCESS('File uploaded successfully!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
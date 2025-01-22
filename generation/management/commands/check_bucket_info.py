from django.core.management.base import BaseCommand
import boto3
from django.conf import settings

class Command(BaseCommand):
    help = 'Check Yandex Storage bucket information'

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

            # Получаем информацию о бакете
            bucket_location = s3.get_bucket_location(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME
            )
            
            self.stdout.write(self.style.SUCCESS(f'Bucket information:'))
            self.stdout.write(f'Name: {settings.AWS_STORAGE_BUCKET_NAME}')
            self.stdout.write(f'Region: {bucket_location.get("LocationConstraint")}')
            
            # Проверяем CORS
            try:
                cors = s3.get_bucket_cors(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
                self.stdout.write(f'CORS Rules: {cors.get("CORSRules")}')
            except s3.exceptions.ClientError as e:
                if e.response['Error']['Code'] == 'NoSuchCORSConfiguration':
                    self.stdout.write(self.style.WARNING('No CORS configuration found'))
                else:
                    raise e

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error: {str(e)}')
            ) 
import boto3
from django.conf import settings
from botocore.config import Config

class YandexStorage:
    def __init__(self):
        self.bucket = settings.AWS_STORAGE_BUCKET_NAME
        self.session = boto3.session.Session()
        self.s3 = self.session.client(
            service_name='s3',
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
            config=Config(
                signature_version=settings.AWS_S3_SIGNATURE_VERSION,
                s3={'addressing_style': 'virtual'}
            )
        )

    def upload_image(self, image_data, key):
        try:
            self.s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=image_data,
                ContentType='image/jpeg'
            )
            return f"https://storage.yandexcloud.net/{self.bucket}/{key}"
        except Exception as e:
            print(f"Error uploading to Yandex Storage: {e}")
            raise

    def delete_image(self, key):
        try:
            self.s3.delete_object(
                Bucket=self.bucket,
                Key=key
            )
        except Exception as e:
            print(f"Error deleting from Yandex Storage: {e}")
            raise 
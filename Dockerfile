FROM python:3.10-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование файлов проекта
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Сборка статических файлов
RUN python manage.py collectstatic --noinput

# Настройка переменных окружения
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=ImageGenService.settings

# Запуск через gunicorn
CMD ["gunicorn", "ImageGenService.wsgi:application", "--bind", "0.0.0.0:8000"] 
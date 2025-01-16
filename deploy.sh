#!/bin/bash

# Сборка и запуск контейнеров
docker-compose build
docker-compose up -d

# Применение миграций
docker-compose exec web python manage.py migrate

# Создание суперпользователя
docker-compose exec web python manage.py createsuperuser

# Сбор статических файлов
docker-compose exec web python manage.py collectstatic --no-input 
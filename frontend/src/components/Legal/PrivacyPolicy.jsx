import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString();

  return (
    <Container maxWidth="md" className="terms-container">
      <Paper elevation={3} className="terms-paper">
        <Typography variant="h4" gutterBottom className="terms-title">
          Политика конфиденциальности
        </Typography>

        <Box className="terms-content">
          <Typography variant="h5" gutterBottom>1. Общие положения</Typography>
          <Typography paragraph>
            1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса Image Generator.
          </Typography>
          <Typography paragraph>
            1.2. Используя Сервис, Пользователь дает согласие на обработку своих персональных данных в соответствии с настоящей Политикой.
          </Typography>

          <Typography variant="h5" gutterBottom>2. Собираемые данные</Typography>
          <Typography paragraph>
            2.1. При регистрации и использовании Сервиса мы собираем следующую информацию:
          </Typography>
          <ul>
            <li>Имя пользователя и адрес электронной почты</li>
            <li>История генерации изображений</li>
            <li>Настройки и предпочтения пользователя</li>
            <li>Техническая информация об устройстве и браузере</li>
          </ul>

          <Typography variant="h5" gutterBottom>3. Цели обработки данных</Typography>
          <Typography paragraph>
            3.1. Мы обрабатываем персональные данные для:
          </Typography>
          <ul>
            <li>Предоставления доступа к функциям Сервиса</li>
            <li>Улучшения качества обслуживания</li>
            <li>Отправки уведомлений о работе Сервиса</li>
            <li>Технической поддержки пользователей</li>
          </ul>

          <Typography variant="h5" gutterBottom>4. Хранение и защита данных</Typography>
          <Typography paragraph>
            4.1. Мы принимаем необходимые технические и организационные меры для защиты персональных данных от несанкционированного доступа.
          </Typography>
          <Typography paragraph>
            4.2. Данные хранятся на защищенных серверах и обрабатываются с использованием современных методов шифрования.
          </Typography>

          <Typography variant="h5" gutterBottom>5. Передача данных третьим лицам</Typography>
          <Typography paragraph>
            5.1. Мы не передаем персональные данные третьим лицам, за исключением случаев:
          </Typography>
          <ul>
            <li>Получения явного согласия пользователя</li>
            <li>Требования законодательства</li>
            <li>Необходимости защиты прав и безопасности пользователей</li>
          </ul>

          <Typography variant="h5" gutterBottom>6. Права пользователей</Typography>
          <Typography paragraph>
            6.1. Пользователь имеет право:
          </Typography>
          <ul>
            <li>Получать информацию об обработке своих данных</li>
            <li>Требовать исправления неточных данных</li>
            <li>Требовать удаления своих данных</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>

          <Typography variant="h5" gutterBottom>7. Файлы cookie</Typography>
          <Typography paragraph>
            7.1. Сервис использует файлы cookie для улучшения пользовательского опыта и сбора статистики.
          </Typography>
          <Typography paragraph>
            7.2. Пользователь может отключить использование cookie в настройках браузера.
          </Typography>

          <Typography variant="h5" gutterBottom>8. Изменения политики</Typography>
          <Typography paragraph>
            8.1. Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.
          </Typography>
          <Typography paragraph>
            8.2. При внесении существенных изменений мы уведомим пользователей через Сервис или по электронной почте.
          </Typography>

          <Typography variant="caption" display="block" className="terms-date">
            Последнее обновление: {currentDate}
          </Typography>
        </Box>

        <Box className="terms-actions">
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            className="terms-back-button"
          >
            Вернуться назад
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicy; 
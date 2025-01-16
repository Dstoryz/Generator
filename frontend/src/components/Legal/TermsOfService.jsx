import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

function TermsOfService() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString();

  return (
    <Container maxWidth="md" className="terms-container">
      <Paper elevation={3} className="terms-paper">
        <Typography variant="h4" gutterBottom className="terms-title">
          Пользовательское соглашение
        </Typography>

        <Box className="terms-content">
          <Typography variant="h5" gutterBottom>1. Общие положения</Typography>
          <Typography paragraph>
            1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между сервисом Image Generator (далее — «Сервис») и пользователем сети Интернет (далее — «Пользователь»), возникающие при использовании Сервиса.
          </Typography>
          <Typography paragraph>
            1.2. Используя Сервис, Пользователь подтверждает, что полностью принимает условия настоящего Соглашения.
          </Typography>

          <Typography variant="h5" gutterBottom>2. Предмет соглашения</Typography>
          <Typography paragraph>
            2.1. Сервис предоставляет Пользователю возможность генерации изображений с использованием искусственного интеллекта на условиях настоящего Соглашения.
          </Typography>
          <Typography paragraph>
            2.2. Все существующие функции Сервиса предоставляются "как есть". Сервис не гарантирует, что все функции будут соответствовать ожиданиям Пользователя.
          </Typography>

          <Typography variant="h5" gutterBottom>3. Права и обязанности Пользователя</Typography>
          <Typography paragraph>
            3.1. Пользователь обязуется не использовать Сервис для генерации контента, нарушающего законодательство или права третьих лиц.
          </Typography>
          <Typography paragraph>
            3.2. Пользователь несет полную ответственность за содержание запросов, отправляемых в Сервис.
          </Typography>
          <Typography paragraph>
            3.3. Пользователь имеет право использовать сгенерированные изображения в личных и коммерческих целях, если это не нарушает права третьих лиц.
          </Typography>

          <Typography variant="h5" gutterBottom>4. Ограничение ответственности</Typography>
          <Typography paragraph>
            4.1. Сервис предоставляется на условиях "как есть" (as is). Администрация Сервиса не несет ответственности за любые прямые или косвенные убытки, возникшие в результате использования или невозможности использования Сервиса.
          </Typography>
          <Typography paragraph>
            4.2. Сервис не гарантирует, что:
            - Сервис будет соответствовать требованиям Пользователя;
            - Сервис будет работать непрерывно, быстро, надежно и без ошибок;
            - Результаты, полученные при использовании Сервиса, будут точными и надежными.
          </Typography>

          <Typography variant="h5" gutterBottom>5. Интеллектуальная собственность</Typography>
          <Typography paragraph>
            5.1. Все права на сгенерированные изображения принадлежат Пользователю, создавшему их с помощью Сервиса.
          </Typography>
          <Typography paragraph>
            5.2. Сервис не претендует на права интеллектуальной собственности на сгенерированные изображения.
          </Typography>

          <Typography variant="h5" gutterBottom>6. Конфиденциальность</Typography>
          <Typography paragraph>
            6.1. Сервис обязуется не передавать персональные данные Пользователя третьим лицам, за исключением случаев, предусмотренных законодательством.
          </Typography>

          <Typography variant="h5" gutterBottom>7. Изменение условий</Typography>
          <Typography paragraph>
            7.1. Администрация Сервиса оставляет за собой право изменять условия настоящего Соглашения без предварительного уведомления Пользователя.
          </Typography>
          <Typography paragraph>
            7.2. Продолжение использования Сервиса после внесения изменений означает принятие Пользователем новых условий Соглашения.
          </Typography>

          <Typography variant="h5" gutterBottom>8. Заключительные положения</Typography>
          <Typography paragraph>
            8.1. В случае возникновения споров или разногласий, связанных с исполнением настоящего Соглашения, Пользователь и Сервис приложат все усилия для их разрешения путем переговоров.
          </Typography>
          <Typography paragraph>
            8.2. Если какое-либо положение настоящего Соглашения будет признано недействительным, это не влияет на действительность остальных положений.
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

export default TermsOfService; 
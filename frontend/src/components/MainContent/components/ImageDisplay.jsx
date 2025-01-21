import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ImageControls from './ImageControls';
import './ImageDisplay.css';

function ImageDisplay({ image, loading, error }) {
  return (
    <Paper className="image-display" elevation={0}>
      {loading ? (
        <Box className="image-display-loading">
          <CircularProgress size={64} />
          <Typography variant="h6" className="loading-text">
            Генерация изображения может занять несколько минут...
          </Typography>
        </Box>
      ) : error ? (
        <Box className="image-display-error">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : image ? (
        <Box className="image-display-result">
          <img 
            src={image} 
            alt="Generated" 
            className="generated-image"
            onError={(e) => {
              console.error('Error loading image:', e);
            }}
          />
          <ImageControls />
        </Box>
      ) : (
        <Box className="image-display-placeholder">
          <ImageIcon sx={{ fontSize: 96 }} />
          <Typography variant="h5" className="placeholder-text">
            Очень подробно напишите, что вы хотите создать.
          </Typography>
          <Typography variant="h6" className="placeholder-subtext">
            Выберите стиль обработки и версию нейросети
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ImageDisplay; 
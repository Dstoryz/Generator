import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { generationService } from '../../../api/generationService';
import './HistoryPanel.css';

function HistoryPanel({ onImageSelect, newGeneration }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (newGeneration) {
      setHistory(prev => [newGeneration, ...prev]);
    }
  }, [newGeneration]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generationService.getHistory(1, 5);
      if (response && response.results) {
        setHistory(response.results);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item) => {
    console.log('Card clicked:', item);

    if (!item || !item.generated_image) {
      console.warn('Invalid item or missing image:', item);
      return;
    }

    // Формируем полный URL изображения
    const imageUrl = item.generated_image.startsWith('http')
      ? item.generated_image
      : `http://localhost:8000${item.generated_image}`;

    console.log('Image URL:', imageUrl);

    // Подготавливаем объект с настройками из истории
    const settings = {
      model: item.model || 'stable-diffusion-v1-5',
      style: item.style || 'none',
      n_steps: item.n_steps || 75,
      guidance_scale: item.guidance_scale || 7.5,
      seed: item.seed || '',
      width: item.width || 512,
      height: item.height || 512,
      negative_prompt: item.negative_prompt || '',
      sampler: item.sampler || 'DPM++ 2M Karras',
      clip_skip: item.clip_skip || 1,
      tiling: item.tiling || false,
      hires_fix: item.hires_fix || false,
      denoising_strength: item.denoising_strength || 0.7,
      safety_checker: item.safety_checker !== undefined ? item.safety_checker : true,
      color_scheme: item.color_scheme || 'none'
    };

    console.log('Settings:', settings);

    // Передаем оригинальный промпт, если он есть
    const promptText = item.original_prompt || item.prompt || '';
    console.log('Prompt:', promptText);

    try {
      onImageSelect(imageUrl, promptText, settings);
    } catch (error) {
      console.error('Error in onImageSelect:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Предотвращаем всплытие события клика
    try {
      await generationService.deleteFromHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    <Box className="history-panel">
      <Typography variant="h6" className="history-panel-title">
        Recent Generations
      </Typography>
      
      <Box className="history-panel-list">
        {loading ? (
          <Box className="history-panel-loading">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="history-panel-error">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : history.length === 0 ? (
          <Box className="history-panel-empty">
            <Typography>No generations yet</Typography>
          </Box>
        ) : (
          history.map(item => (
            <Card 
              key={item.id} 
              className="history-panel-item"
              onClick={() => handleCardClick(item)}
              sx={{ cursor: 'pointer' }}
            >
              {item.generated_image ? (
                <CardMedia
                  component="img"
                  image={item.generated_image}
                  alt={item.prompt}
                  className="history-panel-image"
                />
              ) : (
                <Box className="history-panel-placeholder">
                  <Typography variant="body2">
                    Image not available
                  </Typography>
                </Box>
              )}
              <CardContent className="history-panel-content">
                <Typography className="history-panel-prompt">
                  {item.original_prompt || item.prompt || 'No prompt'}
                </Typography>
                <Box className="history-panel-tags">
                  {item.model && (
                    <Chip 
                      label={item.model}
                      size="small"
                      className="history-panel-tag"
                    />
                  )}
                  {item.style && item.style !== 'none' && (
                    <Chip 
                      label={item.style}
                      size="small"
                      className="history-panel-tag"
                    />
                  )}
                </Box>
                <Box className="history-panel-actions">
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="history-panel-delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}

export default HistoryPanel; 
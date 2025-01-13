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
      const response = await generationService.getHistory(1, 5); // Загружаем только 5 последних
      
      if (response && response.results) {
        setHistory(Array.isArray(response.results) ? response.results : []);
      } else if (Array.isArray(response)) {
        setHistory(response);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    try {
      await generationService.deleteFromHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  if (loading) {
    return (
      <Box className="history-panel-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="history-panel-error">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="history-panel">
      <Typography variant="h6" className="history-panel-title">
        Recent Generations
      </Typography>

      <Box className="history-panel-list">
        {history.length === 0 ? (
          <Typography className="history-panel-empty">
            No generations yet
          </Typography>
        ) : (
          history.map((item) => (
            <Card 
              key={item.id} 
              className="history-panel-item"
              onClick={() => onImageSelect(item)}
            >
              {item.generated_image ? (
                <CardMedia
                  component="img"
                  image={item.generated_image.startsWith('http') 
                    ? item.generated_image 
                    : `http://localhost:8000${item.generated_image}`}
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
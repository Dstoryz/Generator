import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Pagination,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { generationService } from '../../api/generationService';
import DeleteConfirmDialog from '../MainContent/components/DeleteConfirmDialog';
import ImagePreviewDialog from '../MainContent/components/ImagePreviewDialog';
import './GenerationHistory.css';

function GenerationHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const itemsPerPage = 12;

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generationService.getHistory(page, itemsPerPage);
      
      if (response && response.results) {
        setHistory(response.results);
        setTotalPages(Math.ceil(response.count / itemsPerPage));
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCardClick = (item) => {
    // Формируем полный URL изображения
    const imageUrl = item.generated_image.startsWith('http')
      ? item.generated_image
      : `http://localhost:8000${item.generated_image}`;

    // Подготавливаем объект с настройками
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

    // Сохраняем данные в localStorage
    localStorage.setItem('selectedImage', imageUrl);
    localStorage.setItem('selectedPrompt', item.original_prompt || item.prompt);
    localStorage.setItem('selectedSettings', JSON.stringify(settings));

    // Переходим на главную страницу
    navigate('/');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    try {
      await generationService.deleteFromHistory(id);
      await loadHistory();
    } catch (err) {
      console.error('Error deleting image:', err);
    }
    setDeleteDialogOpen(false);
  };

  const handlePreviewClick = (e, imageUrl) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setSelectedImage(imageUrl);
    setPreviewDialogOpen(true);
  };

  if (loading) {
    return (
      <Box className="history-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="history-error">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="history-container">
      <Box className="history-header">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          className="back-button"
        >
          Back to Generator
        </Button>
        <Typography variant="h4" className="history-title">
          Generation History
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card 
              className="history-card"
              onClick={() => handleCardClick(item)}
            >
              <CardMedia
                component="img"
                image={item.generated_image}
                alt={item.prompt}
                className="history-image"
                onClick={(e) => handlePreviewClick(e, item.generated_image)}
              />
              <CardContent className="history-content">
                <Typography className="history-prompt">
                  {item.original_prompt || item.prompt}
                </Typography>
                
                <Box className="history-tags">
                  {item.model && (
                    <Chip label={item.model} size="small" className="history-tag" />
                  )}
                  {item.style && item.style !== 'none' && (
                    <Chip label={item.style} size="small" className="history-tag" />
                  )}
                </Box>

                <Box className="history-details">
                  <Typography className="history-detail">
                    <strong>Steps:</strong> {item.n_steps}
                  </Typography>
                  <Typography className="history-detail">
                    <strong>CFG:</strong> {item.guidance_scale}
                  </Typography>
                  <Typography className="history-detail">
                    <strong>Size:</strong> {item.width}×{item.height}
                  </Typography>
                  {item.seed && (
                    <Typography className="history-detail">
                      <strong>Seed:</strong> {item.seed}
                    </Typography>
                  )}
                </Box>

                <Box className="history-actions">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Предотвращаем всплытие события
                      setSelectedImage(item);
                      setDeleteDialogOpen(true);
                    }}
                    className="history-delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box className="history-pagination">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => handleDelete(selectedImage?.id)}
      />

      <ImagePreviewDialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        imageUrl={selectedImage}
      />
    </Box>
  );
}

export default GenerationHistory; 
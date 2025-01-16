import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { generationService } from '../../api/generationService';
import './GenerationHistory.css';

function GenerationHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generationService.getHistory(page, itemsPerPage);
      if (response && response.results) {
        setHistory(response.results);
        setTotalItems(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / itemsPerPage));
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

    // Сохраняем данные в localStorage для передачи на главную страницу
    localStorage.setItem('selectedImage', imageUrl);
    localStorage.setItem('selectedPrompt', item.original_prompt || item.prompt || '');
    localStorage.setItem('selectedSettings', JSON.stringify(settings));

    // Переходим на главную страницу
    navigate('/');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await generationService.deleteFromHistory(id);
      loadHistory();
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleDownload = (url, prompt, e) => {
    e.stopPropagation();
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `generation-${prompt.slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

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

      {loading ? (
        <Box className="history-loading">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="history-error">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {history.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                className="history-card"
                onClick={() => handleCardClick(item)}
              >
                {item.generated_image ? (
                  <CardMedia
                    component="img"
                    image={item.generated_image.startsWith('http') 
                      ? item.generated_image 
                      : `http://localhost:8000${item.generated_image}`}
                    alt={item.prompt}
                    className="history-image"
                  />
                ) : (
                  <Box className="history-image-placeholder">
                    <Typography variant="body2">
                      Image not available
                    </Typography>
                  </Box>
                )}
                <CardContent className="history-content">
                  <Typography className="history-prompt">
                    {item.original_prompt || item.prompt || 'No prompt'}
                  </Typography>
                  <Box className="history-tags">
                    {item.model && (
                      <Chip 
                        label={item.model}
                        size="small"
                        className="history-tag"
                      />
                    )}
                    {item.style && item.style !== 'none' && (
                      <Chip 
                        label={item.style}
                        size="small"
                        className="history-tag"
                      />
                    )}
                    {item.color_scheme && item.color_scheme !== 'none' && (
                      <Chip 
                        label={item.color_scheme}
                        size="small"
                        className="history-tag"
                      />
                    )}
                  </Box>
                  <Box className="history-details">
                    <Typography variant="caption" className="history-detail">
                      <strong>Steps:</strong> {item.n_steps || 75}
                    </Typography>
                    <Typography variant="caption" className="history-detail">
                      <strong>CFG:</strong> {item.guidance_scale || 7.5}
                    </Typography>
                    <Typography variant="caption" className="history-detail">
                      <strong>Size:</strong> {item.width}×{item.height}
                    </Typography>
                    {item.seed && (
                      <Typography variant="caption" className="history-detail">
                        <strong>Seed:</strong> {item.seed}
                      </Typography>
                    )}
                    {item.sampler && (
                      <Typography variant="caption" className="history-detail">
                        <strong>Sampler:</strong> {item.sampler}
                      </Typography>
                    )}
                  </Box>
                  <Box className="history-flags">
                    {item.tiling && (
                      <Chip 
                        label="Tiling"
                        size="small"
                        className="history-flag"
                      />
                    )}
                    {item.hires_fix && (
                      <Chip 
                        label="Hires.fix"
                        size="small"
                        className="history-flag"
                      />
                    )}
                    {item.safety_checker && (
                      <Chip 
                        label="Safe"
                        size="small"
                        className="history-flag"
                      />
                    )}
                  </Box>
                  <Box className="history-actions">
                    {item.generated_image && (
                      <Tooltip title="Download">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleDownload(item.generated_image, item.prompt, e)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleDelete(item.id, e)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box className="history-pagination">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default GenerationHistory; 
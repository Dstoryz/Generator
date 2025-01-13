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
        setHistory(Array.isArray(response.results) ? response.results : []);
        setTotalItems(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / itemsPerPage));
      } else if (Array.isArray(response)) {
        setHistory(response);
        setTotalItems(response.length);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } else {
        console.error('Unexpected response structure:', response);
        setHistory([]);
        setTotalPages(1);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError(err.message || 'Failed to load history');
      setHistory([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await generationService.deleteFromHistory(id);
      loadHistory(page);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleDownload = (url, prompt) => {
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

  if (!history.length) {
    return (
      <Box className="history-empty">
        <Typography variant="h6" color="textSecondary">
          No generations found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="history-container">
      <Box className="history-header">
        <Button
          variant="contained"
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
            <Card className="history-card">
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
                  <Typography variant="body2" color="textSecondary">
                    Image not available
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="subtitle1" className="history-prompt">
                  {item.original_prompt || item.prompt || 'No prompt'}
                </Typography>
                <Typography variant="caption" className="history-timestamp">
                  {new Date(item.created_at).toLocaleString()}
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
                </Box>
                <Box className="history-actions">
                  {item.generated_image && (
                    <Tooltip title="Download">
                      <IconButton 
                        onClick={() => handleDownload(item.generated_image, item.prompt)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton 
                      onClick={() => handleDelete(item.id)}
                      color="error"
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
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Paper, TextField, Button, Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './PromptForm.css';

const PromptForm = forwardRef(({ onSubmit, loading }, ref) => {
  const [prompt, setPrompt] = useState('');

  // Экспортируем метод setPrompt через ref
  useImperativeHandle(ref, () => ({
    setPrompt: (newPrompt) => {
      console.log('Setting new prompt:', newPrompt);
      setPrompt(newPrompt);
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <Paper className="prompt-form">
      <Typography variant="h6" className="prompt-form-title">
        Создать изображение
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          className="prompt-input"
          fullWidth
          label="Опишите изображение"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={4}
          required
          disabled={loading}
          variant="outlined"
          placeholder="Например: космический корабль в стиле киберпанк"
        />
        
        <Box className="prompt-form-actions">
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !prompt.trim()}
            endIcon={<SendIcon />}
            className="submit-button"
          >
            {loading ? 'Создаем...' : 'Создать'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
});

export default PromptForm; 
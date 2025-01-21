import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Tooltip,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExplicitIcon from '@mui/icons-material/Explicit';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { 
  SAMPLER_OPTIONS, 
  ADVANCED_SETTINGS 
} from '../constants';

const SETTINGS_INFO = {
  seed: {
    title: "Seed",
    description: "Уникальное число, определяющее результат генерации. Одинаковый seed при тех же настройках даст одинаковый результат"
  },
  steps: {
    title: "Steps",
    description: "Количество шагов генерации. Больше шагов = лучше качество, но дольше генерация"
  },
  guidance_scale: {
    title: "Guidance Scale",
    description: "Насколько строго модель следует промпту. Высокие значения дают более точный результат, но могут ухудшить качество"
  },
  sampler: {
    title: "Sampler",
    description: "Алгоритм генерации изображения. Разные сэмплеры дают разные результаты и скорость работы"
  },
  negative_prompt: {
    title: "Negative Prompt",
    description: "Описание того, чего НЕ должно быть на изображении"
  },
  denoising_strength: {
    title: "Denoising Strength",
    description: "Сила шумоподавления. Влияет на степень изменения исходного изображения"
  },
  safety_filter: {
    title: "Safety Filter",
    description: "Фильтрует NSFW-контент и неприемлемые изображения. Может размыть или заблокировать части изображения, которые считает небезопасными. Рекомендуется оставить включенным."
  }
};

function SettingLabel({ title, description }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{title}</Typography>
      <Tooltip title={description} placement="right">
        <IconButton size="small" sx={{ padding: '2px' }}>
          <HelpOutlineIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function AdvancedSettings({ settings, onChange, modelParameters }) {
  if (!modelParameters) return null;

  return (
    <Box className="advanced-settings">
      {modelParameters.negative_prompt?.enabled && (
        <FormControl fullWidth margin="normal">
          <Typography>Negative Prompt</Typography>
          <TextField
            multiline
            rows={2}
            value={settings.negative_prompt || ''}
            onChange={(e) => onChange({ negative_prompt: e.target.value })}
          />
        </FormControl>
      )}

      {modelParameters.seed?.enabled && (
        <FormControl fullWidth margin="normal">
          <Typography>Seed</Typography>
          <TextField
            type="number"
            value={settings.seed || ''}
            onChange={(e) => onChange({ seed: e.target.value })}
          />
        </FormControl>
      )}

      {/* Добавьте другие расширенные настройки */}
    </Box>
  );
}

export default AdvancedSettings; 
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

function AdvancedSettings({ settings, onChange }) {
  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 2147483647);
    onChange({ seed: newSeed });
  };

  const handleSeedChange = (event) => {
    const value = parseInt(event.target.value);
    if (isNaN(value)) {
        onChange({ seed: '' });
    } else {
        // Ограничиваем значение
        const limitedValue = Math.min(Math.max(value, -2147483648), 2147483647);
        onChange({ seed: limitedValue });
    }
  };

  return (
    <Box className="advanced-settings">
      <FormControl fullWidth margin="normal">
        <SettingLabel {...SETTINGS_INFO.seed} />
        <TextField
          value={settings.seed || ''}
          onChange={handleSeedChange}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Generate Random Seed">
                  <IconButton onClick={generateRandomSeed} edge="end">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          placeholder="Enter seed or leave empty for random"
        />
      </FormControl>

      <Box>
        <SettingLabel {...SETTINGS_INFO.steps} />
        <Slider
          value={settings.n_steps}
          min={20}
          max={150}
          step={1}
          onChange={(e, value) => onChange({ n_steps: value })}
          valueLabelDisplay="auto"
          marks={[
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' }
          ]}
        />
      </Box>

      <Box>
        <SettingLabel {...SETTINGS_INFO.guidance_scale} />
        <Slider
          value={settings.guidance_scale}
          min={1}
          max={20}
          step={0.5}
          onChange={(e, value) => onChange({ guidance_scale: value })}
          valueLabelDisplay="auto"
          marks={[
            { value: 1, label: '1' },
            { value: 7.5, label: '7.5' },
            { value: 15, label: '15' },
            { value: 20, label: '20' }
          ]}
        />
      </Box>

      <FormControl fullWidth margin="normal">
        <SettingLabel {...SETTINGS_INFO.sampler} />
        <Select
          value={settings.sampler}
          onChange={(e) => onChange({ sampler: e.target.value })}
        >
          {SAMPLER_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <SettingLabel {...SETTINGS_INFO.negative_prompt} />
        <TextField
          fullWidth
          multiline
          rows={2}
          margin="normal"
          label="Negative Prompt"
          value={settings.negative_prompt}
          onChange={(e) => onChange({ negative_prompt: e.target.value })}
        />
      </Box>

      <Box>
        <SettingLabel {...SETTINGS_INFO.denoising_strength} />
        <Slider
          value={settings.denoising_strength}
          min={0}
          max={1}
          step={0.05}
          onChange={(e, value) => onChange({ denoising_strength: value })}
        />
      </Box>

      <Box className="setting-group">
        <SettingLabel {...SETTINGS_INFO.safety_filter} />
        <FormControlLabel
          control={
            <Switch
              checked={settings.safety_checker}
              onChange={(e) => onChange({ safety_checker: e.target.checked })}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Safety Filter</Typography>
              <Box
                sx={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: settings.safety_checker ? 'success.main' : 'error.main',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                18+
              </Box>
            </Box>
          }
        />
      </Box>

      {Object.entries(ADVANCED_SETTINGS).filter(([key]) => key !== 'safety_checker').map(([key, setting]) => (
        <Tooltip key={key} title={setting.description}>
          <FormControlLabel
            control={
              <Switch
                checked={settings[key]}
                onChange={(e) => onChange({ [key]: e.target.checked })}
              />
            }
            label={setting.label}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default AdvancedSettings; 
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Box,
  InputLabel,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  MODEL_OPTIONS,
  STYLE_OPTIONS,
  COLOR_SCHEME,
  SAMPLER_OPTIONS,
  RESOLUTION_OPTIONS,
} from '../constants';
import AdvancedSettings from './AdvancedSettings';
import './Settings.css';
import { generationService } from '../../../api/generationService';

function Settings({ settings, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [modelParams, setModelParams] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResolutionChange = (event) => {
    const selectedResolution = RESOLUTION_OPTIONS.find(opt => opt.value === event.target.value);
    onSettingsChange({
      width: selectedResolution.width,
      height: selectedResolution.height
    });
  };

  useEffect(() => {
    const fetchModelParameters = async () => {
      try {
        const params = await generationService.getModelParameters(settings.model);
        setModelParams(params);
      } catch (error) {
        console.error('Error fetching model parameters:', error);
      }
    };
    
    fetchModelParameters();
  }, [settings.model]);

  const renderSettingField = (paramKey, paramConfig) => {
    if (!paramConfig.enabled) return null;

    switch (paramKey) {
      case 'steps':
        return (
          <FormControl fullWidth margin="normal">
            <Typography>Steps</Typography>
            <Slider
              value={settings.n_steps || paramConfig.default}
              onChange={(_, value) => onSettingsChange({ n_steps: value })}
              min={paramConfig.min}
              max={paramConfig.max}
              valueLabelDisplay="auto"
            />
          </FormControl>
        );

      case 'guidance_scale':
        return (
          <FormControl fullWidth margin="normal">
            <Typography>Guidance Scale</Typography>
            <Slider
              value={settings.guidance_scale || paramConfig.default}
              onChange={(_, value) => onSettingsChange({ guidance_scale: value })}
              min={paramConfig.min}
              max={paramConfig.max}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </FormControl>
        );

      case 'width':
      case 'height':
        if (!paramConfig.options) return null;
        return (
          <FormControl fullWidth margin="normal">
            <Typography>{paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}</Typography>
            <Select
              value={settings[paramKey] || paramConfig.default}
              onChange={(e) => onSettingsChange({ [paramKey]: e.target.value })}
            >
              {paramConfig.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}px
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'safety_checker':
      case 'tiling':
      case 'hires_fix':
        return (
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              control={
                <Switch
                  checked={settings[paramKey] ?? paramConfig.default}
                  onChange={(e) => onSettingsChange({ [paramKey]: e.target.checked })}
                />
              }
              label={paramKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            />
          </FormControl>
        );

      case 'sampler':
        return (
          <FormControl fullWidth margin="normal">
            <Typography>Sampler</Typography>
            <Select
              value={settings.sampler || paramConfig.default}
              onChange={(e) => onSettingsChange({ sampler: e.target.value })}
            >
              {paramConfig.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      // Добавьте другие типы настроек по необходимости
    }
  };

  return (
    <Paper className="settings-panel">
      <Typography variant="h6" className="settings-title">
        Generation Settings
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Basic" />
        <Tab label="Advanced" />
      </Tabs>

      <Box className="settings-content">
        {activeTab === 0 ? (
          <>
            <FormControl fullWidth margin="normal">
              <Typography>Model</Typography>
              <Select
                value={settings.model}
                onChange={(e) => onSettingsChange({ model: e.target.value })}
              >
                {MODEL_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Style</Typography>
              <Select
                value={settings.style}
                onChange={(e) => onSettingsChange({ style: e.target.value })}
              >
                {STYLE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography>Color Scheme</Typography>
              <Select
                value={settings.color_scheme}
                onChange={(e) => onSettingsChange({ color_scheme: e.target.value })}
              >
                {COLOR_SCHEME.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {modelParams && Object.entries(modelParams).map(([key, config]) => (
              renderSettingField(key, config)
            ))}
          </>
        ) : (
          <AdvancedSettings 
            settings={settings} 
            onChange={onSettingsChange}
            modelParameters={modelParams} 
          />
        )}
      </Box>
    </Paper>
  );
}

export default Settings; 
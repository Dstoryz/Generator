import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import PromptForm from './components/PromptForm';
import Settings from './components/Settings';
import { generationService } from '../../api/generationService';
import './MainContent.css';
import PromptTemplates from './components/PromptTemplates';
import PromptTemplateDialog from './components/PromptTemplateDialog';

function MainContent() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastGeneration, setLastGeneration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    model: 'stable-diffusion-v1-5',
    style: 'none',
    n_steps: 75,
    guidance_scale: 7.5,
    seed: ''
  });
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [settings, setSettings] = useState({
    model: 'stable-diffusion-v1-5',
    style: 'none',
    n_steps: 75,
    guidance_scale: 7.5,
    seed: '',
    width: 512,
    height: 512,
    color_scheme: 'none',
    tiling: false,
  });
  const [prompt, setPrompt] = useState('');
  const [modelParameters, setModelParameters] = useState(null);

  const promptFormRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        console.log('Auth token present:', token);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Проверяем наличие сохраненных данных
    const savedImage = localStorage.getItem('selectedImage');
    const savedPrompt = localStorage.getItem('selectedPrompt');
    const savedSettings = localStorage.getItem('selectedSettings');

    if (savedImage && savedPrompt && savedSettings) {
      try {
        // Устанавливаем сохраненные данные
        setSelectedImage(savedImage);
        if (promptFormRef.current) {
          promptFormRef.current.setPrompt(savedPrompt);
        }
        setSettings(JSON.parse(savedSettings));

        // Очищаем localStorage
        localStorage.removeItem('selectedImage');
        localStorage.removeItem('selectedPrompt');
        localStorage.removeItem('selectedSettings');
      } catch (error) {
        console.error('Error restoring saved generation:', error);
      }
    }
  }, []); // Выполняется только при монтировании

  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const handleImageSelect = (image, prompt, settings) => {
    console.log('MainContent - handleImageSelect called');
    console.log('Image:', image);
    console.log('Prompt:', prompt);
    console.log('Settings:', settings);

    // Проверяем ref перед использованием
    if (!promptFormRef.current) {
      console.error('promptFormRef is not initialized');
      return;
    }

    try {
      setSelectedImage(image);
      promptFormRef.current.setPrompt(prompt);
      setSettings(prevSettings => {
        const newSettings = {
          ...prevSettings,
          ...settings
        };
        console.log('Updated settings:', newSettings);
        return newSettings;
      });
    } catch (error) {
      console.error('Error in handleImageSelect:', error);
    }
  };

  const handleGenerate = async (promptText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generationService.generateImage({
        prompt: promptText,
        model: settings.model,
        style: settings.style,
        n_steps: settings.n_steps,
        guidance_scale: settings.guidance_scale,
        seed: settings.seed || undefined,
        width: settings.width,
        height: settings.height,
        color_scheme: settings.color_scheme,
        safety_checker: settings.safety_checker,
        tiling: settings.tiling,
        hires_fix: settings.hires_fix,
      });
      setLastGeneration(response);
      setSelectedImage(response.generated_image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (prompt) => {
    try {
      setLoading(true);
      setError(null);
      
      const requestData = {
        prompt,
        model: settings.model || 'stable-diffusion-v1-5',
        style: settings.style || 'none',
        n_steps: parseInt(settings.n_steps) || 20,
        guidance_scale: parseFloat(settings.guidance_scale) || 7.5,
        width: parseInt(settings.width) || 512,
        height: parseInt(settings.height) || 512,
        color_scheme: settings.color_scheme || 'none',
        safety_checker: settings.safety_checker ?? true,
        tiling: settings.tiling || false,
        hires_fix: settings.hires_fix || false,
        seed: settings.seed ? parseInt(settings.seed) : null,
        negative_prompt: settings.negative_prompt || ''
      };

      console.log('Sending generation request:', requestData);
      
      const response = await generationService.generateImage(requestData);
      console.log('Generation response:', response);
      
      if (response && response.generated_image) {
        setLastGeneration(response);
        setSelectedImage(response.generated_image);
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    if (promptFormRef.current) {
      promptFormRef.current.setPrompt(template.prompt);
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      // TODO: Добавить вызов API для сохранения шаблона
      console.log('Saving template:', templateData);
      // После успешного сохранения можно обновить список шаблонов
      // await loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  useEffect(() => {
    const loadModelParameters = async () => {
      try {
        const params = await generationService.getModelParameters(settings.model);
        setModelParameters(params);
        
        setSettings(prev => ({
          ...prev,
          n_steps: prev.n_steps || params.steps.default,
          guidance_scale: prev.guidance_scale || params.guidance_scale.default,
          width: prev.width || params.width.default,
          height: prev.height || params.height.default,
          sampler: prev.sampler || params.sampler.default
        }));
      } catch (error) {
        console.error('Error loading model parameters:', error);
        // Можно добавить отображение ошибки пользователю
        setError('Failed to load model parameters. Using default settings.');
        
        // Установка параметров по умолчанию в случае ошибки
        setModelParameters({
          steps: { default: 50, min: 20, max: 100, step: 1 },
          guidance_scale: { default: 7.5, min: 1, max: 20, step: 0.5 },
          width: { default: 512, options: [512, 768] },
          height: { default: 512, options: [512, 768] },
          sampler: { default: "DPM++ 2M Karras", options: ["DPM++ 2M Karras", "Euler a"] }
        });
      }
    };

    if (settings.model) {
      loadModelParameters();
    }
  }, [settings.model]);

  return (
    <Box className="main-content">
      <Box className="content-wrapper">
        <Box className="left-panel">
          <PromptTemplates
            onSelectTemplate={handleTemplateSelect}
            onAddTemplate={() => setTemplateDialogOpen(true)}
            onEditTemplate={(template) => {
              setSelectedTemplate(template);
              setTemplateDialogOpen(true);
            }}
          />
          <HistoryPanel 
            onImageSelect={handleImageSelect}
            newGeneration={lastGeneration}
          />
        </Box>

        <Box className="center-panel">
          <Box className="image-section">
            <ImageDisplay 
              image={selectedImage}
              loading={loading}
              error={error}
            />
          </Box>
          <Box className="prompt-section">
            <PromptForm 
              ref={promptFormRef}
              onSubmit={handlePromptSubmit}
              loading={loading}
            />
          </Box>
        </Box>

        <Box className="right-panel">
          <Settings 
            settings={settings}
            onSettingsChange={handleSettingsChange}
            modelParameters={modelParameters}
          />
        </Box>

        <PromptTemplateDialog
          open={templateDialogOpen}
          template={selectedTemplate}
          onClose={() => {
            setTemplateDialogOpen(false);
            setSelectedTemplate(null);
          }}
          onSave={handleSaveTemplate}
        />
      </Box>
    </Box>
  );
}

export default MainContent;

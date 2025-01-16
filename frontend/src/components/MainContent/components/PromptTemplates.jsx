import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  IconButton,
  Tooltip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './PromptTemplates.css';

function PromptTemplates({ onSelectTemplate, onAddTemplate, onEditTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const loadTemplates = async () => {
    try {
      // TODO: Добавить вызов API для загрузки шаблонов
      // const response = await promptService.getTemplates();
      // setTemplates(response.data);
      
      // Временные тестовые данные
      setTemplates([
        {
          id: 1,
          name: 'Portrait Template',
          prompt: 'A portrait of a person, highly detailed, professional lighting',
          description: 'Basic portrait template'
        },
        {
          id: 2,
          name: 'Landscape Template',
          prompt: 'A beautiful landscape scene with mountains and lakes',
          description: 'Nature landscape template'
        }
      ]);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSelect = (template) => {
    setSelectedId(template.id);
    onSelectTemplate(template);
  };

  return (
    <Box className="prompt-templates">
      <Box className="templates-header">
        <Typography variant="h6">Prompt Templates</Typography>
        <Tooltip title="Add New Template">
          <IconButton onClick={onAddTemplate}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List className="templates-list">
        {templates.map((template) => (
          <ListItem
            key={template.id}
            selected={selectedId === template.id}
            onClick={() => handleSelect(template)}
            className="template-item"
          >
            <ListItemText
              primary={template.name}
              secondary={template.description}
            />
            <Box className="template-actions">
              <IconButton onClick={() => onEditTemplate(template)}>
                <EditIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default PromptTemplates; 
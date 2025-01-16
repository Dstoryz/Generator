import React, { useState } from 'react';
import { 
  Box, 
  Avatar, 
  IconButton, 
  CircularProgress,
  Badge 
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { userService } from '../../api/userService';

function AvatarUpload({ currentAvatar, onAvatarUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await userService.updateAvatar(formData);
      onAvatarUpdate(response.avatar);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <IconButton
          component="label"
          disabled={loading}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <PhotoCameraIcon />
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </IconButton>
      }
    >
      <Avatar
        src={currentAvatar}
        sx={{ width: 120, height: 120 }}
        className="profile-avatar"
      />
    </Badge>
  );
}

export default AvatarUpload; 
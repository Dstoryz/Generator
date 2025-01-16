import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import StyleIcon from '@mui/icons-material/Style';
import UpdateIcon from '@mui/icons-material/Update';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../api/userService';
import { useAuth } from '../../hooks/useAuth';
import AvatarUpload from './AvatarUpload';
import StatsCard from './StatsCard';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalImages: 0,
    lastGenerated: null,
    favoriteModel: '',
    favoriteStyle: ''
  });
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUserData();
    loadUserStats();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await userService.getUserProfile();
      setUserData(data);
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  const loadUserStats = async () => {
    try {
      const data = await userService.getUserStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load user statistics');
    }
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(userData);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleBioUpdate = async () => {
    try {
      await userService.updateProfile({ bio: userData.bio });
      setSuccess('Bio updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update bio');
    }
  };

  return (
    <Box className="profile-container">
      <Box className="profile-nav">
        <IconButton 
          onClick={() => navigate('/')} 
          className="back-button"
          aria-label="back to main"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Back to Generator
        </Typography>
      </Box>

      <Paper className="profile-paper">
        <Box className="profile-header">
          <AvatarUpload
            currentAvatar={userData.avatar}
            onAvatarUpdate={(newAvatar) => 
              setUserData({ ...userData, avatar: newAvatar })
            }
          />
          <Box className="profile-info">
            <Typography className="profile-username">
              {userData.username}
            </Typography>
            <Typography className="profile-email">
              {userData.email}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} className="profile-stats">
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Images"
              value={stats.total_images}
              icon={<ImageIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Favorite Model"
              value={stats.favorite_model}
              icon={<FavoriteIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Favorite Style"
              value={stats.favorite_style}
              icon={<StyleIcon fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Last Generated"
              value={stats.last_generated ? 
                new Date(stats.last_generated).toLocaleDateString() : 
                'Never'
              }
              icon={<UpdateIcon fontSize="large" />}
            />
          </Grid>
        </Grid>

        <Box className="profile-bio">
          {editing ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={userData.bio}
                onChange={(e) => 
                  setUserData({ ...userData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
              />
              <Box className="profile-actions">
                <Button 
                  variant="outlined" 
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleBioUpdate}
                >
                  Save
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1">
                {userData.bio || 'No bio provided'}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                sx={{ mt: 2 }}
              >
                Edit Bio
              </Button>
            </>
          )}
        </Box>

        <Snackbar
          open={!!success || !!error}
          autoHideDuration={6000}
          onClose={() => {
            setSuccess(null);
            setError(null);
          }}
        >
          <Alert 
            severity={success ? "success" : "error"}
            variant="filled"
          >
            {success || error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default Profile; 
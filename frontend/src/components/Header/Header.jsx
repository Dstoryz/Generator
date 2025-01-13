import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static" className="header" elevation={0}>
      <Toolbar className="header-toolbar">
        <Typography 
          variant="h6"
          className="header-title"
          onClick={() => navigate('/')}
        >
          Image Generator
        </Typography>
        <Box className="header-buttons">
          {isAuthenticated ? (
            <>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/history')}
                startIcon={<HistoryIcon />}
              >
                History
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 
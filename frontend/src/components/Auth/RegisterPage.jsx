import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Alert,
  IconButton,
  InputAdornment 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/authService';
import { useForm } from '../../hooks/useForm';
import './Auth.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    values,
    loading,
    handleChange,
    handleSubmit
  } = useForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const onSubmit = async () => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    try {
      await authService.register({
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      await login({
        username: values.username,
        password: values.password
      });
      
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-form" elevation={3}>
        <Typography variant="h5" className="auth-title">
          Create Account
        </Typography>
        
        {error && (
          <Alert severity="error" className="auth-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            className="auth-input"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            className="auth-link"
          >
            Already have an account? Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default RegisterPage; 
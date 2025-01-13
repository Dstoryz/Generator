import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout/Layout';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import MainContent from './components/MainContent/MainContent';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme/theme';
import './styles/global.css';
import './styles/transitions.css';
import ProtectedRoute from './components/ProtectedRoute';
import TermsOfService from './components/Legal/TermsOfService';
import Profile from './components/Profile/Profile';
import GenerationHistory from './components/History/GenerationHistory';

function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found existing token');
        }
      } catch (error) {
        console.warn('App initialization error:', error);
      }
    };
    
    initApp();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/history" element={
              <ProtectedRoute>
                <GenerationHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;


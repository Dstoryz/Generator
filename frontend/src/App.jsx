import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import MainContent from './components/MainContent/MainContent';
import GenerationHistory from './components/History/GenerationHistory';
import TermsOfService from './components/Legal/TermsOfService';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Footer from './components/Footer/Footer';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          } />
          <Route path="history" element={
            <ProtectedRoute>
              <GenerationHistory />
            </ProtectedRoute>
          } />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
      <Footer />
    </Box>
  );
}

export default App; 
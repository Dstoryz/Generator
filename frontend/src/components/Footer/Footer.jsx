import React from 'react';
import { Box, Container, Typography, Divider, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={2} className="footer-grid">
          {/* О сервисе */}
          <Grid item xs={12} sm={4}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Image Generator
              </Typography>
              <Typography variant="body2" className="footer-description">
                Create unique images using AI technology
              </Typography>
            </Box>
          </Grid>

          {/* Правовая информация */}
          <Grid item xs={12} sm={4}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-subtitle">
                Legal
              </Typography>
              <Box className="footer-links">
                <RouterLink 
                  to="/terms"
                  className="footer-link"
                >
                  Terms of Service
                </RouterLink>
                <RouterLink 
                  to="/privacy"
                  className="footer-link"
                >
                  Privacy Policy
                </RouterLink>
              </Box>
            </Box>
          </Grid>

          {/* Контакты */}
          <Grid item xs={12} sm={4}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-subtitle">
                Contact
              </Typography>
              <Box className="footer-links">
                <a
                  href="mailto:support@imagegenerator.com"
                  className="footer-link"
                >
                  support@imagegenerator.com
                </a>
                <a
                  href="#"
                  className="footer-link"
                >
                  Feedback
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider className="footer-divider" />

        <Typography variant="body2" className="footer-copyright">
          © {currentYear} Image Generator. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 
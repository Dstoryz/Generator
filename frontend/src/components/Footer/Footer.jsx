import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Box className="footer-content">
          <Box className="footer-section">
            <Typography variant="h6" className="footer-title">
              Image Generator
            </Typography>
            <Typography variant="body2" className="footer-description">
              Create unique images using AI technology
            </Typography>
          </Box>

          <Box className="footer-section">
            <Typography variant="h6" className="footer-subtitle">
              Legal
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/terms')}
              className="footer-link"
            >
              Terms of Service
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/privacy')}
              className="footer-link"
            >
              Privacy Policy
            </Link>
          </Box>

          <Box className="footer-section">
            <Typography variant="h6" className="footer-subtitle">
              Contact
            </Typography>
            <Link
              href="mailto:support@imagegenerator.com"
              variant="body2"
              className="footer-link"
            >
              support@imagegenerator.com
            </Link>
          </Box>
        </Box>

        <Divider className="footer-divider" />

        <Typography variant="body2" className="footer-copyright">
          © {currentYear} Image Generator. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 
import React from 'react';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Layout.css';

function Layout({ children }) {
  return (
    <Box className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </Box>
  );
}

export default Layout; 
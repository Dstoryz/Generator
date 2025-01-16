import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Box>
  );
}

export default PublicLayout; 
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

function StatsCard({ title, value, icon }) {
  return (
    <Paper className="stat-card">
      <Box className="stat-icon">{icon}</Box>
      <Typography variant="h4" className="stat-value">
        {value}
      </Typography>
      <Typography variant="body2" className="stat-title">
        {title}
      </Typography>
    </Paper>
  );
}

export default StatsCard; 
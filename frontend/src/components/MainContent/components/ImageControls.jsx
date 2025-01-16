import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import './ImageControls.css';

function ImageControls({ onFavorite, onDownload, onDelete, onShare, isFavorite }) {
  return (
    <div className="image-controls">
      <Tooltip title="Add to Favorites">
        <IconButton onClick={onFavorite}>
          <FavoriteIcon color={isFavorite ? "error" : "inherit"} />
        </IconButton>
      </Tooltip>
      {/* Другие контролы */}
    </div>
  );
}

export default ImageControls; 
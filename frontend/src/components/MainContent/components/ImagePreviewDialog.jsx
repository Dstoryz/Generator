import React from 'react';
import { Dialog, DialogContent } from '@mui/material';

function ImagePreviewDialog({ open, onClose, imageUrl }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl">
      <DialogContent>
        <img src={imageUrl} alt="Preview" style={{ width: '100%' }} />
      </DialogContent>
    </Dialog>
  );
}

export default ImagePreviewDialog; 
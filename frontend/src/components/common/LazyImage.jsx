import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

function LazyImage({ src, alt, className, onLoad, onError }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  const imageUrl = src && src.startsWith('http')
    ? src
    : `http://localhost:8000${src}`;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observerRef.current.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = (e) => {
    console.error('Error loading image:', imageUrl, e);
    setIsLoading(false);
    setIsError(true);
    if (onError) onError(e);
  };

  return (
    <Box ref={imgRef} className={className} style={{ position: 'relative' }}>
      {isLoading && <Skeleton variant="rectangular" width="100%" height="100%" />}
      {isVisible && !isError && (
        <img
          src={imageUrl}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      {isError && (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Typography color="error">Failed to load image</Typography>
        </Box>
      )}
    </Box>
  );
}

export default LazyImage; 
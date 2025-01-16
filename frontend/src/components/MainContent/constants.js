export const STYLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'anime', label: 'Anime' },
  { value: 'digital_art', label: 'Digital Art' },
  { value: 'oil_painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'comic', label: 'Comic' },
  { value: '3d_render', label: '3D Render' },
  { value: 'pixel_art', label: 'Pixel Art' },
];

export const MODEL_OPTIONS = [
  { 
    value: 'stable-diffusion-v1-5', 
    label: 'Stable Diffusion v1.5',
    description: 'Best for general purpose image generation'
  },
  { 
    value: 'stable-diffusion-2-1', 
    label: 'Stable Diffusion v2.1',
    description: 'Improved quality and coherence'
  },
  { 
    value: 'openjourney-v4', 
    label: 'OpenJourney v4',
    description: 'Specialized in artistic and creative styles'
  },
];

export const IMAGE_SIZES = [
  { value: '512x512', label: '512x512' },
  { value: '768x768', label: '768x768' },
  { value: '1024x1024', label: '1024x1024' },
];

export const COLOR_SCHEME = [
  { value: 'none', label: 'None' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'dark', label: 'Dark' },
  { value: 'neon', label: 'Neon' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
  { value: 'summer', label: 'Summer' },
  { value: 'spring', label: 'Spring' },
];

export const SAMPLER_OPTIONS = [
  { value: 'DPM++ 2M Karras', label: 'DPM++ 2M Karras' },
  { value: 'Euler a', label: 'Euler a' },
  { value: 'DDIM', label: 'DDIM' },
  { value: 'UniPC', label: 'UniPC' },
  { value: 'DPM++ SDE Karras', label: 'DPM++ SDE Karras' }
];

export const RESOLUTION_OPTIONS = [
  { value: '512x512', label: '512×512', width: 512, height: 512 },
  { value: '768x768', label: '768×768', width: 768, height: 768 },
  { value: '1024x1024', label: '1024×1024', width: 1024, height: 1024 },
  { value: '512x768', label: '512×768', width: 512, height: 768 },
  { value: '768x512', label: '768×512', width: 768, height: 512 }
];

export const CLIP_SKIP_OPTIONS = [
  { value: 1, label: 'CLIP Skip 1' },
  { value: 2, label: 'CLIP Skip 2' }
];

export const ADVANCED_SETTINGS = {
  tiling: {
    label: 'Tiling',
    description: 'Generate seamless tileable textures'
  },
  hires_fix: {
    label: 'Hires.fix',
    description: 'Improve quality for high-resolution images'
  },
  safety_checker: {
    label: 'Safety Filter',
    description: 'Filter NSFW content and inappropriate images (recommended)',
  }
}; 
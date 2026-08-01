export const BACKEND_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = BACKEND_URL;

export const optimizeCloudinaryUrl = (url, width = 600) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};


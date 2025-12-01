// frontend/src/utils/constants.js

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  HERO: '/hero',
  JOURNEY: '/journey',
  TIMELINE: '/timeline',
  SKILLS: '/skills',
  SERVICES: '/services',
  PROJECTS: '/projects',
  CERTIFICATIONS: '/certifications',
  BLOGS: '/blogs',
  THEME: '/theme',
  UPLOAD: '/upload',
};

export const ANIMATION_TYPES = {
  FADE_IN_UP: 'fadeInUp',
  FADE_IN_LEFT: 'fadeInLeft',
  FADE_IN_RIGHT: 'fadeInRight',
  SCALE_IN: 'scaleIn',
  SLIDE_IN: 'slideIn',
};

export const CATEGORIES = {
  SKILLS: ['frontend', 'backend', 'database', 'tools', 'other'],
  PROJECTS: ['web', 'mobile', 'fullstack', 'api', 'other'],
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
};

export const MESSAGES = {
  SUCCESS: {
    SAVE: 'Changes saved successfully!',
    DELETE: 'Item deleted successfully!',
    UPLOAD: 'File uploaded successfully!',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FILE_SIZE: 'File size exceeds the maximum limit of 5MB.',
    FILE_TYPE: 'Invalid file type. Please upload an image.',
  },
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  USER: 'user',
};

export const DEBOUNCE_DELAY = 300; // ms

export const SCROLL_THRESHOLD = 50; // px

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};
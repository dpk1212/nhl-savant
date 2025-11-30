/**
 * Secure Logger - Development-only logging
 * 
 * Prevents users from seeing sensitive console logs in production
 * that could reveal data sources and model methodology
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Only log in development mode
export const devLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const devError = (...args) => {
  // Always log errors (but sanitize message for production)
  if (isDevelopment) {
    console.error(...args);
  } else {
    // Generic error message for production
    console.error('An error occurred. Please contact support if this persists.');
  }
};

// User-facing logs (safe for production)
export const userLog = (...args) => {
  console.log(...args);
};

export const userWarn = (...args) => {
  console.warn(...args);
};

export const userError = (...args) => {
  console.error(...args);
};

export default {
  devLog,
  devWarn,
  devError,
  userLog,
  userWarn,
  userError,
  isDevelopment
};



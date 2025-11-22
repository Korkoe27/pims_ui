/**
 * Production Console Cleaner
 * 
 * This utility conditionally enables console logging based on environment
 * In production, only errors and warnings are logged
 */

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development';

export const productionConsole = {
  log: isDevelopment ? console.log : () => {},
  debug: isDevelopment ? console.debug : () => {},
  info: isDevelopment ? console.info : () => {},
  warn: console.warn, // Keep warnings in production
  error: console.error, // Keep errors in production
};

// For backwards compatibility, you can replace console with productionConsole
// But for now, we'll keep existing console.error statements as they are important for debugging
export default productionConsole;
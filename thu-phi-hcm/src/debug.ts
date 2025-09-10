// Debug utilities for troubleshooting
export const debugLog = (message: string, data?: any) => {
  console.log(`[DEBUG] ${message}`, data);
};

export const debugError = (message: string, error?: any) => {
  console.error(`[DEBUG ERROR] ${message}`, error);
};

// Check if we're in debug mode
export const isDebugMode = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.search.includes('debug=true') ||
         localStorage.getItem('debug') === 'true';
};

// Enable debug mode
export const enableDebug = () => {
  localStorage.setItem('debug', 'true');
  window.location.reload();
};

// Disable debug mode
export const disableDebug = () => {
  localStorage.removeItem('debug');
  window.location.reload();
};

// Add debug info to window for easy access
if (typeof window !== 'undefined') {
  (window as any).debug = {
    enableDebug,
    disableDebug,
    isDebugMode,
    log: debugLog,
    error: debugError
  };
}

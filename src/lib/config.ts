// Environment-specific configuration
export const config = {
  // Base URL for the application
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://neuralstock.ai'
    : 'http://localhost:3000',
    
  // Allowed origins for CORS
  allowedOrigins: process.env.NODE_ENV === 'production'
    ? ['https://neuralstock.ai']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    
  // API base URL (for Supabase functions)
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://neuralstock.ai'
    : 'http://localhost:3000',
    
  // Whether we're in development mode
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Whether we're in production mode
  isProduction: process.env.NODE_ENV === 'production',
};

// Helper function to get the appropriate CORS header
export function getCorsOrigin(): string {
  if (config.isDevelopment) {
    return '*'; // Allow all origins in development
  }
  return 'https://neuralstock.ai'; // Restrict to production domain
}

// Helper function to get canonical URL
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.baseUrl}${cleanPath}`;
}

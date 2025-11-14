/**
 * API Configuration
 * 
 * This file manages API keys and configuration for ClimaSense AI.
 * API keys are loaded from environment variables for security.
 * 
 * Environment Variable: VITE_OPENWEATHER_API_KEY
 */

// Get API key from environment variable
export const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '⚠️  WARNING: OpenWeatherMap API key is missing!\n' +
        '   Please create a .env file in the project root with:\n' +
        '   VITE_OPENWEATHER_API_KEY=your_api_key_here\n' +
        '   Get your free API key at: https://openweathermap.org/api'
      );
    }
    return '';
  }
  
  return apiKey.trim();
};

// Validate API key format (OpenWeatherMap keys are typically 32 characters)
export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim().length === 0) {
    return false;
  }
  
  // OpenWeatherMap API keys are typically 32 characters alphanumeric
  // But we'll be lenient and just check it's not empty
  return apiKey.trim().length >= 10;
};

// Get API key with validation
export const getValidatedApiKey = (): string => {
  const apiKey = getApiKey();
  
  if (!validateApiKey(apiKey)) {
    if (import.meta.env.DEV) {
      console.error(
        '❌ ERROR: Invalid OpenWeatherMap API key!\n' +
        '   The API key must be at least 10 characters long.\n' +
        '   Please check your .env file and ensure VITE_OPENWEATHER_API_KEY is set correctly.'
      );
    }
    return '';
  }
  
  return apiKey;
};

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  airPollutionUrl: 'https://api.openweathermap.org/data/2.5/air_pollution',
  geocodingUrl: 'https://api.openweathermap.org/geo/1.0',
  timeout: 10000, // 10 seconds
} as const;

// Check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  return validateApiKey(getApiKey());
};


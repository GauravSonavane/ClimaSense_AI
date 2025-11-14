/**
 * API Key Test Utility
 * 
 * This utility helps test and validate the OpenWeatherMap API key configuration.
 * Use this to verify your API key is working correctly.
 */

import { fetchWeatherData, WeatherAPIError } from '@/services/weatherApi';
import { getValidatedApiKey, isApiKeyConfigured, validateApiKey } from './config';

export interface ApiTestResult {
  success: boolean;
  message: string;
  details?: {
    apiKeySource: 'environment' | 'localStorage' | 'none';
    apiKeyLength: number;
    testCity?: string;
    responseTime?: number;
  };
  error?: {
    code?: string;
    statusCode?: number;
    message: string;
  };
}

/**
 * Tests the OpenWeatherMap API key by making a test request
 * @param testCity - Optional city name to test with (default: "London")
 * @returns Test result with success status and details
 */
export const testApiKey = async (testCity: string = 'London'): Promise<ApiTestResult> => {
  const startTime = Date.now();
  
  // Check if API key is configured
  const envApiKey = getValidatedApiKey();
  const apiKeySource = envApiKey ? 'environment' : 'none';
  
  // Try to get API key from localStorage as fallback
  let apiKey = envApiKey;
  if (!apiKey) {
    try {
      const stored = localStorage.getItem('weather-app-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey && validateApiKey(parsed.apiKey)) {
          apiKey = parsed.apiKey;
          // Update source if we found it in localStorage
          if (!envApiKey) {
            // apiKeySource would be 'localStorage' but we already set it above
            // This is just for the details object
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  const details: ApiTestResult['details'] = {
    apiKeySource: apiKey ? (envApiKey ? 'environment' : 'localStorage') : 'none',
    apiKeyLength: apiKey ? apiKey.length : 0,
    testCity,
  };
  
  // Check if API key exists
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      message: 'API key is not configured',
      details,
      error: {
        message: 'Please configure your OpenWeatherMap API key in Settings or .env file.',
        code: 'MISSING_API_KEY',
      },
    };
  }
  
  // Validate API key format
  if (!validateApiKey(apiKey)) {
    return {
      success: false,
      message: 'API key format is invalid',
      details,
      error: {
        message: 'API key must be at least 10 characters long.',
        code: 'INVALID_FORMAT',
      },
    };
  }
  
  // Test the API key with a real request
  try {
    const weatherData = await fetchWeatherData(testCity, apiKey, 'metric');
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      message: `API key is working! Successfully fetched weather data for ${weatherData.city}, ${weatherData.country}`,
      details: {
        ...details,
        responseTime,
      },
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof WeatherAPIError) {
      return {
        success: false,
        message: `API key test failed: ${error.message}`,
        details: {
          ...details,
          responseTime,
        },
        error: {
          code: error.code,
          statusCode: error.statusCode,
          message: error.message,
        },
      };
    }
    
    return {
      success: false,
      message: `API key test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        ...details,
        responseTime,
      },
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
};

/**
 * Quick check if API key is configured (synchronous)
 * @returns true if API key is configured, false otherwise
 */
export const quickApiKeyCheck = (): boolean => {
  return isApiKeyConfigured();
};

/**
 * Logs API key configuration status to console
 * Useful for debugging
 */
export const logApiKeyStatus = (): void => {
  const envApiKey = getValidatedApiKey();
  const isConfigured = isApiKeyConfigured();
  
  console.group('🔑 API Key Configuration Status');
  console.log('Environment Variable:', envApiKey ? '✅ Set' : '❌ Not set');
  console.log('API Key Configured:', isConfigured ? '✅ Yes' : '❌ No');
  
  if (envApiKey) {
    console.log('API Key Length:', envApiKey.length);
    console.log('API Key Preview:', `${envApiKey.substring(0, 8)}...${envApiKey.substring(envApiKey.length - 4)}`);
  } else {
    console.warn('⚠️  No API key found in environment variables');
    console.info('💡 To configure: Create a .env file with VITE_OPENWEATHER_API_KEY=your_key');
  }
  
  // Check localStorage
  try {
    const stored = localStorage.getItem('weather-app-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.apiKey) {
        console.log('LocalStorage API Key:', parsed.apiKey ? '✅ Set' : '❌ Not set');
      }
    }
  } catch {
    // Ignore
  }
  
  console.groupEnd();
};


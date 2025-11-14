/**
 * Sample API Request Examples
 * 
 * This file demonstrates how to use the weather API functions
 * with proper error handling and API key management.
 */

import { fetchWeatherData, fetchForecast, fetchAQI, WeatherAPIError } from '@/services/weatherApi';
import { getValidatedApiKey } from './config';

/**
 * Example: Fetch current weather for a city
 */
export const exampleFetchWeather = async (city: string = 'London') => {
  try {
    // Get API key from environment or settings
    const apiKey = getValidatedApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not configured. Please set VITE_OPENWEATHER_API_KEY in .env file.');
    }
    
    // Fetch weather data
    const weatherData = await fetchWeatherData(city, apiKey, 'metric');
    
    console.log('Weather Data:', {
      city: weatherData.city,
      country: weatherData.country,
      temperature: `${weatherData.temperature}°C`,
      condition: weatherData.condition,
      description: weatherData.description,
      humidity: `${weatherData.humidity}%`,
      wind: `${weatherData.wind} km/h`,
    });
    
    return weatherData;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      console.error('Weather API Error:', {
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
};

/**
 * Example: Fetch forecast data
 */
export const exampleFetchForecast = async (city: string = 'London') => {
  try {
    const apiKey = getValidatedApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not configured.');
    }
    
    const forecast = await fetchForecast(city, apiKey, 'metric');
    
    console.log('Forecast Data:', {
      daily: forecast.daily.length,
      hourly: forecast.hourly.length,
      firstDay: forecast.daily[0],
      nextHours: forecast.hourly.slice(0, 3),
    });
    
    return forecast;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      console.error('Forecast API Error:', error.message);
    }
    throw error;
  }
};

/**
 * Example: Fetch AQI data
 */
export const exampleFetchAQI = async (lat: number = 51.5074, lon: number = -0.1278) => {
  try {
    const apiKey = getValidatedApiKey();
    
    if (!apiKey) {
      console.warn('API key not configured, using fallback AQI value');
      return 50;
    }
    
    const aqi = await fetchAQI(lat, lon, apiKey);
    
    console.log('AQI Data:', {
      latitude: lat,
      longitude: lon,
      aqi: aqi,
      status: getAQIStatus(aqi),
    });
    
    return aqi;
  } catch (error) {
    console.warn('AQI fetch failed, using fallback:', error);
    return 50; // Fallback value
  }
};

/**
 * Helper: Get AQI status text
 */
const getAQIStatus = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

/**
 * Example: Complete weather data fetch with all information
 */
export const exampleCompleteWeatherFetch = async (city: string = 'London') => {
  try {
    const apiKey = getValidatedApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not configured.');
    }
    
    // Fetch all data in parallel for better performance
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city, apiKey, 'metric'),
      fetchForecast(city, apiKey, 'metric'),
    ]);
    
    // Fetch AQI using coordinates from weather data
    const aqi = await fetchAQI(
      weatherData.coordinates.lat,
      weatherData.coordinates.lon,
      apiKey
    );
    
    const completeData = {
      current: {
        ...weatherData,
        aqi,
      },
      forecast: forecastData,
    };
    
    console.log('Complete Weather Data:', completeData);
    
    return completeData;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      console.error('Complete Weather Fetch Error:', {
        code: error.code,
        message: error.message,
      });
    } else {
      console.error('Error:', error);
    }
    throw error;
  }
};


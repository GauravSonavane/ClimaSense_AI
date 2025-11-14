import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecast, fetchAQI, fetchAirPollution, WeatherData, ForecastDay, HourlyForecast, WeatherAPIError, AirPollutionData } from '@/services/weatherApi';
import { useSettings } from './useSettings';
import { getValidatedApiKey, isApiKeyConfigured } from '@/lib/config';

export const useWeather = (city?: string) => {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<{ daily: ForecastDay[]; hourly: HourlyForecast[] } | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = city || settings.location;

  useEffect(() => {
    const loadWeatherData = async () => {
      // Get API key from settings or environment
      const apiKey = settings.apiKey || getValidatedApiKey();
      
      if (!apiKey || apiKey.trim().length === 0) {
        const errorMsg = isApiKeyConfigured() 
          ? 'Please add your OpenWeatherMap API key in Settings or configure it in the .env file.'
          : 'Please configure your OpenWeatherMap API key. See Settings or create a .env file with VITE_OPENWEATHER_API_KEY.';
        setError(errorMsg);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const weatherData = await fetchWeatherData(location, apiKey, settings.units);
        const forecastData = await fetchForecast(location, apiKey, settings.units);
        
        // Fetch air pollution data (detailed)
        const pollutionData = await fetchAirPollution(
          weatherData.coordinates.lat,
          weatherData.coordinates.lon,
          apiKey
        );
        
        // Fallback to simple AQI if detailed data not available
        const aqi = pollutionData?.aqi || await fetchAQI(
          weatherData.coordinates.lat,
          weatherData.coordinates.lon,
          apiKey
        );

        // Normalize city name - replace Jakarta with Nashik
        const normalizedWeatherData = {
          ...weatherData,
          city: weatherData.city === 'Jakarta' ? 'Nashik' : weatherData.city,
          country: weatherData.country === 'ID' ? 'IN' : weatherData.country,
          aqi,
        };

        setWeather(normalizedWeatherData);
        setForecast(forecastData);
        setAirPollution(pollutionData);
      } catch (err) {
        if (err instanceof WeatherAPIError) {
          // Use the specific error message from WeatherAPIError
          setError(err.message);
          
          // Log additional details for debugging
          if (err.code === 'INVALID_API_KEY' || err.code === 'MISSING_API_KEY') {
            console.error('❌ API Key Error:', err.message);
            console.error('   Please check your API key in Settings or .env file');
          }
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [location, settings.apiKey, settings.units]);

  return { weather, forecast, airPollution, loading, error };
};

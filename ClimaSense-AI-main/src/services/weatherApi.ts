export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  wind: number;
  pressure: number;
  icon: string;
  aqi?: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  aqi?: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

export interface AirPollutionData {
  aqi: number; // 0-500 scale
  components: {
    co: number; // Carbon monoxide (µg/m³)
    no2: number; // Nitrogen dioxide (µg/m³)
    o3: number; // Ozone (µg/m³)
    pm2_5: number; // PM2.5 (µg/m³)
    pm10: number; // PM10 (µg/m³)
    so2: number; // Sulfur dioxide (µg/m³)
  };
  timestamp: number;
}

// Error types for better error handling
export class WeatherAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

/**
 * Fetches current weather data for a city
 * @param city - City name
 * @param apiKey - OpenWeatherMap API key
 * @param units - Temperature units ('metric' or 'imperial')
 * @returns Weather data
 * @throws WeatherAPIError if API key is invalid, city not found, or network error
 */
export const fetchWeatherData = async (
  city: string,
  apiKey: string,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> => {
  // Validate API key
  if (!apiKey || apiKey.trim().length === 0) {
    throw new WeatherAPIError(
      'API key is missing. Please configure your OpenWeatherMap API key in Settings or .env file.',
      undefined,
      'MISSING_API_KEY'
    );
  }

  // Validate city name
  if (!city || city.trim().length === 0) {
    throw new WeatherAPIError('City name is required.', undefined, 'INVALID_CITY');
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error codes
      if (response.status === 401) {
        throw new WeatherAPIError(
          'Invalid API key. Please check your OpenWeatherMap API key in Settings.',
          401,
          'INVALID_API_KEY'
        );
      } else if (response.status === 404) {
        throw new WeatherAPIError(
          `City "${city}" not found. Please check the city name and try again.`,
          404,
          'CITY_NOT_FOUND'
        );
      } else if (response.status === 429) {
        throw new WeatherAPIError(
          'API rate limit exceeded. Please try again later.',
          429,
          'RATE_LIMIT'
        );
      } else {
        throw new WeatherAPIError(
          errorData.message || `Failed to fetch weather data: ${response.statusText}`,
          response.status,
          'API_ERROR'
        );
      }
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.name || !data.main || !data.weather || !data.weather[0]) {
      throw new WeatherAPIError('Invalid response from weather API.', undefined, 'INVALID_RESPONSE');
    }
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed),
      pressure: data.main.pressure,
      icon: data.weather[0].icon,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    };
  } catch (error) {
    // Re-throw WeatherAPIError as-is
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new WeatherAPIError(
        'Network error. Please check your internet connection.',
        undefined,
        'NETWORK_ERROR'
      );
    }
    
    // Generic error
    throw new WeatherAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred while fetching weather data.',
      undefined,
      'UNKNOWN_ERROR'
    );
  }
};

/**
 * Fetches weather forecast data for a city
 * @param city - City name
 * @param apiKey - OpenWeatherMap API key
 * @param units - Temperature units ('metric' or 'imperial')
 * @returns Forecast data with daily and hourly forecasts
 * @throws WeatherAPIError if API key is invalid, city not found, or network error
 */
export const fetchForecast = async (
  city: string,
  apiKey: string,
  units: 'metric' | 'imperial' = 'metric'
): Promise<{ daily: ForecastDay[]; hourly: HourlyForecast[] }> => {
  // Validate API key
  if (!apiKey || apiKey.trim().length === 0) {
    throw new WeatherAPIError(
      'API key is missing. Please configure your OpenWeatherMap API key in Settings or .env file.',
      undefined,
      'MISSING_API_KEY'
    );
  }

  try {
    const weatherData = await fetchWeatherData(city, apiKey, units);
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coordinates.lat}&lon=${weatherData.coordinates.lon}&appid=${apiKey}&units=${units}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new WeatherAPIError(
          'Invalid API key. Please check your OpenWeatherMap API key in Settings.',
          401,
          'INVALID_API_KEY'
        );
      } else if (response.status === 429) {
        throw new WeatherAPIError(
          'API rate limit exceeded. Please try again later.',
          429,
          'RATE_LIMIT'
        );
      } else {
        throw new WeatherAPIError(
          errorData.message || `Failed to fetch forecast data: ${response.statusText}`,
          response.status,
          'API_ERROR'
        );
      }
    }
    
    const data = await response.json();
    
    if (!data.list || !Array.isArray(data.list)) {
      throw new WeatherAPIError('Invalid forecast response from API.', undefined, 'INVALID_RESPONSE');
    }
  
  // Process hourly data (next 24 hours)
  const hourly: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
  }));
  
  // Process daily data
  const dailyMap = new Map<string, any[]>();
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });
  
  const daily: ForecastDay[] = Array.from(dailyMap.entries()).slice(0, 7).map(([date, items]) => {
    const temps = items.map(i => i.main.temp);
    const midday = items[Math.floor(items.length / 2)];
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      temp: Math.round(temps.reduce((a, b) => a + b) / temps.length),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      condition: midday.weather[0].main,
      icon: midday.weather[0].icon,
      humidity: midday.main.humidity,
      wind: Math.round(midday.wind.speed),
    };
  });
  
    return { daily, hourly };
  } catch (error) {
    // Re-throw WeatherAPIError as-is
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new WeatherAPIError(
        'Network error. Please check your internet connection.',
        undefined,
        'NETWORK_ERROR'
      );
    }
    
    throw new WeatherAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred while fetching forecast data.',
      undefined,
      'UNKNOWN_ERROR'
    );
  }
};

/**
 * Fetches detailed Air Pollution data for given coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @param apiKey - OpenWeatherMap API key
 * @returns Air pollution data with AQI and components
 * @throws WeatherAPIError if API key is invalid or network error
 */
export const fetchAirPollution = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<AirPollutionData | null> => {
  // Validate API key
  if (!apiKey || apiKey.trim().length === 0) {
    console.warn('⚠️  API key missing for air pollution request.');
    return null;
  }

  // Validate coordinates
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    console.warn('⚠️  Invalid coordinates for air pollution request.');
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('⚠️  Invalid API key for air pollution request.');
        return null;
      } else if (response.status === 429) {
        console.warn('⚠️  API rate limit exceeded for air pollution request.');
        return null;
      }
      return null;
    }
    
    const data = await response.json();
    
    if (!data.list || !Array.isArray(data.list) || data.list.length === 0) {
      return null;
    }
    
    const pollution = data.list[0];
    
    // OpenWeatherMap AQI is 1-5, convert to 0-500 scale
    const aqiMap = [0, 50, 100, 150, 200, 300];
    const aqiValue = pollution.main?.aqi;
    const aqi = (typeof aqiValue === 'number' && aqiValue >= 1 && aqiValue <= 5) 
      ? aqiMap[aqiValue] || 50 
      : 50;
    
    return {
      aqi,
      components: {
        co: Math.round(pollution.components?.co || 0),
        no2: Math.round(pollution.components?.no2 || 0),
        o3: Math.round(pollution.components?.o3 || 0),
        pm2_5: Math.round(pollution.components?.pm2_5 || 0),
        pm10: Math.round(pollution.components?.pm10 || 0),
        so2: Math.round(pollution.components?.so2 || 0),
      },
      timestamp: pollution.dt || Date.now() / 1000,
    };
  } catch (error) {
    console.warn('⚠️  Failed to fetch air pollution data:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

/**
 * Fetches Air Quality Index (AQI) for given coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @param apiKey - OpenWeatherMap API key
 * @returns AQI value (0-500 scale)
 * @throws WeatherAPIError if API key is invalid or network error
 */
export const fetchAQI = async (lat: number, lon: number, apiKey: string): Promise<number> => {
  const pollutionData = await fetchAirPollution(lat, lon, apiKey);
  return pollutionData?.aqi || 50; // Return fallback if null
};

export const getWeatherCondition = (condition: string): "storm" | "sunny" | "rainy" | "cloudy" | "default" => {
  const lower = condition.toLowerCase();
  if (lower.includes('thunder') || lower.includes('storm')) return 'storm';
  if (lower.includes('rain') || lower.includes('drizzle')) return 'rainy';
  if (lower.includes('clear') || lower.includes('sun')) return 'sunny';
  if (lower.includes('cloud')) return 'cloudy';
  return 'default';
};

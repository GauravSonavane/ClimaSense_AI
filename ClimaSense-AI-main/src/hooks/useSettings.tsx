import { useState, useEffect } from 'react';
import { getValidatedApiKey } from '@/lib/config';

export interface Settings {
  apiKey: string;
  units: 'metric' | 'imperial';
  theme: 'dark' | 'light';
  notifications: boolean;
  location: string;
  favoriteLocations: string[];
}

// Get default API key from environment variable
const getDefaultApiKey = (): string => {
  const envApiKey = getValidatedApiKey();
  // Check if there's a stored API key in localStorage
  const stored = localStorage.getItem('weather-app-settings');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.apiKey && parsed.apiKey.trim().length > 0) {
        return parsed.apiKey;
      }
    } catch {
      // Ignore parse errors
    }
  }
  // Return env var API key if available, otherwise empty string
  return envApiKey;
};

const defaultSettings: Settings = {
  apiKey: getDefaultApiKey(),
  units: 'metric',
  theme: 'dark',
  notifications: true,
  location: 'Nashik',
  favoriteLocations: ['Nashik'],
};

const SETTINGS_KEY = 'weather-app-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    const parsed = stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    
    // If no API key in stored settings, try to get from environment
    if (!parsed.apiKey || parsed.apiKey.trim().length === 0) {
      const envApiKey = getValidatedApiKey();
      if (envApiKey) {
        parsed.apiKey = envApiKey;
      }
    }
    
    return parsed;
  });

  useEffect(() => {
    // If API key is empty, try to get from environment
    if (!settings.apiKey || settings.apiKey.trim().length === 0) {
      const envApiKey = getValidatedApiKey();
      if (envApiKey) {
        setSettings(prev => ({ ...prev, apiKey: envApiKey }));
        return; // Don't save yet, let the next effect run
      }
    }
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const addFavoriteLocation = (location: string) => {
    if (!settings.favoriteLocations.includes(location)) {
      updateSettings({
        favoriteLocations: [...settings.favoriteLocations, location],
      });
    }
  };

  const removeFavoriteLocation = (location: string) => {
    updateSettings({
      favoriteLocations: settings.favoriteLocations.filter(l => l !== location),
    });
  };

  return {
    settings,
    updateSettings,
    addFavoriteLocation,
    removeFavoriteLocation,
  };
};

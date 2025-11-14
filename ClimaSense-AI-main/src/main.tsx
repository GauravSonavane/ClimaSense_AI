import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isApiKeyConfigured, getValidatedApiKey } from "./lib/config";

// Check API key configuration on app startup
if (import.meta.env.DEV) {
  const apiKey = getValidatedApiKey();
  const isConfigured = isApiKeyConfigured();
  
  if (!isConfigured) {
    console.warn(
      '%c⚠️  API Key Not Configured',
      'color: #f59e0b; font-weight: bold; font-size: 14px;'
    );
    console.warn(
      '   Please configure your OpenWeatherMap API key:\n' +
      '   1. Create a .env file in the project root\n' +
      '   2. Add: VITE_OPENWEATHER_API_KEY=your_api_key_here\n' +
      '   3. Restart the development server\n' +
      '   Or enter it in the Settings page after the app loads.\n' +
      '   Get your free API key at: https://openweathermap.org/api'
    );
  } else {
    console.log(
      '%c✅ API Key Configured',
      'color: #10b981; font-weight: bold; font-size: 14px;'
    );
    console.log(`   API key loaded from ${apiKey ? 'environment variable' : 'localStorage'}`);
  }
}

createRoot(document.getElementById("root")!).render(<App />);

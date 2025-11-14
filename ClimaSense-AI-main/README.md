# Aurora Sky AI - Weather Application

A modern, responsive weather application built with React and TypeScript, featuring AI-powered insights, real-time forecasts, air quality monitoring, and an intuitive user interface.

## Features

- **Real-time Weather Data**: Get current weather conditions for any location
- **Weather Forecasts**: 7-day weather predictions with detailed hourly breakdowns
- **AI Insights**: Intelligent weather analysis and recommendations powered by AI
- **Air Quality Index (AQI)**: Monitor air quality levels and health recommendations
- **Weather Alerts**: Stay informed about severe weather conditions
- **Interactive Dashboard**: Comprehensive weather overview with beautiful visualizations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Customizable Settings**: Personalize your weather experience

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **API Integration**: Weather data APIs
- **Icons & Assets**: Custom weather icons and backgrounds

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key (free at [openweathermap.org/api](https://openweathermap.org/api))

### Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd aurora-sky-ai-34854
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**

   The application requires an OpenWeatherMap API key to fetch weather data. You can configure it in two ways:

   **Option A: Environment Variable (Recommended for Production)**
   
   Create a `.env` file in the project root:
   ```bash
   # .env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   Replace `your_api_key_here` with your actual OpenWeatherMap API key.
   
   **Option B: Settings Page (Recommended for Development)**
   
   After starting the app, navigate to the Settings page and enter your API key there. The key will be stored in your browser's localStorage.
   
   **Get Your Free API Key:**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API keys section
   - Copy your API key

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   **Important:** If you added or changed the `.env` file, restart the development server for changes to take effect.

5. **Open your browser**

   Navigate to `http://localhost:8080` to view the application (port 8080 as configured in vite.config.ts).

### API Key Configuration Details

- **Environment Variable Name:** `VITE_OPENWEATHER_API_KEY`
- **Location:** `.env` file in project root (create if it doesn't exist)
- **Security:** Never commit the `.env` file to version control (it's already in `.gitignore`)
- **Fallback:** If no environment variable is set, you can enter the API key in the Settings page
- **Validation:** The app will show console warnings if the API key is missing or invalid

### Testing Your API Key

You can test your API key configuration using the test utility:

```typescript
import { testApiKey, logApiKeyStatus } from '@/lib/apiTest';

// Quick status check (synchronous)
logApiKeyStatus();

// Full API test (asynchronous)
const result = await testApiKey('London');
console.log(result);
```

### Troubleshooting

**API Key Not Working?**
- Verify your API key is correct in `.env` file or Settings
- Restart the development server after changing `.env`
- Check browser console for error messages
- Ensure your API key is active on OpenWeatherMap
- Free tier has rate limits - wait a few minutes if you see 429 errors

**Environment Variable Not Loading?**
- Ensure the variable name is exactly `VITE_OPENWEATHER_API_KEY` (Vite requires `VITE_` prefix)
- Restart the development server after creating/modifying `.env`
- Check that `.env` is in the project root directory
- Verify there are no extra spaces or quotes around the API key value

## Usage

- **Search for Locations**: Use the search bar to find weather data for any city worldwide
- **View Dashboard**: Get an overview of current weather conditions
- **Check Forecasts**: Browse detailed weather predictions
- **Monitor Air Quality**: View AQI levels and health recommendations
- **AI Insights**: Access intelligent weather analysis and suggestions
- **Customize Settings**: Adjust temperature units, themes, and preferences

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components (Header, Sidebar, etc.)
├── pages/              # Application pages/routes
├── hooks/              # Custom React hooks
│   ├── useWeather.tsx  # Weather data fetching hook
│   └── useSettings.tsx  # Settings management hook
├── services/           # API services and utilities
│   └── weatherApi.ts   # OpenWeatherMap API integration
├── lib/                # Utility functions
│   ├── config.ts       # API configuration and environment variables
│   └── apiTest.ts      # API key testing utilities
└── assets/             # Images, icons, and static files
```

### Key Files for API Configuration

- **`src/lib/config.ts`** - Manages API key from environment variables
- **`src/services/weatherApi.ts`** - Weather API functions with error handling
- **`src/hooks/useSettings.tsx`** - Settings hook that uses env vars as fallback
- **`.env`** - Environment variables (create this file, not in git)
- **`.env.example`** - Example environment file template

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by various meteorological APIs
- UI components powered by shadcn/ui
- Icons and illustrations from custom asset library

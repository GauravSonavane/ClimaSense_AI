import { WeatherBackground } from "@/components/WeatherBackground";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getValidatedApiKey, isApiKeyConfigured } from "@/lib/config";
import { testApiKey } from "@/lib/apiTest";

const Settings = () => {
  const { settings, updateSettings, addFavoriteLocation, removeFavoriteLocation } = useSettings();
  const [newLocation, setNewLocation] = useState("");
  const [testingApiKey, setTestingApiKey] = useState(false);
  
  const envApiKey = getValidatedApiKey();
  const hasEnvApiKey = !!envApiKey;
  const hasLocalApiKey = !!settings.apiKey && settings.apiKey.trim().length > 0;
  const isConfigured = isApiKeyConfigured() || hasLocalApiKey;

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      addFavoriteLocation(newLocation.trim());
      setNewLocation("");
      toast.success("Location added");
    }
  };

  const handleTestApiKey = async () => {
    const apiKey = settings.apiKey || envApiKey;
    if (!apiKey) {
      toast.error("Please enter an API key first");
      return;
    }

    setTestingApiKey(true);
    try {
      const result = await testApiKey("London");
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to test API key");
    } finally {
      setTestingApiKey(false);
    }
  };

  return (
    <WeatherBackground condition="cloudy">
      <Sidebar />
      <MobileMenu />
      <div className="lg:ml-48 min-h-screen p-4 lg:p-8 h-screen">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-8">
          <div className="glass-dark rounded-3xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-2">API Configuration</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Get your free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenWeatherMap</a>
            </p>
            
            {/* API Key Status */}
            <div className="mb-4 p-4 rounded-xl glass border-white/10">
              <div className="flex items-center gap-2 mb-2">
                {isConfigured ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-semibold">
                  {isConfigured ? "API Key Configured" : "API Key Not Configured"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {hasEnvApiKey && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Environment variable (.env) is set</span>
                  </div>
                )}
                {hasLocalApiKey && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Local storage API key is set</span>
                  </div>
                )}
                {!hasEnvApiKey && !hasLocalApiKey && (
                  <div className="text-yellow-500">
                    ⚠️ No API key found. Please configure one below or in .env file.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">OpenWeatherMap API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    id="apiKey" 
                    type="password" 
                    placeholder={hasEnvApiKey ? "API key from .env (or override here)" : "Enter your API key"} 
                    value={settings.apiKey} 
                    onChange={(e) => updateSettings({ apiKey: e.target.value })} 
                    className="flex-1 glass border-white/20" 
                  />
                  <Button 
                    onClick={handleTestApiKey} 
                    disabled={testingApiKey || (!settings.apiKey && !envApiKey)}
                    variant="outline"
                  >
                    {testingApiKey ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: You can also set VITE_OPENWEATHER_API_KEY in a .env file (recommended for production)
                </p>
              </div>
            </div>
          </div>
          <div className="glass-dark rounded-3xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6">Units</h2>
            <div className="flex items-center justify-between">
              <Label>Temperature Unit</Label>
              <div className="flex gap-2">
                <Button variant={settings.units === 'metric' ? 'default' : 'outline'} onClick={() => updateSettings({ units: 'metric' })} className="rounded-full">°C</Button>
                <Button variant={settings.units === 'imperial' ? 'default' : 'outline'} onClick={() => updateSettings({ units: 'imperial' })} className="rounded-full">°F</Button>
              </div>
            </div>
          </div>
          <div className="glass-dark rounded-3xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6">Locations</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Add a city..." value={newLocation} onChange={(e) => setNewLocation(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()} className="glass border-white/20" />
                <Button onClick={handleAddLocation} size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2">
                {settings.favoriteLocations.map((location) => (
                  <div key={location} className="flex items-center justify-between p-3 glass rounded-xl">
                    <span>{location}</span>
                    <Button variant="ghost" size="icon" onClick={() => { removeFavoriteLocation(location); toast.success("Location removed"); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </ScrollArea>
      </div>
    </WeatherBackground>
  );
};

export default Settings;

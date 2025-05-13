import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

interface WeatherWidgetProps {
  /**
   * City name to display weather for
   * @default "Riyadh"
   */
  city?: string;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * Weather conditions with their icons and temperature ranges
 */
const weatherConditions = [
  { 
    condition: "sunny", 
    icon: Sun, 
    tempRange: [25, 45],
    emoji: "☀️" 
  },
  { 
    condition: "cloudy", 
    icon: Cloud, 
    tempRange: [20, 30],
    emoji: "☁️" 
  },
  { 
    condition: "rainy", 
    icon: CloudRain, 
    tempRange: [15, 25],
    emoji: "🌧️" 
  },
  { 
    condition: "snowy", 
    icon: CloudSnow, 
    tempRange: [-5, 5],
    emoji: "❄️" 
  },
  { 
    condition: "stormy", 
    icon: CloudLightning, 
    tempRange: [10, 20],
    emoji: "⛈️" 
  },
  { 
    condition: "foggy", 
    icon: CloudFog, 
    tempRange: [5, 15],
    emoji: "🌫️" 
  }
];

/**
 * WeatherWidget component
 * 
 * Displays a simulated weather widget for a specified city
 */
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city = "Riyadh",
  className = "",
}) => {
  const { t, isRTL } = useLanguage();
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
    icon: React.ElementType;
    emoji: string;
  } | null>(null);
  
  // Simulate fetching weather data
  useEffect(() => {
    // Get a random weather condition based on the city
    // This is just for simulation - in a real app, you'd fetch from an API
    const getRandomWeather = () => {
      // Use the city name as a seed for pseudo-randomness
      const citySum = city.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const date = new Date();
      const daySeed = date.getDate() + date.getMonth();
      
      // Use the seed to pick a weather condition
      const index = (citySum + daySeed) % weatherConditions.length;
      const condition = weatherConditions[index];
      
      // Generate a temperature within the condition's range
      const minTemp = condition.tempRange[0];
      const maxTemp = condition.tempRange[1];
      const temperature = Math.floor(minTemp + (Math.random() * (maxTemp - minTemp)));
      
      return {
        temperature,
        condition: condition.condition,
        icon: condition.icon,
        emoji: condition.emoji
      };
    };
    
    setWeather(getRandomWeather());
    
    // Update weather every hour (in a real app, you'd use a proper interval)
    const interval = setInterval(() => {
      setWeather(getRandomWeather());
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [city]);
  
  if (!weather) {
    return null;
  }
  
  const WeatherIcon = weather.icon;
  
  return (
    <div 
      className={`flex items-center gap-2 text-sm ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <WeatherIcon className="h-4 w-4 text-primary" />
      <span>
        {t("widgets.weather.now", { city })}:{" "}
        <span className="font-medium">{weather.temperature}°</span>{" "}
        <span>{weather.emoji}</span>
      </span>
    </div>
  );
};

export default WeatherWidget;

import React from "react";
import WeatherWidget from "./WeatherWidget";
import LocalTimeWidget from "./LocalTimeWidget";

interface InfoWidgetsProps {
  /**
   * City name to display information for
   * @default "Riyadh"
   */
  city?: string;
  
  /**
   * Whether to show the weather widget
   * @default true
   */
  showWeather?: boolean;
  
  /**
   * Whether to show the local time widget
   * @default true
   */
  showTime?: boolean;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * InfoWidgets component
 * 
 * Displays a collection of informational widgets like weather and local time
 */
const InfoWidgets: React.FC<InfoWidgetsProps> = ({
  city = "Riyadh",
  showWeather = true,
  showTime = true,
  className = "",
}) => {
  // If no widgets are shown, return null
  if (!showWeather && !showTime) {
    return null;
  }
  
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {showWeather && (
        <WeatherWidget city={city} />
      )}
      
      {showTime && (
        <LocalTimeWidget city={city} />
      )}
    </div>
  );
};

export default InfoWidgets;

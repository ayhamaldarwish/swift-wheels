import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock } from "lucide-react";

interface LocalTimeWidgetProps {
  /**
   * City name to display time for
   * @default "Riyadh"
   */
  city?: string;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * Format time as HH:MM
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * LocalTimeWidget component
 * 
 * Displays the current local time for a specified city
 */
const LocalTimeWidget: React.FC<LocalTimeWidgetProps> = ({
  city = "Riyadh",
  className = "",
}) => {
  const { t, isRTL } = useLanguage();
  const [time, setTime] = useState<string>(formatTime(new Date()));
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()));
    };
    
    // Update immediately
    updateTime();
    
    // Set interval to update every minute
    const interval = setInterval(updateTime, 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`flex items-center gap-2 text-sm ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Clock className="h-4 w-4 text-primary" />
      <span>
        {t("widgets.time.now", { city })}: <span className="font-medium">{time}</span>
      </span>
    </div>
  );
};

export default LocalTimeWidget;

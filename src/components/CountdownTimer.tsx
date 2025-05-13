import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Tag } from "lucide-react";

interface CountdownTimerProps {
  /**
   * End date for the countdown
   * Can be a Date object or an ISO string
   */
  endDate: Date | string;

  /**
   * Title to display above the countdown
   * @default "Special Offer"
   */
  title?: string;

  /**
   * Message to display when the countdown ends
   * @default "Offer has ended"
   */
  expiredMessage?: string;

  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * CSS class to apply to the container
   */
  className?: string;

  /**
   * Callback function to execute when the countdown ends
   */
  onExpire?: () => void;
}

/**
 * Format number as two digits
 */
const formatNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

/**
 * CountdownTimer component
 *
 * Displays a countdown timer for special offers or promotions
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  title,
  expiredMessage,
  showIcon = true,
  className = "",
  onExpire,
}) => {
  const { t, isRTL } = useLanguage();

  // Convert endDate to Date object if it's a string
  const targetDate = typeof endDate === "string" ? new Date(endDate) : endDate;

  // State for remaining time
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Update the countdown
  useEffect(() => {
    // Calculate time difference
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        // Timer has expired
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });

        // Call onExpire callback if provided
        if (onExpire) {
          onExpire();
        }

        // Clear the interval
        return clearInterval(timer);
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Initial calculation
    calculateTimeLeft();

    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <div
      className={`bg-yellow-400 rounded-lg shadow-md p-4 text-secondary ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-secondary">
          {title || t("countdown.title")}
        </h3>
        {showIcon && (
          <div className="bg-secondary/10 rounded-full p-1.5">
            <Tag className="h-5 w-5 text-secondary" />
          </div>
        )}
      </div>

      {timeLeft.isExpired ? (
        <div className="text-center py-2">
          <p className="font-medium text-secondary">{expiredMessage || t("countdown.expired")}</p>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-secondary" />
          <p className="text-sm font-medium text-secondary">
            {t("countdown.ends_in")}:
          </p>
          <div className="flex items-center gap-1 ml-1">
            <div className="bg-secondary/10 rounded px-2 py-1 min-w-[2.5rem] text-center">
              <span className="font-mono font-bold text-secondary">{formatNumber(timeLeft.hours)}</span>
            </div>
            <span className="font-bold text-secondary">:</span>
            <div className="bg-secondary/10 rounded px-2 py-1 min-w-[2.5rem] text-center">
              <span className="font-mono font-bold text-secondary">{formatNumber(timeLeft.minutes)}</span>
            </div>
            <span className="font-bold text-secondary">:</span>
            <div className="bg-secondary/10 rounded px-2 py-1 min-w-[2.5rem] text-center">
              <span className="font-mono font-bold text-secondary">{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;

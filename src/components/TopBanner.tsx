import React, { useState, useEffect } from "react";
import { X, Bell, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BannerType = "info" | "success" | "warning" | "error" | "announcement";

export interface TopBannerProps {
  message: string;
  type?: BannerType;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  autoHideDuration?: number; // in milliseconds, if provided banner will auto-hide
  className?: string;
  id?: string; // unique identifier for the banner
  onClose?: () => void;
}

const getDefaultIcon = (type: BannerType) => {
  switch (type) {
    case "info":
      return <Info className="h-5 w-5" />;
    case "success":
      return <CheckCircle className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    case "error":
      return <AlertTriangle className="h-5 w-5" />;
    case "announcement":
      return <Megaphone className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getTypeStyles = (type: BannerType) => {
  switch (type) {
    case "info":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "success":
      return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800";
    case "warning":
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "error":
      return "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800";
    case "announcement":
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    default:
      return "bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
};

const TopBanner: React.FC<TopBannerProps> = ({
  message,
  type = "info",
  icon,
  action,
  dismissible = true,
  autoHideDuration,
  className,
  id = "default-banner",
  onClose,
}) => {
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  // Check if this banner was previously dismissed
  useEffect(() => {
    const dismissedBanners = localStorage.getItem("dismissedBanners");
    if (dismissedBanners) {
      const banners = JSON.parse(dismissedBanners);
      if (banners.includes(id)) {
        setIsVisible(false);
      }
    }
  }, [id]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHideDuration && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible]);

  const handleClose = () => {
    setIsVisible(false);

    // Save dismissed state to localStorage
    const dismissedBanners = localStorage.getItem("dismissedBanners");
    let banners = dismissedBanners ? JSON.parse(dismissedBanners) : [];
    if (!banners.includes(id)) {
      banners.push(id);
      localStorage.setItem("dismissedBanners", JSON.stringify(banners));
    }

    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full py-2 px-4 border-b transition-all",
        getTypeStyles(type),
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      role="alert"
    >
      <div className="container mx-auto flex items-center justify-center text-sm">
        <div className={cn("flex items-center justify-center", isRTL ? "flex-row-reverse" : "flex-row")}>
          <span className={cn("flex-shrink-0", isRTL ? "ml-2" : "mr-2")}>
            {icon || getDefaultIcon(type)}
          </span>
          <span className="font-medium">{message}</span>

          {action && (
            <Button
              variant="link"
              size="sm"
              className={cn(
                "px-2 py-1 mx-2 underline font-medium",
                type === "info" && "text-blue-700 hover:text-blue-900",
                type === "success" && "text-green-700 hover:text-green-900",
                type === "warning" && "text-amber-700 hover:text-amber-900",
                type === "error" && "text-red-700 hover:text-red-900",
                type === "announcement" && "text-purple-700 hover:text-purple-900"
              )}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 rounded-full hover:bg-opacity-20",
              isRTL ? "mr-4" : "ml-4",
              type === "info" && "hover:bg-blue-200 text-blue-700",
              type === "success" && "hover:bg-green-200 text-green-700",
              type === "warning" && "hover:bg-amber-200 text-amber-700",
              type === "error" && "hover:bg-red-200 text-red-700",
              type === "announcement" && "hover:bg-purple-200 text-purple-700"
            )}
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopBanner;

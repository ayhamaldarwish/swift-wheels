import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Car } from "@/types/car";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface DeliverySimulationProps {
  carName: string;
  carImage?: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * DeliverySimulation component
 * 
 * Simulates the car delivery process with animations and status updates
 */
const DeliverySimulation: React.FC<DeliverySimulationProps> = ({
  carName,
  carImage,
  onComplete,
  className,
}) => {
  const { t, isRTL } = useLanguage();
  const [stage, setStage] = useState<"processing" | "delivered">("processing");
  const [progress, setProgress] = useState(0);

  // Simulate the delivery process
  useEffect(() => {
    // Start with processing stage
    setStage("processing");
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 200);

    // After 4 seconds, mark as delivered
    const deliveryTimer = setTimeout(() => {
      setStage("delivered");
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(deliveryTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col space-y-4">
        {/* Header with car image */}
        <div className="flex items-center gap-3">
          {carImage && (
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border">
              <OptimizedImage
                src={carImage}
                alt={carName}
                aspectRatio="aspect-square"
                containerClassName="h-full"
                loadingStrategy="eager"
                showSkeleton={true}
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{t("delivery.title")}</h3>
            <p className="text-sm text-muted-foreground">{carName}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-out",
              stage === "processing" ? "bg-amber-500" : "bg-green-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {stage === "processing" ? (
            <>
              <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
              <span className="font-medium text-amber-600">{t("delivery.processing")}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-600">{t("delivery.delivered")}</span>
            </>
          )}
        </div>

        {/* Message */}
        <p className="text-sm text-muted-foreground">
          {stage === "processing" 
            ? t("delivery.message.processing") 
            : t("delivery.message.delivered")}
        </p>

        {/* Delivery details (only shown when delivered) */}
        {stage === "delivered" && (
          <div className="mt-2 space-y-2 bg-muted/30 p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{t("delivery.pickup_location")}: RentCar Main Office</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{t("delivery.pickup_time")}: 9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{t("delivery.contact")}: +966 12 345 6789</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverySimulation;

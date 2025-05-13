import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";
import { Booking } from "@/types/auth";
import { cn } from "@/lib/utils";
import { CheckCircle, MapPin, Calendar, Clock } from "lucide-react";

interface CarBookingAnimationProps {
  car: Car;
  booking: Booking;
  onComplete?: () => void;
  className?: string;
}

const CarBookingAnimation: React.FC<CarBookingAnimationProps> = ({
  car,
  booking,
  onComplete,
  className,
}) => {
  const { t, isRTL } = useLanguage();
  const [stage, setStage] = useState<
    "initial" | "driving" | "arrived" | "completed"
  >("initial");
  const [progress, setProgress] = useState(0);

  // Start animation sequence when component mounts
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage("driving");
    }, 1000);

    const timer2 = setTimeout(() => {
      setStage("arrived");
    }, 5000);

    const timer3 = setTimeout(() => {
      setStage("completed");
      if (onComplete) {
        onComplete();
      }
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Update progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (stage === "driving") {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 40); // 4 seconds to reach 100%
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  // Get message based on current stage
  const getMessage = () => {
    switch (stage) {
      case "initial":
        return t("booking.animation.preparing");
      case "driving":
        return t("booking.animation.delivering");
      case "arrived":
        return t("booking.animation.arrived");
      case "completed":
        return t("booking.animation.completed");
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animation Stage */}
      <div className="relative h-64 bg-gradient-to-b from-blue-50 to-gray-100 overflow-hidden">
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-300">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white dash-line"></div>
        </div>

        {/* Car Animation */}
        <AnimatePresence>
          <motion.div
            key="car"
            initial={{ 
              x: isRTL ? "100%" : "-20%", 
              y: "100%", 
              rotate: isRTL ? 180 : 0 
            }}
            animate={{
              x: stage === "initial" 
                ? (isRTL ? "100%" : "-20%") 
                : stage === "driving" 
                  ? (isRTL ? "0%" : "80%") 
                  : (isRTL ? "-20%" : "100%"),
              y: stage === "initial" ? "100%" : "70%",
              rotate: isRTL ? 180 : 0,
              scale: stage === "arrived" ? [1, 1.05, 1] : 1,
            }}
            transition={{
              x: { duration: stage === "driving" ? 4 : 1, ease: "easeInOut" },
              y: { duration: 0.5 },
              scale: { duration: 0.5, repeat: stage === "arrived" ? 1 : 0 },
            }}
            className="absolute w-32 h-16"
          >
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Destination Building */}
        <motion.div
          className="absolute bottom-16 right-8 w-24 h-32 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-20 h-24 bg-gray-200 rounded-t-lg shadow-md flex flex-col items-center justify-center">
            <div className="w-4 h-6 bg-blue-400 rounded-sm mb-2"></div>
            <div className="w-4 h-6 bg-blue-400 rounded-sm"></div>
          </div>
          <div className="w-24 h-8 bg-gray-300 rounded-b-lg shadow-md flex items-center justify-center">
            <div className="w-6 h-4 bg-gray-500 rounded-sm"></div>
          </div>
          <MapPin className="text-red-500 mt-1 h-6 w-6" />
        </motion.div>

        {/* Status Message */}
        <motion.div
          className="absolute top-4 left-0 right-0 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-primary">{getMessage()}</h3>
          {stage === "driving" && (
            <div className="mt-2 w-64 mx-auto bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
            <p className="text-gray-600">{car.brand} {car.year}</p>
          </div>
          
          {stage === "completed" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="mt-2 md:mt-0 bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>{t("booking.animation.success")}</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm text-gray-500">{t("booking.dates")}</p>
              <p className="font-medium">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm text-gray-500">{t("booking.duration")}</p>
              <p className="font-medium">
                {Math.ceil(
                  (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                {t("booking.days")}
              </p>
            </div>
          </div>
        </div>

        {stage === "completed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={onComplete}
            >
              {t("booking.animation.continue")}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CarBookingAnimation;

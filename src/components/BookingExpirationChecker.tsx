import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { startExpirationChecking } from "@/services/bookingExpirationService";

/**
 * BookingExpirationChecker component
 * 
 * This component periodically checks for bookings that are about to expire
 * and shows toast notifications to alert the user.
 * 
 * It should be placed high in the component tree to ensure it's always active
 * when the user is logged in.
 */
const BookingExpirationChecker: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Only start checking if the user is authenticated
    if (isAuthenticated && user) {
      // Start checking for expiring bookings
      // Default: Check for bookings expiring within 24 hours
      // Check every 60 minutes (1 hour)
      const stopChecking = startExpirationChecking(
        user.id,
        t,
        {
          hoursBeforeExpiration: 24,
          includeExpired: false,
        },
        60
      );

      // Clean up the interval when the component unmounts
      return () => {
        stopChecking();
      };
    }
  }, [isAuthenticated, user, t]);

  // This component doesn't render anything
  return null;
};

export default BookingExpirationChecker;

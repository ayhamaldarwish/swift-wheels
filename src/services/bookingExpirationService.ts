import { Booking } from "@/types/auth";
import { Car } from "@/types/car";
import { getCarById } from "@/services/carService";
import { toast } from "@/components/ui/use-toast";
import { getBookingsByUserId } from "@/services/bookingService";

/**
 * Interface for booking expiration check options
 */
interface BookingExpirationOptions {
  /**
   * Hours before expiration to show notification
   * Default: 24 hours (1 day)
   */
  hoursBeforeExpiration?: number;

  /**
   * Whether to check for expired bookings as well
   * Default: false
   */
  includeExpired?: boolean;

  /**
   * Callback function to execute when a booking is about to expire
   */
  onExpirationWarning?: (booking: Booking, car: Car) => void;
}

/**
 * Check if a booking is about to expire
 *
 * @param booking The booking to check
 * @param options Options for the expiration check
 * @returns True if the booking is about to expire, false otherwise
 */
export const isBookingAboutToExpire = (
  booking: Booking,
  options: BookingExpirationOptions = {}
): boolean => {
  const { hoursBeforeExpiration = 24, includeExpired = false } = options;

  // Skip completed or cancelled bookings
  if (booking.status !== "active") {
    return false;
  }

  const now = new Date();
  const endDate = new Date(booking.endDate);

  // Calculate the time difference in hours
  const timeDifferenceMs = endDate.getTime() - now.getTime();
  const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

  // Check if the booking is about to expire
  if (timeDifferenceHours <= hoursBeforeExpiration && timeDifferenceHours > 0) {
    return true;
  }

  // Check if the booking has already expired (if includeExpired is true)
  if (includeExpired && timeDifferenceHours <= 0) {
    return true;
  }

  return false;
};

/**
 * Check for expiring bookings for a user
 *
 * @param userId The user ID to check bookings for
 * @param t Translation function
 * @param options Options for the expiration check
 * @returns Array of bookings that are about to expire
 */
export const checkExpiringBookings = (
  userId: string,
  t: (key: string, params?: Record<string, any>) => string,
  options: BookingExpirationOptions = {}
): Booking[] => {
  const { onExpirationWarning } = options;

  // Get all bookings for the user
  const userBookings = getBookingsByUserId(userId);

  // Filter bookings that are about to expire
  const expiringBookings = userBookings.filter(booking =>
    isBookingAboutToExpire(booking, options)
  );

  // Show notifications for expiring bookings
  expiringBookings.forEach(booking => {
    const car = getCarById(booking.carId);

    if (car) {
      // Call the callback if provided
      if (onExpirationWarning) {
        onExpirationWarning(booking, car);
      }

      // Show toast notification
      toast({
        title: t("booking.expiration.title"),
        description: t("booking.expiration.desc", { car: car.name }),
        variant: "default",
        action: {
          label: t("booking.expiration.action"),
          onClick: () => {
            // Navigate to the dashboard with the booking highlighted
            window.location.href = `/dashboard?highlight=${booking.id}`;
          }
        }
      });
    }
  });

  return expiringBookings;
};

/**
 * Start periodic checking for expiring bookings
 *
 * @param userId The user ID to check bookings for
 * @param t Translation function
 * @param options Options for the expiration check
 * @param checkIntervalMinutes How often to check for expiring bookings (in minutes)
 * @returns A function to stop the periodic checking
 */
export const startExpirationChecking = (
  userId: string,
  t: (key: string, params?: Record<string, any>) => string,
  options: BookingExpirationOptions = {},
  checkIntervalMinutes: number = 60
): () => void => {
  // Perform initial check
  checkExpiringBookings(userId, t, options);

  // Set up interval for periodic checking
  const intervalId = setInterval(() => {
    checkExpiringBookings(userId, t, options);
  }, checkIntervalMinutes * 60 * 1000);

  // Return a function to stop the interval
  return () => {
    clearInterval(intervalId);
  };
};

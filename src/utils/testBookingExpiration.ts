import { toast } from "@/components/ui/use-toast";
import { getCarById } from "@/services/carService";

/**
 * Test function to manually trigger a booking expiration notification
 *
 * @param t Translation function
 * @param carId Car ID to use in the notification (defaults to 1)
 */
export const testBookingExpirationNotification = (
  t: (key: string, params?: Record<string, any>) => string,
  carId: number = 1
): void => {
  const car = getCarById(carId);

  if (car) {
    toast({
      title: t("booking.expiration.title"),
      description: t("booking.expiration.desc", { car: car.name }),
      variant: "default",
      action: {
        label: t("booking.expiration.action"),
        onClick: () => {
          // Navigate to the dashboard with the booking highlighted
          window.location.href = `/dashboard?highlight=test-booking-id`;
        }
      }
    });
  } else {
    console.error(`Car with ID ${carId} not found for test notification`);
  }
};

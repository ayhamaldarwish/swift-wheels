import { Booking } from "@/types/auth";
import { loadBookingsFromStorage, saveBookingsToStorage } from "@/data/mockData";

/**
 * Update booking statuses based on dates
 * 
 * This function checks all bookings and updates their status based on the current date:
 * - If end date is in the past and status is "active", changes to "completed"
 * - If start date is in the future and status is "completed", changes to "active"
 * 
 * @returns The number of bookings that were updated
 */
export const updateBookingStatuses = (): number => {
  const bookings = loadBookingsFromStorage();
  const now = new Date();
  let updatedCount = 0;
  
  const updatedBookings = bookings.map(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    let updated = false;
    
    // If booking is active but end date is in the past, mark as completed
    if (booking.status === "active" && endDate < now) {
      booking.status = "completed";
      updated = true;
    }
    
    // If booking is marked as completed but it should be active (rare case, but possible if admin changed dates)
    if (booking.status === "completed" && startDate <= now && endDate >= now) {
      booking.status = "active";
      updated = true;
    }
    
    if (updated) {
      updatedCount++;
    }
    
    return booking;
  });
  
  if (updatedCount > 0) {
    saveBookingsToStorage(updatedBookings);
  }
  
  return updatedCount;
};

/**
 * Get active bookings
 * 
 * Active bookings are those with status "active" and end date in the future
 * 
 * @param userId Optional user ID to filter bookings by
 * @returns Array of active bookings
 */
export const getActiveBookings = (userId?: string): Booking[] => {
  updateBookingStatuses(); // Update statuses before filtering
  const bookings = loadBookingsFromStorage();
  const now = new Date();
  
  return bookings.filter(booking => {
    // Filter by user ID if provided
    if (userId && booking.userId !== userId) {
      return false;
    }
    
    // Active bookings have status "active" and end date in the future
    return booking.status === "active" && new Date(booking.endDate) >= now;
  });
};

/**
 * Get archived bookings
 * 
 * Archived bookings are those with status "completed" or "cancelled",
 * or those with status "active" but end date in the past
 * 
 * @param userId Optional user ID to filter bookings by
 * @returns Array of archived bookings
 */
export const getArchivedBookings = (userId?: string): Booking[] => {
  updateBookingStatuses(); // Update statuses before filtering
  const bookings = loadBookingsFromStorage();
  const now = new Date();
  
  return bookings.filter(booking => {
    // Filter by user ID if provided
    if (userId && booking.userId !== userId) {
      return false;
    }
    
    // Archived bookings are completed, cancelled, or past their end date
    return (
      booking.status === "completed" ||
      booking.status === "cancelled" ||
      (booking.status === "active" && new Date(booking.endDate) < now)
    );
  });
};

/**
 * Archive a booking
 * 
 * Changes the status of a booking to "completed"
 * 
 * @param bookingId The ID of the booking to archive
 * @returns True if the booking was archived, false otherwise
 */
export const archiveBooking = (bookingId: string): boolean => {
  const bookings = loadBookingsFromStorage();
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  
  if (bookingIndex === -1) {
    return false;
  }
  
  const updatedBookings = [...bookings];
  updatedBookings[bookingIndex] = {
    ...updatedBookings[bookingIndex],
    status: "completed"
  };
  
  saveBookingsToStorage(updatedBookings);
  return true;
};

/**
 * Restore an archived booking
 * 
 * Changes the status of a booking from "completed" to "active"
 * Only works if the booking end date is in the future
 * 
 * @param bookingId The ID of the booking to restore
 * @returns True if the booking was restored, false otherwise
 */
export const restoreBooking = (bookingId: string): boolean => {
  const bookings = loadBookingsFromStorage();
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  
  if (bookingIndex === -1) {
    return false;
  }
  
  const booking = bookings[bookingIndex];
  const endDate = new Date(booking.endDate);
  const now = new Date();
  
  // Only restore if the booking end date is in the future
  if (endDate < now) {
    return false;
  }
  
  const updatedBookings = [...bookings];
  updatedBookings[bookingIndex] = {
    ...updatedBookings[bookingIndex],
    status: "active"
  };
  
  saveBookingsToStorage(updatedBookings);
  return true;
};

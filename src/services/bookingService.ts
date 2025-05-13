import { Booking } from "@/types/auth";
import { loadBookingsFromStorage, saveBookingsToStorage } from "@/data/mockData";
import { getCarById, getAllCars } from "@/services/carService";
import { Car } from "@/types/car";

/**
 * Get all bookings
 *
 * @returns Array of all bookings
 */
export const getAllBookings = (): Booking[] => {
  return loadBookingsFromStorage();
};

/**
 * Get bookings by user ID
 *
 * @param userId - The user ID to filter by
 * @returns Array of bookings for the specified user
 */
export const getBookingsByUserId = (userId: string): Booking[] => {
  const bookings = loadBookingsFromStorage();
  return bookings.filter(booking => booking.userId === userId);
};

/**
 * Get booking by ID
 *
 * @param bookingId - The booking ID to find
 * @returns The booking object or undefined if not found
 */
export const getBookingById = (bookingId: string): Booking | undefined => {
  const bookings = loadBookingsFromStorage();
  return bookings.find(booking => booking.id === bookingId);
};

/**
 * Create a new booking
 *
 * @param booking - The booking to create
 * @returns The created booking
 */
export const createBooking = (booking: Booking): Booking => {
  const bookings = loadBookingsFromStorage();
  const newBookings = [...bookings, booking];
  saveBookingsToStorage(newBookings);
  return booking;
};

/**
 * Update a booking
 *
 * @param bookingId - The ID of the booking to update
 * @param updatedBooking - The updated booking data
 * @returns The updated booking or undefined if not found
 */
export const updateBooking = (bookingId: string, updatedBooking: Partial<Booking>): Booking | undefined => {
  const bookings = loadBookingsFromStorage();
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);

  if (bookingIndex === -1) {
    return undefined;
  }

  const updatedBookings = [...bookings];
  updatedBookings[bookingIndex] = {
    ...updatedBookings[bookingIndex],
    ...updatedBooking
  };

  saveBookingsToStorage(updatedBookings);
  return updatedBookings[bookingIndex];
};

/**
 * Cancel a booking
 *
 * @param bookingId - The ID of the booking to cancel
 * @returns True if the booking was cancelled, false otherwise
 */
export const cancelBooking = (bookingId: string): boolean => {
  const bookings = loadBookingsFromStorage();
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);

  if (bookingIndex === -1) {
    return false;
  }

  const updatedBookings = [...bookings];
  updatedBookings[bookingIndex] = {
    ...updatedBookings[bookingIndex],
    status: "cancelled"
  };

  saveBookingsToStorage(updatedBookings);
  return true;
};

/**
 * Delete a booking
 *
 * @param bookingId - The ID of the booking to delete
 * @returns True if the booking was deleted, false otherwise
 */
export const deleteBooking = (bookingId: string): boolean => {
  const bookings = loadBookingsFromStorage();
  const filteredBookings = bookings.filter(booking => booking.id !== bookingId);

  if (filteredBookings.length === bookings.length) {
    return false;
  }

  saveBookingsToStorage(filteredBookings);
  return true;
};

/**
 * Get all bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns Array of bookings for the car
 */
export const getBookingsByCarId = (carId: number): Booking[] => {
  const allBookings = loadBookingsFromStorage();
  return allBookings.filter(booking => booking.carId === carId);
};

/**
 * Get active bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns Array of active bookings for the car
 */
export const getActiveBookingsByCarId = (carId: number): Booking[] => {
  const allBookings = getBookingsByCarId(carId);
  return allBookings.filter(booking => booking.status === "active");
};

/**
 * Check if a car is available for a specific date range
 *
 * @param carId - The ID of the car
 * @param startDate - The start date of the booking
 * @param endDate - The end date of the booking
 * @returns True if the car is available, false otherwise
 */
export const isCarAvailableForDates = (
  carId: number,
  startDate: Date,
  endDate: Date
): boolean => {
  // First check if the car exists and is marked as available
  const car = getCarById(carId);
  if (!car || !car.availability) {
    return false;
  }

  const activeBookings = getActiveBookingsByCarId(carId);

  // If there are no active bookings, the car is available
  if (activeBookings.length === 0) {
    return true;
  }

  // Convert dates to timestamps for easier comparison
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Check if there's any overlap with existing bookings
  return !activeBookings.some(booking => {
    const bookingStartTimestamp = new Date(booking.startDate).getTime();
    const bookingEndTimestamp = new Date(booking.endDate).getTime();

    // Check for overlap
    return (
      (startTimestamp >= bookingStartTimestamp && startTimestamp <= bookingEndTimestamp) ||
      (endTimestamp >= bookingStartTimestamp && endTimestamp <= bookingEndTimestamp) ||
      (startTimestamp <= bookingStartTimestamp && endTimestamp >= bookingEndTimestamp)
    );
  });
};

/**
 * Get upcoming bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns Array of upcoming bookings for the car
 */
export const getUpcomingBookingsByCarId = (carId: number): Booking[] => {
  const now = new Date();
  const activeBookings = getActiveBookingsByCarId(carId);

  return activeBookings.filter(booking => {
    const bookingStartDate = new Date(booking.startDate);
    return bookingStartDate > now;
  });
};

/**
 * Get current bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns Array of current bookings for the car
 */
export const getCurrentBookingsByCarId = (carId: number): Booking[] => {
  const now = new Date();
  const activeBookings = getActiveBookingsByCarId(carId);

  return activeBookings.filter(booking => {
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);
    return bookingStartDate <= now && bookingEndDate >= now;
  });
};

/**
 * Get completed bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns Array of completed bookings for the car
 */
export const getCompletedBookingsByCarId = (carId: number): Booking[] => {
  const allBookings = getBookingsByCarId(carId);
  return allBookings.filter(booking => booking.status === "completed");
};

/**
 * Get the total number of bookings for a specific car
 *
 * @param carId - The ID of the car
 * @returns The total number of bookings
 */
export const getTotalBookingsCountByCarId = (carId: number): number => {
  return getBookingsByCarId(carId).length;
};

/**
 * Get the total revenue for a specific car
 *
 * @param carId - The ID of the car
 * @returns The total revenue
 */
export const getTotalRevenueByCarId = (carId: number): number => {
  const allBookings = getBookingsByCarId(carId);
  return allBookings.reduce((total, booking) => total + booking.totalPrice, 0);
};

/**
 * Get all bookings for a user with car details
 *
 * @param userId - The ID of the user
 * @returns Array of bookings with car details
 */
export const getUserBookings = (userId: string): Array<Booking & { car: Car }> => {
  const userBookings = getBookingsByUserId(userId);

  // Enrich bookings with car details
  return userBookings.map(booking => {
    const car = getCarById(booking.carId);
    return {
      ...booking,
      car: car || {
        id: booking.carId,
        name: "Unknown Car",
        brand: "Unknown",
        model: "Unknown",
        year: 0,
        category: "Unknown",
        dailyPrice: 0,
        transmission: "Unknown",
        fuelType: "Unknown",
        seats: 0,
        features: [],
        images: ["/images/car-placeholder.jpg"],
        rating: 0,
        reviews: 0,
        availability: false
      }
    };
  });
};

/**
 * Get the most popular cars based on booking count
 *
 * @param limit - Maximum number of cars to return (default: 4)
 * @returns Array of cars sorted by booking count
 */
export const getPopularCars = (limit: number = 4): Array<Car & { bookingCount: number }> => {
  const allBookings = getAllBookings();
  const allCars = getAllCars();

  // Count bookings for each car
  const carBookingCounts: Record<number, number> = {};

  allBookings.forEach(booking => {
    if (!carBookingCounts[booking.carId]) {
      carBookingCounts[booking.carId] = 0;
    }
    carBookingCounts[booking.carId]++;
  });

  // Enrich cars with booking counts and sort by count
  const carsWithBookingCounts = allCars.map(car => ({
    ...car,
    bookingCount: carBookingCounts[car.id] || 0
  }));

  // Sort by booking count (descending)
  const sortedCars = carsWithBookingCounts.sort((a, b) => b.bookingCount - a.bookingCount);

  // Return the top N cars
  return sortedCars.slice(0, limit);
};

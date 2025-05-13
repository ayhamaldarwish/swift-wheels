import { UserRating, RatingStats } from "@/types/rating";

const RATINGS_STORAGE_KEY = "userRatings";

/**
 * Get all user ratings from localStorage
 */
export const getAllRatings = (): UserRating[] => {
  const ratingsJson = localStorage.getItem(RATINGS_STORAGE_KEY);
  return ratingsJson ? JSON.parse(ratingsJson) : [];
};

/**
 * Save a new rating
 */
export const saveRating = (rating: UserRating): UserRating => {
  const ratings = getAllRatings();
  
  // Check if this user has already rated this car for this booking
  const existingRatingIndex = ratings.findIndex(
    r => r.userId === rating.userId && r.carId === rating.carId && r.bookingId === rating.bookingId
  );
  
  if (existingRatingIndex >= 0) {
    // Update existing rating
    ratings[existingRatingIndex] = {
      ...ratings[existingRatingIndex],
      rating: rating.rating,
      comment: rating.comment,
      createdAt: new Date().toISOString()
    };
  } else {
    // Add new rating
    ratings.push(rating);
  }
  
  // Save to localStorage
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  
  return rating;
};

/**
 * Get ratings for a specific car
 */
export const getCarRatings = (carId: number): UserRating[] => {
  const ratings = getAllRatings();
  return ratings.filter(rating => rating.carId === carId);
};

/**
 * Get rating statistics for a specific car
 */
export const getCarRatingStats = (carId: number): RatingStats => {
  const ratings = getCarRatings(carId);
  
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  // Calculate average rating
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const average = sum / ratings.length;
  
  // Calculate distribution
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  ratings.forEach(rating => {
    distribution[rating.rating as 1 | 2 | 3 | 4 | 5]++;
  });
  
  return {
    averageRating: parseFloat(average.toFixed(1)),
    totalRatings: ratings.length,
    distribution
  };
};

/**
 * Check if a user has rated a specific booking
 */
export const hasUserRatedBooking = (userId: string, bookingId: string): boolean => {
  const ratings = getAllRatings();
  return ratings.some(rating => rating.userId === userId && rating.bookingId === bookingId);
};

/**
 * Get a user's rating for a specific booking
 */
export const getUserRatingForBooking = (userId: string, bookingId: string): UserRating | null => {
  const ratings = getAllRatings();
  return ratings.find(rating => rating.userId === userId && rating.bookingId === bookingId) || null;
};

/**
 * Delete a rating
 */
export const deleteRating = (ratingId: string): boolean => {
  const ratings = getAllRatings();
  const filteredRatings = ratings.filter(rating => rating.id !== ratingId);
  
  if (filteredRatings.length === ratings.length) {
    return false; // Rating not found
  }
  
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(filteredRatings));
  return true;
};

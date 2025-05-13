import { Car } from "@/types/car";
import { getCarById } from "@/data/mockData";

// Storage key for favorites
const FAVORITES_STORAGE_KEY = "swift-wheels-favorites";

/**
 * Get all favorite cars for a user
 * 
 * @param userId User ID
 * @returns Array of favorite car IDs
 */
export const getFavoriteIds = (userId: string): number[] => {
  try {
    const favoritesMap = getFavoritesMap();
    return favoritesMap[userId] || [];
  } catch (error) {
    console.error("Error getting favorite IDs:", error);
    return [];
  }
};

/**
 * Get all favorite cars for a user as Car objects
 * 
 * @param userId User ID
 * @returns Array of favorite Car objects
 */
export const getFavoriteCars = (userId: string): Car[] => {
  const favoriteIds = getFavoriteIds(userId);
  return favoriteIds
    .map(id => getCarById(id))
    .filter((car): car is Car => car !== undefined);
};

/**
 * Add a car to user's favorites
 * 
 * @param userId User ID
 * @param carId Car ID to add to favorites
 * @returns true if added successfully, false otherwise
 */
export const addToFavorites = (userId: string, carId: number): boolean => {
  try {
    const favoritesMap = getFavoritesMap();
    const userFavorites = favoritesMap[userId] || [];
    
    // Check if already in favorites
    if (userFavorites.includes(carId)) {
      return false;
    }
    
    // Add to favorites
    favoritesMap[userId] = [...userFavorites, carId];
    saveFavoritesMap(favoritesMap);
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};

/**
 * Remove a car from user's favorites
 * 
 * @param userId User ID
 * @param carId Car ID to remove from favorites
 * @returns true if removed successfully, false otherwise
 */
export const removeFromFavorites = (userId: string, carId: number): boolean => {
  try {
    const favoritesMap = getFavoritesMap();
    const userFavorites = favoritesMap[userId] || [];
    
    // Check if in favorites
    if (!userFavorites.includes(carId)) {
      return false;
    }
    
    // Remove from favorites
    favoritesMap[userId] = userFavorites.filter(id => id !== carId);
    saveFavoritesMap(favoritesMap);
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};

/**
 * Check if a car is in user's favorites
 * 
 * @param userId User ID
 * @param carId Car ID to check
 * @returns true if car is in favorites, false otherwise
 */
export const isInFavorites = (userId: string, carId: number): boolean => {
  try {
    const favoritesMap = getFavoritesMap();
    const userFavorites = favoritesMap[userId] || [];
    return userFavorites.includes(carId);
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
};

/**
 * Toggle a car's favorite status
 * 
 * @param userId User ID
 * @param carId Car ID to toggle
 * @returns true if added to favorites, false if removed
 */
export const toggleFavorite = (userId: string, carId: number): boolean => {
  if (isInFavorites(userId, carId)) {
    removeFromFavorites(userId, carId);
    return false;
  } else {
    addToFavorites(userId, carId);
    return true;
  }
};

/**
 * Get the total count of favorite cars for a user
 * 
 * @param userId User ID
 * @returns Number of favorite cars
 */
export const getFavoritesCount = (userId: string): number => {
  return getFavoriteIds(userId).length;
};

// Helper functions for localStorage

/**
 * Get the favorites map from localStorage
 * 
 * @returns Map of user IDs to arrays of favorite car IDs
 */
const getFavoritesMap = (): Record<string, number[]> => {
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!storedFavorites) {
    return {};
  }
  
  try {
    return JSON.parse(storedFavorites);
  } catch (error) {
    console.error("Error parsing favorites:", error);
    return {};
  }
};

/**
 * Save the favorites map to localStorage
 * 
 * @param favoritesMap Map of user IDs to arrays of favorite car IDs
 */
const saveFavoritesMap = (favoritesMap: Record<string, number[]>): void => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesMap));
};

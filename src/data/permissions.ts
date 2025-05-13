/**
 * Permissions configuration file
 * 
 * This file contains configuration for user permissions and special access rights
 */

// List of user IDs that are allowed to add cars (in addition to admins)
export const ALLOWED_CAR_ADDERS = [
  "_x.17a", // Special user with car adding permission
];

/**
 * Check if a user is allowed to add cars
 * 
 * @param userId The user ID to check
 * @param isAdmin Whether the user is an admin
 * @returns True if the user is allowed to add cars
 */
export const canAddCars = (userId: string | undefined, isAdmin: boolean): boolean => {
  // Admins can always add cars
  if (isAdmin) {
    return true;
  }
  
  // Check if the user ID is in the allowed list
  return !!userId && ALLOWED_CAR_ADDERS.includes(userId);
};

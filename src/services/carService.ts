import { Car, CarFilterOptions } from "@/types/car";
import { mockCars } from "@/data/mockData";

/**
 * Get all cars
 *
 * @returns Array of all cars
 */
export const getAllCars = (): Car[] => {
  return mockCars;
};

/**
 * Get car by ID
 *
 * @param id - The car ID to find
 * @returns The car object or undefined if not found
 */
export const getCarById = (id: number): Car | undefined => {
  return mockCars.find(car => car.id === id);
};

/**
 * Get cars by category
 *
 * @param category - The category to filter by
 * @returns Array of cars in the specified category
 */
export const getCarsByCategory = (category: Car["category"]): Car[] => {
  return mockCars.filter(car => car.category === category);
};

/**
 * Get cars by price range
 *
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Array of cars within the price range
 */
export const getCarsByPriceRange = (min: number, max: number): Car[] => {
  return mockCars.filter(car => car.dailyPrice >= min && car.dailyPrice <= max);
};

/**
 * Search cars by query string
 *
 * @param query - Search query
 * @returns Array of cars matching the search query
 */
export const searchCars = (query: string): Car[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockCars.filter(car =>
    car.name.toLowerCase().includes(lowercaseQuery) ||
    car.brand.toLowerCase().includes(lowercaseQuery) ||
    car.category.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Filter cars by multiple criteria
 *
 * @param options - Filter options
 * @returns Array of cars matching all filter criteria
 */
export const filterCars = (options: CarFilterOptions): Car[] => {
  let filteredCarList = [...mockCars];

  // Filter by search term
  if (options.search && options.search.trim() !== "") {
    const searchTerm = options.search.toLowerCase();
    filteredCarList = filteredCarList.filter(car =>
      car.name.toLowerCase().includes(searchTerm) ||
      car.brand.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (options.category && options.category !== "all") {
    filteredCarList = filteredCarList.filter(car =>
      car.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  // Filter by transmission
  if (options.transmission && options.transmission !== "all") {
    filteredCarList = filteredCarList.filter(car =>
      car.transmission.toLowerCase() === options.transmission?.toLowerCase()
    );
  }

  // Filter by fuel type
  if (options.fuelType && options.fuelType !== "all") {
    filteredCarList = filteredCarList.filter(car =>
      car.fuelType.toLowerCase() === options.fuelType?.toLowerCase()
    );
  }

  // Filter by price range
  if (options.priceRange) {
    const [min, max] = options.priceRange;
    filteredCarList = filteredCarList.filter(car =>
      car.dailyPrice >= min && car.dailyPrice <= max
    );
  }

  return filteredCarList;
};

/**
 * Get a random car from the available cars
 *
 * @param excludeIds - Optional array of car IDs to exclude from the selection
 * @returns A random car object
 */
export const getRandomCar = (excludeIds: number[] = []): Car => {
  // Filter out excluded cars
  const availableCars = excludeIds.length > 0
    ? mockCars.filter(car => !excludeIds.includes(car.id))
    : mockCars;

  // If no cars are available after filtering, return from all cars
  if (availableCars.length === 0) {
    const randomIndex = Math.floor(Math.random() * mockCars.length);
    return mockCars[randomIndex];
  }

  // Get a random car from the available cars
  const randomIndex = Math.floor(Math.random() * availableCars.length);
  return availableCars[randomIndex];
};

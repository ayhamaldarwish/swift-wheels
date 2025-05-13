import { User, Booking } from "@/types/auth";
import { Car } from "@/types/car";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "demo",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    permissions: ["view_cars", "book_cars", "view_own_bookings"]
  },
  {
    id: "user-2",
    username: "admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    permissions: ["view_cars", "book_cars", "view_own_bookings", "view_all_bookings", "manage_cars", "manage_users"]
  }
];

// Mock Cars
export const mockCars: Car[] = [
  {
    id: 1,
    name: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    category: "Sedan",
    dailyPrice: 150,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    features: ["Bluetooth", "Cruise Control", "Backup Camera", "Navigation System"],
    images: [
      "/images/car-1.jpg",
      "/images/car-1.jpg"
    ],
    rating: 4.8,
    reviews: 32,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/iGMUVA9FRkw",
    safetyRating: 5,
    airbags: 8,
    insuranceType: "Comprehensive",
    safetyFeatures: ["Anti-lock Braking System", "Electronic Stability Control", "Blind Spot Detection", "Lane Departure Warning"]
  },
  {
    id: 2,
    name: "Honda Accord",
    brand: "Honda",
    model: "Accord",
    year: 2022,
    category: "Sedan",
    dailyPrice: 140,
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 5,
    features: ["Bluetooth", "Cruise Control", "Backup Camera", "Sunroof"],
    images: [
      "/images/car-2.jpg",
      "/images/car-2.jpg"
    ],
    rating: 4.5,
    reviews: 28,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/qZndDu5ypRo",
    safetyRating: 4,
    airbags: 6,
    insuranceType: "Basic",
    safetyFeatures: ["Anti-lock Braking System", "Traction Control", "Rear View Camera"]
  },
  {
    id: 3,
    name: "BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2023,
    category: "SUV",
    dailyPrice: 350,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    features: ["Leather Seats", "Panoramic Roof", "Navigation System", "360 Camera"],
    images: [
      "/images/car-3.jpg",
      "/images/car-3.jpg"
    ],
    rating: 4.9,
    reviews: 45,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/vQXvyV0zIP4",
    safetyRating: 5,
    airbags: 10,
    insuranceType: "Premium",
    safetyFeatures: ["Anti-lock Braking System", "Electronic Stability Control", "Blind Spot Detection", "Lane Departure Warning", "Adaptive Cruise Control", "Collision Avoidance System"]
  },
  {
    id: 4,
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    year: 2023,
    category: "Luxury",
    dailyPrice: 300,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    features: ["Leather Seats", "Heated Seats", "Premium Sound System", "Driver Assistance Package"],
    images: [
      "/images/car-4.jpg",
      "/images/car-4.jpg"
    ],
    rating: 4.7,
    reviews: 38,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/ASQpM1YZ6Uw",
    safetyRating: 5,
    airbags: 9,
    insuranceType: "Premium",
    safetyFeatures: ["Anti-lock Braking System", "Electronic Stability Control", "Blind Spot Detection", "Lane Departure Warning", "Adaptive Cruise Control", "Night Vision Assistant"]
  },
  {
    id: 5,
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    category: "Economy",
    dailyPrice: 100,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    features: ["Bluetooth", "Backup Camera", "Lane Departure Warning"],
    images: [
      "/images/car-5.jpg",
      "/images/car-5.jpg"
    ],
    rating: 4.3,
    reviews: 54,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/YlYwfXvZNlM",
    safetyRating: 4,
    airbags: 6,
    insuranceType: "Basic",
    safetyFeatures: ["Anti-lock Braking System", "Traction Control", "Rear View Camera"]
  },
  {
    id: 6,
    name: "Nissan Altima",
    brand: "Nissan",
    model: "Altima",
    year: 2022,
    category: "Sedan",
    dailyPrice: 130,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    features: ["Bluetooth", "Cruise Control", "Keyless Entry"],
    images: [
      "/images/car-6.jpg",
      "/images/car-6.jpg"
    ],
    rating: 4.2,
    reviews: 26,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/uGQf-0pUoYY",
    safetyRating: 3,
    airbags: 4,
    insuranceType: "Basic",
    safetyFeatures: ["Anti-lock Braking System", "Traction Control"]
  },
  {
    id: 7,
    name: "Chevrolet Tahoe",
    brand: "Chevrolet",
    model: "Tahoe",
    year: 2023,
    category: "SUV",
    dailyPrice: 280,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 8,
    features: ["Third Row Seating", "Large Cargo Space", "Towing Package", "Entertainment System"],
    images: [
      "/images/car-7.jpg",
      "/images/car-7.jpg"
    ],
    rating: 4.6,
    reviews: 34,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/KyJz-yzgidM",
    safetyRating: 4,
    airbags: 8,
    insuranceType: "Comprehensive",
    safetyFeatures: ["Anti-lock Braking System", "Electronic Stability Control", "Blind Spot Detection", "Rear Cross Traffic Alert", "360-degree Camera System"]
  },
  {
    id: 8,
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    category: "Luxury",
    dailyPrice: 250,
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    features: ["Autopilot", "All-Glass Roof", "Minimalist Interior", "High Performance"],
    images: [
      "/images/car-8.jpg",
      "/images/car-8.jpg"
    ],
    rating: 4.9,
    reviews: 62,
    availability: true,
    testDriveVideo: "https://www.youtube.com/embed/9UM1GtIxAzQ",
    safetyRating: 5,
    airbags: 8,
    insuranceType: "Premium",
    safetyFeatures: ["Autopilot", "Full Self-Driving Capability", "Automatic Emergency Braking", "Collision Avoidance", "360-degree Camera System", "Sentry Mode"]
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    carId: 1,
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    totalPrice: 450,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "booking-2",
    userId: "user-1",
    carId: 3,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    endDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    totalPrice: 1750,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString() // 15 days ago
  },
  // Additional bookings to show popularity
  {
    id: "booking-3",
    userId: "user-2",
    carId: 5, // Toyota Corolla (Economy)
    startDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    totalPrice: 500,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: "booking-4",
    userId: "user-1",
    carId: 5, // Toyota Corolla (Economy) - second booking
    startDate: new Date(Date.now() - 86400000 * 40).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 35).toISOString(),
    totalPrice: 500,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: "booking-5",
    userId: "user-2",
    carId: 5, // Toyota Corolla (Economy) - third booking
    startDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 55).toISOString(),
    totalPrice: 500,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 65).toISOString()
  },
  {
    id: "booking-6",
    userId: "user-1",
    carId: 8, // Tesla Model 3 (Luxury)
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 25).toISOString(),
    totalPrice: 1250,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString()
  },
  {
    id: "booking-7",
    userId: "user-2",
    carId: 8, // Tesla Model 3 (Luxury) - second booking
    startDate: new Date(Date.now() - 86400000 * 50).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 45).toISOString(),
    totalPrice: 1250,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 55).toISOString()
  },
  {
    id: "booking-8",
    userId: "user-1",
    carId: 3, // BMW X5 (SUV) - second booking
    startDate: new Date(Date.now() - 86400000 * 70).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 65).toISOString(),
    totalPrice: 1750,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 75).toISOString()
  },
  {
    id: "booking-9",
    userId: "user-2",
    carId: 4, // Mercedes-Benz E-Class (Luxury)
    startDate: new Date(Date.now() - 86400000 * 80).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 75).toISOString(),
    totalPrice: 1500,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 85).toISOString()
  }
];

// Helper functions for mock data
export const getCarById = (id: number): Car | undefined => {
  return mockCars.find(car => car.id === id);
};

export const getCarsByCategory = (category: Car["category"]): Car[] => {
  return mockCars.filter(car => car.category === category);
};

export const getCarsByPriceRange = (min: number, max: number): Car[] => {
  return mockCars.filter(car => car.dailyPrice >= min && car.dailyPrice <= max);
};

export const searchCars = (query: string): Car[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockCars.filter(car =>
    car.name.toLowerCase().includes(lowercaseQuery) ||
    car.brand.toLowerCase().includes(lowercaseQuery) ||
    car.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Get similar cars based on category and price range
export const getSimilarCars = (carId: number, limit: number = 4): Car[] => {
  const car = getCarById(carId);
  if (!car) return [];

  // Get cars with the same category
  const sameCategoryCars = mockCars.filter(c =>
    c.id !== carId &&
    c.category === car.category
  );

  // Get cars with similar price range (±30%)
  const minPrice = car.dailyPrice * 0.7;
  const maxPrice = car.dailyPrice * 1.3;
  const similarPriceCars = mockCars.filter(c =>
    c.id !== carId &&
    c.category !== car.category && // Exclude same category cars to avoid duplicates
    c.dailyPrice >= minPrice &&
    c.dailyPrice <= maxPrice
  );

  // Combine and shuffle the results
  const combinedCars = [...sameCategoryCars, ...similarPriceCars];

  // Shuffle array using Fisher-Yates algorithm
  for (let i = combinedCars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedCars[i], combinedCars[j]] = [combinedCars[j], combinedCars[i]];
  }

  // Return limited number of cars
  return combinedCars.slice(0, limit);
};

// Local Storage Helpers
export const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUserToStorage = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem("user");
};

export const loadBookingsFromStorage = (): Booking[] => {
  const storedBookings = localStorage.getItem("bookings");
  return storedBookings ? JSON.parse(storedBookings) : [];
};

export const saveBookingsToStorage = (bookings: Booking[]): void => {
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

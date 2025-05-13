
import { Car } from "@/types/car";
import { mockCars } from "@/data/mockData";

// Re-export the mock cars for backward compatibility
export const cars: Car[] = mockCars;

// This file is kept for backward compatibility.
// Please use mockData.ts and carService.ts for new code.

/* Original car data - now moved to mockData.ts
export const carsOriginal: Car[] = [
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
    availability: true
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
    availability: true
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
    availability: true
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
    availability: true
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
    availability: true
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
    availability: true
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
    availability: true
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
    availability: true
  }
];

export const getCarById = (id: number): Car | undefined => {
  return cars.find(car => car.id === id);
};

export const getCarsByCategory = (category: Car["category"]): Car[] => {
  return cars.filter(car => car.category === category);
};

export const getCarsByPriceRange = (min: number, max: number): Car[] => {
  return cars.filter(car => car.dailyPrice >= min && car.dailyPrice <= max);
};

export const searchCars = (query: string): Car[] => {
  const lowercaseQuery = query.toLowerCase();
  return cars.filter(car =>
    car.name.toLowerCase().includes(lowercaseQuery) ||
    car.brand.toLowerCase().includes(lowercaseQuery) ||
    car.category.toLowerCase().includes(lowercaseQuery)
  );
};
*/

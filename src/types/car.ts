export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: "SUV" | "Sedan" | "Economy" | "Luxury" | "Sports";
  dailyPrice: number;
  transmission: "Manual" | "Automatic";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  features: string[];
  images: string[];
  rating: number;
  reviews: number;
  availability: boolean;
  testDriveVideo?: string; // YouTube video URL for virtual test drive

  // Safety and Insurance Information
  safetyRating?: number; // Safety rating out of 5
  airbags?: number; // Number of airbags
  insuranceType?: "Basic" | "Comprehensive" | "Premium"; // Type of insurance
  safetyFeatures?: string[]; // Additional safety features

  // Metadata for tracking who added/modified the car
  addedBy?: string; // User ID of the user who added the car
  addedByName?: string; // Name of the user who added the car
  addedAt?: string; // ISO date string when the car was added
  lastModifiedBy?: string; // User ID of the user who last modified the car
  lastModifiedAt?: string; // ISO date string when the car was last modified
}

export interface CarFilterOptions {
  search?: string;
  category?: string;
  transmission?: string;
  fuelType?: string;
  priceRange?: [number, number];
}

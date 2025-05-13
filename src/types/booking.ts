import { Car } from "./car";

export interface Booking {
  id: string;
  carId: number;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  car?: Car; // Optional car details
  deliveryStatus?: "processing" | "delivered" | "pending"; // Car delivery status
}

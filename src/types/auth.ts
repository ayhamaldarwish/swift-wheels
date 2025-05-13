
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "user";
  permissions?: string[];
  pin?: string; // 4-digit PIN for simplified login
}

export interface Booking {
  id: string;
  carId: number;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
}

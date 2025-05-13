export interface UserRating {
  id: string;
  userId: string;
  carId: number;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

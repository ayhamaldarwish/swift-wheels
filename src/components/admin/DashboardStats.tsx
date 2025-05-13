import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, BarChart3, Calendar, TrendingUp, Users, Car as CarIcon } from "lucide-react";
import { Car as CarType } from "@/types/car";
import { Booking } from "@/types/auth";
import BookingChart from "./BookingChart";

interface DashboardStatsProps {
  cars: CarType[];
  bookings: Booking[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ cars, bookings }) => {
  const { t } = useLanguage();

  // Calculate statistics
  const stats = useMemo(() => {
    // Total cars
    const totalCars = cars.length;

    // Total bookings
    const totalBookings = bookings.length;

    // Active bookings
    const activeBookings = bookings.filter(booking => booking.status === "active").length;

    // Completed bookings
    const completedBookings = bookings.filter(booking => booking.status === "completed").length;

    // Calculate most booked car
    const bookingCountByCar: Record<number, number> = {};
    bookings.forEach(booking => {
      bookingCountByCar[booking.carId] = (bookingCountByCar[booking.carId] || 0) + 1;
    });

    let mostBookedCarId = 0;
    let maxBookings = 0;

    Object.entries(bookingCountByCar).forEach(([carId, count]) => {
      if (count > maxBookings) {
        mostBookedCarId = parseInt(carId);
        maxBookings = count;
      }
    });

    const mostBookedCar = cars.find(car => car.id === mostBookedCarId);

    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    return {
      totalCars,
      totalBookings,
      activeBookings,
      completedBookings,
      mostBookedCar: mostBookedCar || null,
      mostBookedCarCount: maxBookings,
      totalRevenue
    };
  }, [cars, bookings]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t("admin.stats.title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Cars */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.stats.total_cars")}
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.stats.total_bookings")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{stats.activeBookings}</span> {t("admin.stats.active_bookings")},&nbsp;
              <span className="text-blue-500 font-medium">{stats.completedBookings}</span> {t("admin.stats.completed_bookings")}
            </div>
          </CardContent>
        </Card>

        {/* Most Booked Car */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.stats.most_booked")}
            </CardTitle>
            <CarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.mostBookedCar ? (
              <>
                <div className="text-lg font-bold truncate">
                  {stats.mostBookedCar.brand} {stats.mostBookedCar.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.mostBookedCarCount} {t("admin.stats.times_booked")}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t("admin.bookings.no_bookings")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.stats.revenue")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue} {t("cardetails.price.currency")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BookingChart cars={cars} bookings={bookings} />
      </div>
    </div>
  );
};

export default DashboardStats;

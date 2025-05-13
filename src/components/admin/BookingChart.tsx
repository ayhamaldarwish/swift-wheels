import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Booking } from "@/types/auth";
import { Car } from "@/types/car";

interface BookingChartProps {
  bookings: Booking[];
  cars: Car[];
}

const BookingChart: React.FC<BookingChartProps> = ({ bookings, cars }) => {
  const { t, isRTL } = useLanguage();

  // Prepare data for the chart
  const chartData = useMemo(() => {
    // Group bookings by car
    const bookingsByCarId: Record<number, number> = {};
    
    bookings.forEach(booking => {
      bookingsByCarId[booking.carId] = (bookingsByCarId[booking.carId] || 0) + 1;
    });
    
    // Convert to chart data format
    return Object.entries(bookingsByCarId)
      .map(([carId, count]) => {
        const car = cars.find(c => c.id === parseInt(carId));
        return {
          name: car ? `${car.brand} ${car.name}` : `Car #${carId}`,
          bookings: count
        };
      })
      .sort((a, b) => b.bookings - a.bookings) // Sort by most bookings
      .slice(0, 5); // Take top 5
  }, [bookings, cars]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("admin.stats.most_booked")}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout={isRTL ? "vertical" : "horizontal"}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                {isRTL ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" />
                    <YAxis />
                  </>
                )}
                <Tooltip 
                  formatter={(value) => [`${value} ${t("admin.stats.times_booked")}`, ""]}
                  labelFormatter={(label) => label}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  label={{ 
                    position: 'top',
                    formatter: (value: any) => value,
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            {t("admin.bookings.no_bookings")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingChart;

import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/auth";
import { Car } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, isSameDay, isWithinInterval, addDays, eachDayOfInterval, isBefore, isAfter, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getCarById } from "@/services/carService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, Clock, DollarSign, User, ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  bookings: Booking[];
  car?: Car;
  className?: string;
  interactive?: boolean;
}

// Define booking status types for visual representation
type BookingStatus = 'start' | 'middle' | 'end' | 'single-day';

// Interface for enhanced booking data with visual status
interface EnhancedBooking extends Booking {
  status?: BookingStatus;
  dayPosition?: 'first' | 'middle' | 'last' | 'single';
  color?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  car,
  className,
  interactive = true
}) => {
  const { t, isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [hoveredBookingId, setHoveredBookingId] = useState<string | null>(null);

  // If car is not provided but we have bookings, try to get the car from the first booking
  const [carInfo, setCarInfo] = useState<Car | undefined>(car);

  // Generate a unique color for each booking
  const bookingColors = useMemo(() => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-orange-100 text-orange-800 border-orange-200',
    ];

    return bookings.reduce((acc, booking, index) => {
      acc[booking.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [bookings]);

  React.useEffect(() => {
    if (!carInfo && bookings.length > 0) {
      const firstBooking = bookings[0];
      const fetchedCar = getCarById(firstBooking.carId);
      if (fetchedCar) {
        setCarInfo(fetchedCar);
      }
    }
  }, [carInfo, bookings]);

  // Function to check if a date has bookings
  const hasBookingOnDate = (date: Date) => {
    return bookings.some(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Function to get bookings for a specific date with enhanced information
  const getBookingsForDate = (date: Date): EnhancedBooking[] => {
    return bookings
      .filter(booking => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        return isWithinInterval(date, { start: startDate, end: endDate });
      })
      .map(booking => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const isSingleDay = isSameDay(startDate, endDate);

        let status: BookingStatus;
        let dayPosition: 'first' | 'middle' | 'last' | 'single';

        if (isSingleDay) {
          status = 'single-day';
          dayPosition = 'single';
        } else if (isSameDay(date, startDate)) {
          status = 'start';
          dayPosition = 'first';
        } else if (isSameDay(date, endDate)) {
          status = 'end';
          dayPosition = 'last';
        } else {
          status = 'middle';
          dayPosition = 'middle';
        }

        return {
          ...booking,
          status,
          dayPosition,
          color: bookingColors[booking.id]
        };
      });
  };

  // Function to get all dates with bookings in the current month
  const getDatesWithBookings = () => {
    const dates: Date[] = [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Filter days that have bookings
    return daysInMonth.filter(day => hasBookingOnDate(day));
  };

  // Get all bookings with their date ranges for the current month
  const getMonthBookings = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    return bookings
      .filter(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        // Check if booking overlaps with current month
        return (
          (isWithinInterval(bookingStart, { start: monthStart, end: monthEnd }) ||
           isWithinInterval(bookingEnd, { start: monthStart, end: monthEnd })) ||
          (isBefore(bookingStart, monthStart) && isAfter(bookingEnd, monthEnd))
        );
      })
      .map(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        // Calculate days in current month
        const visibleStart = isBefore(bookingStart, monthStart) ? monthStart : bookingStart;
        const visibleEnd = isAfter(bookingEnd, monthEnd) ? monthEnd : bookingEnd;

        const days = differenceInDays(bookingEnd, bookingStart) + 1;

        return {
          ...booking,
          visibleStart,
          visibleEnd,
          days,
          color: bookingColors[booking.id]
        };
      });
  }, [bookings, currentMonth, bookingColors]);

  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    const dayBookings = getBookingsForDate(day);
    const hasBooking = dayBookings.length > 0;

    if (!hasBooking) return null;

    return (
      <div className="relative w-full h-full">
        {dayBookings.map((booking, index) => {
          const isStart = booking.status === 'start' || booking.status === 'single-day';
          const isEnd = booking.status === 'end' || booking.status === 'single-day';

          return (
            <div
              key={booking.id}
              className={`absolute h-1 ${booking.color?.split(' ')[0]} ${
                index === 0 ? 'bottom-1' : index === 1 ? 'bottom-3' : 'bottom-5'
              } ${
                isStart ? 'left-1/2 rounded-l-full' : 'left-0'
              } ${
                isEnd ? 'right-1/2 rounded-r-full' : 'right-0'
              } ${
                booking.status === 'single-day' ? 'left-1/4 right-1/4 rounded-full' : ''
              }`}
              style={{ opacity: hoveredBookingId === booking.id ? 1 : 0.7 }}
            />
          );
        })}
      </div>
    );
  };

  // Get bookings for the selected date
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  // Function to navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Function to toggle between month and day view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'month' ? 'day' : 'month');
  };

  return (
    <Card className={`${className} overflow-hidden`} dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{t("cardetails.bookings.calendar.title")}</CardTitle>
            <CardDescription>{t("cardetails.bookings.calendar.desc")}</CardDescription>
          </div>

          {carInfo && (
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                <OptimizedImage
                  src={carInfo.images[0]}
                  alt={carInfo.name}
                  aspectRatio="aspect-square"
                  containerClassName="h-full"
                  loadingStrategy="lazy"
                  showSkeleton={true}
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">{carInfo.name}</h3>
                <p className="text-xs text-muted-foreground">{carInfo.brand} {carInfo.year}</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="calendar">{t("cardetails.bookings.calendar.view")}</TabsTrigger>
            <TabsTrigger value="list">{t("cardetails.bookings.calendar.list")}</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t("cardetails.bookings.calendar.prev_month")}</span>
              </Button>

              <h3 className="text-sm font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">{t("cardetails.bookings.calendar.next_month")}</span>
              </Button>
            </div>

            {/* Calendar Legend */}
            {bookings.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {getMonthBookings.map(booking => (
                  <div
                    key={booking.id}
                    className={`text-xs px-2 py-1 rounded-full border ${booking.color} cursor-pointer transition-opacity duration-200`}
                    onMouseEnter={() => setHoveredBookingId(booking.id)}
                    onMouseLeave={() => setHoveredBookingId(null)}
                  >
                    {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                  </div>
                ))}
              </div>
            )}

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={setCurrentMonth}
              className="border rounded-md"
              modifiers={{
                booked: getDatesWithBookings(),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(var(--primary), 0.05)",
                  color: "var(--primary)",
                  borderRadius: "0",
                },
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const hasBooking = hasBookingOnDate(date);
                  const dayBookings = getBookingsForDate(date);

                  return (
                    <div
                      {...props}
                      className={`relative ${props.className} ${
                        hasBooking ? "font-medium" : ""
                      }`}
                    >
                      <div className="relative z-10">{date.getDate()}</div>

                      {/* Render booking indicators */}
                      {renderDay(date)}

                      {/* Tooltip for bookings */}
                      {hasBooking && interactive && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute inset-0 z-20 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="center" className="p-0 bg-white">
                              <div className="p-2 max-w-[250px]">
                                <p className="font-medium text-xs mb-1">{format(date, "EEEE, MMMM d, yyyy")}</p>
                                <div className="space-y-1">
                                  {dayBookings.map(booking => (
                                    <div
                                      key={booking.id}
                                      className={`text-xs p-1 rounded ${booking.color}`}
                                      onMouseEnter={() => setHoveredBookingId(booking.id)}
                                      onMouseLeave={() => setHoveredBookingId(null)}
                                    >
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>
                                          {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                },
              }}
            />

            {selectedDate && selectedDateBookings.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium">
                  {t("cardetails.bookings.calendar.selected")}:{" "}
                  <span className="font-bold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </h3>
                <div className="space-y-2">
                  {selectedDateBookings.map((booking) => {
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);
                    const isStartDate = isSameDay(selectedDate, startDate);
                    const isEndDate = isSameDay(selectedDate, endDate);
                    const days = differenceInDays(endDate, startDate) + 1;

                    return (
                      <div
                        key={booking.id}
                        className={`p-3 border rounded-md ${booking.color} transition-all duration-200 hover:shadow-md`}
                        onMouseEnter={() => setHoveredBookingId(booking.id)}
                        onMouseLeave={() => setHoveredBookingId(null)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                          </span>
                          <div className="flex gap-1">
                            {isStartDate && (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                {t("cardetails.bookings.calendar.start")}
                              </Badge>
                            )}
                            {isEndDate && (
                              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                {t("cardetails.bookings.calendar.end")}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{days} {days === 1 ? t("cardetails.booking.day") : t("cardetails.booking.days")}</span>
                          </div>
                          {booking.userId && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{booking.userId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const startDate = new Date(booking.startDate);
                  const endDate = new Date(booking.endDate);
                  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  const isActive = new Date() >= startDate && new Date() <= endDate;
                  const isUpcoming = new Date() < startDate;
                  const isPast = new Date() > endDate;
                  const color = bookingColors[booking.id];

                  return (
                    <div
                      key={booking.id}
                      className={`p-3 border rounded-md ${color} transition-all duration-200 hover:shadow-md`}
                      onMouseEnter={() => setHoveredBookingId(booking.id)}
                      onMouseLeave={() => setHoveredBookingId(null)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${
                            isActive ? "bg-accent/20 text-accent border-accent/30" :
                            isUpcoming ? "bg-green-100 text-green-700 border-green-200" :
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {isActive
                            ? t("cardetails.bookings.current")
                            : isUpcoming
                              ? t("cardetails.bookings.scheduled")
                              : t("cardetails.bookings.past")
                          }
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{days} {days === 1 ? t("cardetails.booking.day") : t("cardetails.booking.days")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(startDate, "EEEE, MMM d")}</span>
                        </div>
                        {booking.userId && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{booking.userId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t("cardetails.bookings.none")}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;

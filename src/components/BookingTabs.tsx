import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types/auth";
import { Car } from "@/types/car";
import { getCarById } from "@/services/carService";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Calendar, Clock, Archive } from "lucide-react";
import BookingInvoice from "@/components/BookingInvoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BookingTabsProps {
  highlightedBookingId?: string | null;
}

const BookingTabs: React.FC<BookingTabsProps> = ({ highlightedBookingId }) => {
  const { t, isRTL } = useLanguage();
  const { user, bookings, cancelBooking } = useAuth();

  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [archivedBookings, setArchivedBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Update bookings when the bookings array changes
  useEffect(() => {
    if (bookings.length > 0) {
      const now = new Date();

      // First, categorize each booking exactly once
      const categorizedBookings = bookings.reduce((result, booking) => {
        const endDate = new Date(booking.endDate);
        const isActive = booking.status === "active" && endDate >= now;

        if (isActive) {
          result.active.push(booking);
        } else {
          result.archived.push(booking);
        }

        return result;
      }, { active: [] as Booking[], archived: [] as Booking[] });

      // Sort bookings by start date (newest first)
      const sortBookings = (a: Booking, b: Booking) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

      const sortedActive = categorizedBookings.active.sort(sortBookings);
      const sortedArchived = categorizedBookings.archived.sort(sortBookings);

      setActiveBookings(sortedActive);
      setArchivedBookings(sortedArchived);
    } else {
      setActiveBookings([]);
      setArchivedBookings([]);
    }
  }, [bookings]);

  // Handle view invoice
  const handleViewInvoice = (booking: Booking) => {
    // Create a deep copy of the booking to avoid any reference issues
    const bookingCopy = JSON.parse(JSON.stringify(booking));
    setSelectedBooking(bookingCopy);
    const car = getCarById(booking.carId);
    setSelectedCar(car || null);
    setShowInvoice(true);
  };

  // Handle cancel booking
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(t("booking.cancel.confirm"))) {
      try {
        cancelBooking(bookingId);

        // Update local state to reflect the cancellation immediately
        // This helps prevent any key conflicts during the state update
        setActiveBookings(prev =>
          prev.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  // Render a booking card
  const renderBookingCard = (booking: Booking, isArchived: boolean = false) => {
    const car = getCarById(booking.carId);
    if (!car) return null;

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const now = new Date();
    const isActive = now >= startDate && now <= endDate && booking.status === "active";
    const isPast = now > endDate || booking.status === "completed";
    const isCancelled = booking.status === "cancelled";
    const isHighlighted = booking.id === highlightedBookingId;

    // Generate a unique identifier for this booking card
    const bookingType = isArchived ? 'archived' : 'active';
    const uniqueId = `${booking.id}-${bookingType}-${Date.now()}`;

    // Calculate duration in days
    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <Card
        id={`booking-card-${uniqueId}`}
        data-booking-id={booking.id}
        data-booking-type={bookingType}
        className={`mb-4 overflow-hidden transition-all ${
          isHighlighted ? "ring-2 ring-primary shadow-lg" : ""
        } ${isArchived ? "opacity-80" : ""}`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-48 md:h-auto relative">
            <OptimizedImage
              src={car.images[0]}
              alt={car.name}
              aspectRatio="aspect-auto"
              containerClassName="h-full"
              loadingStrategy="lazy"
              showSkeleton={true}
            />
            <div className="absolute top-0 left-0 m-2">
              {isActive && (
                <Badge className="bg-green-500 text-white">
                  نشطة
                </Badge>
              )}
              {isPast && !isCancelled && (
                <Badge className="bg-blue-500 text-white">
                  مكتملة
                </Badge>
              )}
              {isCancelled && (
                <Badge className="bg-red-500 text-white">
                  ملغية
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold">{car.brand} {car.name}</h3>
                <p className="text-muted-foreground">{car.category} • {car.year}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {booking.totalPrice} {t("cardetails.price.currency")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {durationInDays} {t("booking.days")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm font-medium">{t("booking.dates")}</div>
                  <div className="text-sm">
                    {format(startDate, "yyyy/MM/dd")} - {format(endDate, "yyyy/MM/dd")}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm font-medium">{t("booking.created")}</div>
                  <div className="text-sm">
                    {format(new Date(booking.createdAt), "yyyy/MM/dd")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewInvoice(booking)}
              >
                {t("booking.view_invoice")}
              </Button>

              {!isArchived && !isCancelled && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("booking.tabs.active")}
            {activeBookings.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            {t("booking.tabs.archived")}
            {archivedBookings.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {archivedBookings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeBookings.length > 0 ? (
            <div className="booking-list active-bookings">
              {activeBookings.map((booking, index) => (
                <div key={`active-booking-${booking.id}-${index}`} className="booking-item">
                  {renderBookingCard(booking, false)}
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">{t("booking.no_active")}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {archivedBookings.length > 0 ? (
            <div className="booking-list archived-bookings">
              {archivedBookings.map((booking, index) => (
                <div key={`archived-booking-${booking.id}-${index}`} className="booking-item">
                  {renderBookingCard(booking, true)}
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">{t("booking.no_archived")}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Invoice Dialog */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("invoice.title")}</DialogTitle>
          </DialogHeader>
          {selectedBooking && selectedCar && (
            <BookingInvoice booking={selectedBooking} car={selectedCar} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingTabs;

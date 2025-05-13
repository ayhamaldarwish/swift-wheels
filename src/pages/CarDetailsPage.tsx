
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizedImage } from "@/components/ui/optimized-image";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import { getCarById } from "@/services/carService";
import { getSimilarCars } from "@/data/mockData";
import { getCarRatingStats, getCarRatings } from "@/services/ratingService";
import {
  getBookingsByCarId,
  getActiveBookingsByCarId,
  getUpcomingBookingsByCarId,
  getTotalBookingsCountByCarId,
  getTotalRevenueByCarId
} from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ButtonLoader } from "@/components/ui/loader";
import { SuccessNotification } from "@/components/ui/success-notification";
import { ReadOnlyRating } from "@/components/ui/rating";
import { Star, CalendarIcon, DollarSign, Users, Clock, Calendar as CalendarIcon2, PlayCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimilarCars from "@/components/SimilarCars";
import EmailConfirmation from "@/components/ui/email-confirmation";
import { sendBookingConfirmationEmail } from "@/services/emailService";
import BookingCalendar from "@/components/BookingCalendar";
import YouTubeVideoDialog from "@/components/YouTubeVideoDialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import DeliveryDialog from "@/components/DeliveryDialog";
import SafetyInfoCard from "@/components/SafetyInfoCard";

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user, addBooking } = useAuth();
  const { t, isRTL } = useLanguage();

  const car = getCarById(Number(id));

  const [bookingOpen, setBookingOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 3))
  );
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [bookingMethod, setBookingMethod] = useState<"calendar" | "slider">("calendar");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    carName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    bookingId: string;
  } | null>(null);

  // State for test drive video dialog
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);

  // State for invoice dialog
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // State for delivery dialog
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  // Get car ratings
  const ratingStats = getCarRatingStats(Number(id));
  const ratings = getCarRatings(Number(id));

  // Get similar cars
  const similarCars = getSimilarCars(Number(id));

  // State for bookings
  const [totalBookings, setTotalBookings] = useState(getTotalBookingsCountByCarId(Number(id)));
  const [totalRevenue, setTotalRevenue] = useState(getTotalRevenueByCarId(Number(id)));
  const [activeBookings, setActiveBookings] = useState(getActiveBookingsByCarId(Number(id)));
  const [upcomingBookings, setUpcomingBookings] = useState(getUpcomingBookingsByCarId(Number(id)));
  const [newBookingId, setNewBookingId] = useState<string | null>(null);

  // We don't need the showBookings state anymore since we removed the admin bookings section
  // const [showBookings, setShowBookings] = useState(false);

  // Check for booking success from location state (when redirected back from dashboard)
  useEffect(() => {
    const state = location.state as { bookingSuccess?: boolean } | undefined;
    if (state?.bookingSuccess) {
      toast({
        title: t("cardetails.booking.success"),
        description: t("cardetails.booking.success.desc"),
        variant: "default",
      });

      // Clear the state to prevent showing the toast again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, toast, t]);

  // We don't need to check for admin or car owner anymore since we show the upcoming bookings to everyone
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     // Show bookings section if user is admin
  //     if (user.role === "admin") {
  //       setShowBookings(true);
  //       return;
  //     }
  //
  //     // Show bookings section if user owns this car (for future implementation)
  //     // For now, we'll just check if the user has any bookings for this car
  //     const userBookings = getBookingsByCarId(Number(id)).filter(
  //       booking => booking.userId === user.id
  //     );
  //
  //     if (userBookings.length > 0) {
  //       setShowBookings(true);
  //     }
  //   }
  // }, [id, isAuthenticated, user]);

  // Clear the new booking highlight after a few seconds
  useEffect(() => {
    if (newBookingId) {
      const timer = setTimeout(() => {
        setNewBookingId(null);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [newBookingId]);

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{t("cardetails.notfound")}</h2>
            <p className="text-muted-foreground mb-4">{t("cardetails.notfound.desc")}</p>
            <Button onClick={() => navigate("/cars")}>{t("cardetails.back")}</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalDays = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPrice = totalDays * car.dailyPrice;

  /**
   * Validates booking dates
   *
   * @returns True if dates are valid, false otherwise
   */
  const validateBookingDates = (): boolean => {
    if (bookingMethod === "calendar") {
      // Check if dates are selected
      if (!startDate || !endDate) {
        toast({
          title: t("cardetails.toast.date"),
          description: t("cardetails.toast.date.desc"),
          variant: "destructive",
        });
        return false;
      }

      // Check that start date is before end date
      if (startDate >= endDate) {
        toast({
          title: t("cardetails.toast.date.order"),
          description: t("cardetails.toast.date.order.desc"),
          variant: "destructive",
        });
        return false;
      }
    } else {
      // For slider method, we need to ensure rental days is valid
      if (rentalDays <= 0) {
        toast({
          title: t("cardetails.toast.days"),
          description: t("cardetails.toast.days.desc"),
          variant: "destructive",
        });
        return false;
      }
    }

    // Check that start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      toast({
        title: t("cardetails.toast.date.past"),
        description: t("cardetails.toast.date.past.desc"),
        variant: "destructive",
      });
      return false;
    }

    // Check that booking is not too far in the future (e.g., max 6 months)
    const maxFutureDate = new Date();
    maxFutureDate.setMonth(maxFutureDate.getMonth() + 6);
    if (startDate > maxFutureDate) {
      toast({
        title: t("cardetails.toast.date.future"),
        description: t("cardetails.toast.date.future.desc"),
        variant: "destructive",
      });
      return false;
    }

    // Check that booking duration is not too long (e.g., max 30 days)
    const maxDuration = 30; // days
    if (totalDays > maxDuration) {
      toast({
        title: t("cardetails.toast.date.duration"),
        description: t("cardetails.toast.date.duration.desc").replace("{0}", maxDuration.toString()),
        variant: "destructive",
      });
      return false;
    }

    // Check if the car is available for the selected dates
    let bookingStartDate = startDate;
    let bookingEndDate = endDate;

    // If using slider method, calculate dates based on rental days
    if (bookingMethod === "slider") {
      bookingStartDate = new Date();
      bookingEndDate = new Date();
      bookingEndDate.setDate(bookingEndDate.getDate() + rentalDays);
    }

    // Check for overlapping bookings
    const activeBookings = getActiveBookingsByCarId(Number(id));
    const hasOverlap = activeBookings.some(booking => {
      const existingStartDate = new Date(booking.startDate);
      const existingEndDate = new Date(booking.endDate);

      // Check for overlap
      return (
        (bookingStartDate >= existingStartDate && bookingStartDate <= existingEndDate) || // New start date falls within existing booking
        (bookingEndDate >= existingStartDate && bookingEndDate <= existingEndDate) || // New end date falls within existing booking
        (bookingStartDate <= existingStartDate && bookingEndDate >= existingEndDate) // New booking completely covers existing booking
      );
    });

    if (hasOverlap) {
      toast({
        title: t("cardetails.toast.date.unavailable"),
        description: t("cardetails.toast.date.unavailable.desc"),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    try {
      // Check if user is logged in
      if (!isAuthenticated) {
        toast({
          title: t("cardetails.toast.login"),
          description: t("cardetails.toast.login.desc"),
          variant: "destructive",
        });
        navigate("/login", { state: { from: `/cars/${id}` } });
        return;
      }

      // Validate booking dates
      if (!validateBookingDates()) {
        return;
      }

      // Start booking process
      setIsBookingInProgress(true);

      // Generate a unique booking ID
      const bookingId = `booking-${Math.random().toString(36).substring(2, 11)}`;

      // Create booking object
      let bookingStartDate = startDate;
      let bookingEndDate = endDate;

      // If using slider method, calculate dates based on rental days
      if (bookingMethod === "slider") {
        bookingStartDate = new Date();
        bookingEndDate = new Date();
        bookingEndDate.setDate(bookingEndDate.getDate() + rentalDays);
      }

      const booking = {
        id: bookingId,
        carId: car.id,
        userId: user!.id,
        startDate: bookingStartDate.toISOString(),
        endDate: bookingEndDate.toISOString(),
        totalPrice: bookingMethod === "slider" ? rentalDays * car.dailyPrice : totalPrice,
        status: "active" as const,
        createdAt: new Date().toISOString(),
        deliveryStatus: "processing" as const,
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add booking
      addBooking(booking);

      // Save booking success data for notification
      setBookingSuccess({
        carName: car.name,
        startDate: format(bookingMethod === "slider" ? new Date() : startDate, "yyyy/MM/dd"),
        endDate: format(bookingMethod === "slider" ? bookingEndDate : endDate, "yyyy/MM/dd"),
        totalPrice: bookingMethod === "slider" ? rentalDays * car.dailyPrice : totalPrice,
        bookingId: bookingId
      });

      // Check if user has email confirmation preference
      const emailPreference = localStorage.getItem("emailConfirmationPreference");

      if (emailPreference === "true") {
        // Automatically send email without showing confirmation
        sendBookingConfirmationEmail({
          userEmail: user!.email,
          userName: user!.name,
          carName: car.name,
          startDate: format(bookingMethod === "slider" ? new Date() : startDate, "yyyy/MM/dd"),
          endDate: format(bookingMethod === "slider" ? bookingEndDate : endDate, "yyyy/MM/dd"),
          totalPrice: bookingMethod === "slider" ? rentalDays * car.dailyPrice : totalPrice,
          bookingId: bookingId,
          currency: "SAR"
        }).then(result => {
          if (!result.success) {
            console.error("Failed to send email:", result.message);
          }
          // Show delivery dialog after email is sent
          setIsDeliveryOpen(true);
        });
      } else if (emailPreference === "false") {
        // Skip email and show delivery dialog
        setIsDeliveryOpen(true);
      } else {
        // Show email confirmation dialog
        setShowEmailConfirmation(true);
      }

      // Close booking dialog
      setBookingOpen(false);

      // Navigate to booking confirmation page with animation
      navigate("/booking-confirmation", {
        state: {
          booking: booking,
          carId: car.id
        }
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: t("cardetails.toast.fail"),
        description: t("cardetails.toast.fail.desc"),
        variant: "destructive",
      });
    } finally {
      setIsBookingInProgress(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Car Detail Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {car.category}
              </Badge>
              <div className="flex items-center">
                <ReadOnlyRating value={ratingStats.averageRating || car.rating} size="sm" showValue />
                <span className="text-sm font-medium ml-1">
                  ({ratingStats.totalRatings || car.reviews} {t("cardetails.rating")})
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-xl font-bold text-accent mb-1">
              {car.dailyPrice} {t("cardetails.price.day")} <span className="text-sm font-normal text-muted-foreground">/ {t("cardetails.price.day")}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <TooltipWrapper content="tooltip.book_now">
                <Button
                  className="bg-primary text-secondary hover:bg-primary/90 w-full h-12 sm:h-10 text-base"
                  onClick={() => setBookingOpen(true)}
                >
                  {t("cardetails.book")}
                </Button>
              </TooltipWrapper>
              {car.testDriveVideo && (
                <TooltipWrapper content={t("cardetails.test_drive.tooltip") || "Virtual Test Drive"}>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10 h-12 sm:h-10 text-base"
                    onClick={() => setIsTestDriveOpen(true)}
                  >
                    <PlayCircle className="h-5 w-5 sm:h-4 sm:w-4" />
                    {t("cardetails.test_drive.button")}
                  </Button>
                </TooltipWrapper>
              )}
            </div>
          </div>
        </div>

        {/* Car Images */}
        <div className="mb-10">
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden mb-4">
            <OptimizedImage
              src={car.images[activeImageIndex]}
              alt={car.name}
              aspectRatio="aspect-auto"
              containerClassName="h-full rounded-lg"
              loadingStrategy="eager"
              showSkeleton={true}
              fallbackSrc="/images/car-2.jpg"
            />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 px-1 touch-pan-x">
            {car.images.map((image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-28 h-24 sm:w-24 sm:h-20 rounded-md overflow-hidden cursor-pointer border-2 shadow-sm ${
                  index === activeImageIndex ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <OptimizedImage
                  src={image}
                  alt={`${car.name} ${index + 1}`}
                  aspectRatio="aspect-auto"
                  containerClassName="h-full"
                  loadingStrategy="lazy"
                  showSkeleton={true}
                  fallbackSrc="/images/car-2.jpg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("cardetails.specs")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.brand")}</span>
                    <span className="font-medium">{car.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.model")}</span>
                    <span className="font-medium">{car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.year")}</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.seats")}</span>
                    <span className="font-medium">{car.seats}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.fuel")}</span>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.transmission")}</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.category")}</span>
                    <span className="font-medium">{car.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cardetails.specs.rating")}</span>
                    <div className="flex items-center">
                      <ReadOnlyRating value={ratingStats.averageRating || car.rating} size="sm" />
                      <span className="font-medium ml-1">
                        {ratingStats.averageRating || car.rating} ({ratingStats.totalRatings || car.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">{t("cardetails.features")}</h2>
              <div className="grid grid-cols-2 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Insurance Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <SafetyInfoCard car={car} />
            </div>

            {/* Booking Calendar Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <BookingCalendar
                bookings={getBookingsByCarId(Number(id))}
                car={car}
              />
            </div>

            {/* Upcoming Bookings Section - Visible to all users */}
            <div id="car-upcoming-bookings" className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("cardetails.bookings.upcoming")}</h2>
                {upcomingBookings.length > 0 && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {upcomingBookings.length} {t("cardetails.bookings.count")}
                  </Badge>
                )}
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);
                    const isNewBooking = booking.id === newBookingId;

                    // Calculate number of days
                    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                    // Calculate if booking is current (today falls between start and end dates)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isCurrent = today >= startDate && today <= endDate;

                    return (
                      <div
                        key={booking.id}
                        className={`border rounded-md p-4 transition-all duration-500 ${
                          isNewBooking
                            ? "border-primary bg-primary/5 shadow-md animate-pulse"
                            : isCurrent
                              ? "border-accent bg-accent/5"
                              : ""
                        }`}
                      >
                        {/* Status Badge */}
                        <div className="flex justify-end mb-2">
                          {isCurrent ? (
                            <Badge className="bg-accent text-white">
                              {t("cardetails.bookings.current")}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              {t("cardetails.bookings.scheduled")}
                            </Badge>
                          )}
                        </div>

                        {/* Booking Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center">
                            <div className="p-2 bg-primary/10 rounded-full mr-3">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">{t("dashboard.booking.pickup")}</p>
                              <p className="font-medium">{format(startDate, "yyyy/MM/dd")}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 bg-primary/10 rounded-full mr-3">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">{t("dashboard.booking.return")}</p>
                              <p className="font-medium">{format(endDate, "yyyy/MM/dd")}</p>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm">
                              {days} {days === 1 ? t("cardetails.booking.day") : t("cardetails.booking.days")}
                            </span>
                          </div>
                          <div className="font-bold text-accent">
                            {booking.totalPrice} {t("cardetails.price.day")}
                          </div>
                        </div>

                        {/* New Booking Indicator */}
                        {isNewBooking && (
                          <div className="mt-3 pt-3 border-t flex items-center justify-between">
                            <Badge className="bg-primary text-white">
                              {t("cardetails.bookings.new")}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {t("cardetails.bookings.just_added")}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground border rounded-md">
                  <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>{t("cardetails.bookings.none")}</p>
                </div>
              )}
            </div>



            {/* Ratings Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("cardetails.ratings.title")}</h2>
                <div className="flex items-center">
                  <ReadOnlyRating value={ratingStats.averageRating} size="md" />
                  <span className="ml-2 font-medium">
                    {ratingStats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({ratingStats.totalRatings} {t("cardetails.ratings.count")})
                  </span>
                </div>
              </div>

              {/* Rating Distribution */}
              {ratingStats.totalRatings > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">{t("cardetails.ratings.distribution")}</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingStats.distribution[star as keyof typeof ratingStats.distribution];
                      const percentage = ratingStats.totalRatings > 0
                        ? Math.round((count / ratingStats.totalRatings) * 100)
                        : 0;

                      return (
                        <div key={star} className="flex items-center">
                          <div className="flex items-center w-16">
                            <span className="text-sm font-medium mr-1">{star}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-right text-sm text-muted-foreground">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* User Reviews */}
              <div>
                <h3 className="text-lg font-medium mb-3">{t("cardetails.ratings.reviews")}</h3>

                {ratings.length > 0 ? (
                  <div className="space-y-4">
                    {ratings.slice(0, 3).map((rating) => (
                      <div key={rating.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <ReadOnlyRating value={rating.rating} size="sm" />
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-sm">{rating.comment}</p>
                        )}
                      </div>
                    ))}

                    {ratings.length > 3 && (
                      <Button variant="outline" className="w-full mt-2">
                        {t("cardetails.ratings.viewMore")}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>{t("cardetails.ratings.none")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Cars Section */}
            {similarCars.length > 0 && (
              <SimilarCars
                cars={similarCars}
                title={t("cardetails.similar.title")}
                description={t("cardetails.similar.desc")}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-4">{t("cardetails.price.summary")}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("cardetails.price.daily")}</span>
                  <span className="font-medium">{car.dailyPrice} {t("cardetails.price.day")}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-semibold">{t("cardetails.price.total")}</span>
                  <span className="text-lg font-bold text-accent">{car.dailyPrice} {t("cardetails.price.day")}</span>
                </div>
              </div>

              <TooltipWrapper content="tooltip.book_now">
                <Button
                  className="bg-primary text-secondary hover:bg-primary/90 w-full h-14 sm:h-12 text-base"
                  onClick={() => setBookingOpen(true)}
                >
                  {t("cardetails.booking.now")}
                </Button>
              </TooltipWrapper>

              {car.testDriveVideo && (
                <TooltipWrapper content={t("cardetails.test_drive.tooltip") || "Virtual Test Drive"}>
                  <Button
                    variant="outline"
                    className="w-full mt-3 flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10 h-14 sm:h-12 text-base"
                    onClick={() => setIsTestDriveOpen(true)}
                  >
                    <PlayCircle className="h-5 w-5 sm:h-4 sm:w-4" />
                    {t("cardetails.test_drive.button")}
                  </Button>
                </TooltipWrapper>
              )}

              <div className="mt-4 text-sm text-center text-muted-foreground">
                {t("cardetails.price.nofee")}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md w-[95%] sm:w-auto" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-xl">{t("cardetails.booking.title")}</DialogTitle>
            <DialogDescription>
              {t("cardetails.booking.desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs
              defaultValue="calendar"
              className="w-full"
              onValueChange={(value) => setBookingMethod(value as "calendar" | "slider")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon2 className="h-4 w-4" />
                  {t("cardetails.booking.method.calendar")}
                </TabsTrigger>
                <TabsTrigger value="slider" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t("cardetails.booking.method.days")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{t("cardetails.booking.pickup")} / {t("cardetails.booking.return")}</h4>
                  <Calendar
                    mode="range"
                    defaultMonth={startDate}
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from);
                      setEndDate(range?.to);
                    }}
                    numberOfMonths={1}
                    disabled={{ before: new Date() }}
                    className="border rounded-md p-3 pointer-events-auto"
                  />
                </div>

                {startDate && endDate && (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.pickup")}</span>
                      <span>{format(startDate, "yyyy/MM/dd")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.return")}</span>
                      <span>{format(endDate, "yyyy/MM/dd")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.days")}</span>
                      <span>{totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.price")}</span>
                      <span>{car.dailyPrice} {t("cardetails.price.day")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>{t("cardetails.booking.total")}</span>
                      <span className="text-accent">{totalPrice} {t("cardetails.price.day")}</span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="slider" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">{t("cardetails.booking.select_days")}</h4>
                    <div className="px-2">
                      <Slider
                        defaultValue={[rentalDays]}
                        max={30}
                        min={1}
                        step={1}
                        onValueChange={(value) => setRentalDays(value[0])}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">1 {t("cardetails.booking.day")}</span>
                      <span className="text-lg font-bold">{rentalDays} {rentalDays === 1 ? t("cardetails.booking.day") : t("cardetails.booking.days")}</span>
                      <span className="text-sm text-muted-foreground">30 {t("cardetails.booking.days")}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.pickup")}</span>
                      <span>{format(new Date(), "yyyy/MM/dd")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.return")}</span>
                      <span>{format(new Date(new Date().setDate(new Date().getDate() + rentalDays)), "yyyy/MM/dd")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.days")}</span>
                      <span>{rentalDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cardetails.booking.price")}</span>
                      <span>{car.dailyPrice} {t("cardetails.price.day")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>{t("cardetails.booking.total")}</span>
                      <span className="text-accent">{rentalDays * car.dailyPrice} {t("cardetails.price.day")}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setBookingOpen(false)}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
            >
              {t("cardetails.booking.cancel")}
            </Button>
            <Button
              onClick={handleBooking}
              className="bg-primary text-secondary hover:bg-primary/90 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
              disabled={!startDate || !endDate || isBookingInProgress}
            >
              {isBookingInProgress ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                  {t("cardetails.booking.confirming")}
                </>
              ) : (
                t("cardetails.booking.confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />

      {/* Test Drive Video Dialog */}
      {car.testDriveVideo && (
        <YouTubeVideoDialog
          videoUrl={car.testDriveVideo}
          carName={car.name}
          isOpen={isTestDriveOpen}
          onClose={() => setIsTestDriveOpen(false)}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && bookingSuccess && (
        <SuccessNotification
          title={t("cardetails.booking.success")}
          message={t("cardetails.booking.success.desc")}
          open={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          actionText={t("cardetails.booking.view")}
          onAction={() => navigate("/dashboard")}
          invoiceText={t("invoice.print")}
          onInvoice={() => setIsInvoiceOpen(true)}
        />
      )}

      {/* Invoice Dialog */}
      {isInvoiceOpen && bookingSuccess && user && car && (
        <InvoiceDialog
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          bookingId={bookingSuccess.bookingId}
          bookingDate={new Date().toISOString()}
          startDate={new Date(bookingSuccess.startDate).toISOString()}
          endDate={new Date(bookingSuccess.endDate).toISOString()}
          totalPrice={bookingSuccess.totalPrice}
          car={car}
          user={user}
        />
      )}

      {/* Delivery Dialog */}
      {isDeliveryOpen && bookingSuccess && car && (
        <DeliveryDialog
          isOpen={isDeliveryOpen}
          onClose={() => {
            setIsDeliveryOpen(false);
            setShowSuccessNotification(true);
          }}
          car={car}
          bookingId={bookingSuccess.bookingId}
        />
      )}

      {/* Email Confirmation Dialog */}
      {showEmailConfirmation && bookingSuccess && user && (
        <Dialog open={showEmailConfirmation} onOpenChange={setShowEmailConfirmation}>
          <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
            <EmailConfirmation
              userEmail={user.email}
              onSendEmail={async () => {
                return await sendBookingConfirmationEmail({
                  userEmail: user.email,
                  userName: user.name,
                  carName: bookingSuccess.carName,
                  startDate: bookingSuccess.startDate,
                  endDate: bookingSuccess.endDate,
                  totalPrice: bookingSuccess.totalPrice,
                  bookingId: bookingSuccess.bookingId,
                  currency: "SAR"
                });
              }}
              onSkip={() => {
                setShowEmailConfirmation(false);
                setIsDeliveryOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CarDetailsPage;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCarById } from "@/services/carService";
import { SuccessNotification } from "@/components/ui/success-notification";
import { ReadOnlyRating } from "@/components/ui/rating";
import { hasUserRatedBooking, getUserRatingForBooking } from "@/services/ratingService";
import RatingDialog from "@/components/RatingDialog";
import AddCarForm from "@/components/AddCarForm";
import InvoiceDialog from "@/components/InvoiceDialog";
import { Car } from "@/types/car";
import { Star, CalendarIcon, CarFront, Plus, Bell, FileText } from "lucide-react";
import { testBookingExpirationNotification } from "@/utils/testBookingExpiration";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, bookings, cancelBooking } = useAuth();
  const { t, isRTL } = useLanguage();
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null);

  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // Invoice dialog state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Car management state
  const [activeTab, setActiveTab] = useState("bookings");
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [carAddedSuccess, setCarAddedSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: t("dashboard.toast.login"),
        description: t("dashboard.toast.login.desc"),
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast, t]);

  // Check for booking success from location state
  useEffect(() => {
    const state = location.state as {
      bookingSuccess?: boolean;
      fromCarId?: number;
    } | undefined;

    if (state?.bookingSuccess) {
      setShowBookingSuccess(true);

      // Find the most recent booking for this car to highlight it
      if (state.fromCarId && bookings.length > 0) {
        const recentBooking = [...bookings]
          .filter(b => b.carId === state.fromCarId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        if (recentBooking) {
          setHighlightedBookingId(recentBooking.id);

          // Scroll to the booking after a short delay
          setTimeout(() => {
            const element = document.getElementById(`booking-${recentBooking.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
      }

      // Clear the state to prevent showing the notification again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, bookings]);

  // Handle booking cancellation
  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    toast({
      title: t("dashboard.toast.cancel.title"),
      description: t("dashboard.toast.cancel.desc"),
      variant: "default",
    });
  };

  // Handle opening the rating dialog
  const handleOpenRatingDialog = (booking: any) => {
    const car = getCarById(booking.carId);
    if (car) {
      setSelectedBooking(booking);
      setSelectedCar(car);
      setRatingDialogOpen(true);
    }
  };

  // Check if a booking has been rated
  const isBookingRated = (bookingId: string) => {
    if (!user) return false;
    return hasUserRatedBooking(user.id, bookingId);
  };

  // Get user rating for a booking
  const getBookingRating = (bookingId: string) => {
    if (!user) return null;
    return getUserRatingForBooking(user.id, bookingId);
  };

  // Handle adding a new car
  const handleAddCar = (car: Car) => {
    // In a real app, this would send the car to the backend
    // For now, we'll just add it to our local state
    setUserCars(prev => [...prev, car]);
    setShowAddCarForm(false);
    setCarAddedSuccess(true);

    // Hide success message after a few seconds
    setTimeout(() => {
      setCarAddedSuccess(false);
    }, 5000);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.active")}</CardTitle>
              <CardDescription>{t("dashboard.active.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-primary">
              {bookings.filter((b) => b.status === "active").length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.completed")}</CardTitle>
              <CardDescription>{t("dashboard.completed.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-accent">
              {bookings.filter((b) => b.status === "completed").length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.cars")}</CardTitle>
              <CardDescription>{t("dashboard.cars.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-primary">
              {userCars.length}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => testBookingExpirationNotification(t)}
              >
                <Bell className="h-4 w-4" />
                Test Expiration Notification
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Success notification for car added */}
        {carAddedSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <CarFront className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">{t("dashboard.addCar.success.title")}</h4>
              <p className="text-sm">{t("dashboard.addCar.success.description")}</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="bookings" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {t("dashboard.tabs.bookings")}
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-1">
              <CarFront className="h-4 w-4" />
              {t("dashboard.tabs.cars")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("dashboard.bookings")}</h2>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const car = getCarById(booking.carId);
                  if (!car) return null;

                  const startDate = new Date(booking.startDate);
                  const endDate = new Date(booking.endDate);

              return (
                <Card
                  key={booking.id}
                  id={`booking-${booking.id}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    highlightedBookingId === booking.id
                      ? 'ring-2 ring-primary shadow-lg transform scale-[1.01]'
                      : ''
                  }`}
                >
                  <div className="md:flex">
                    <div className="h-48 md:h-auto md:w-48 flex-shrink-0 relative overflow-hidden">
                      <OptimizedImage
                        src={car.images[0]}
                        alt={car.name}
                        aspectRatio="aspect-auto"
                        containerClassName="h-full"
                        loadingStrategy="lazy"
                        showSkeleton={true}
                        fallbackSrc="/images/car-8.jpg"
                      />
                      <div className="absolute top-0 left-0 bg-primary text-secondary px-2 py-1 m-2 rounded text-sm font-medium z-10">
                        {car.category}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{car.name}</CardTitle>
                          <div className="text-lg font-bold text-accent">
                            {booking.totalPrice} {t("cardetails.price.day")}
                          </div>
                        </div>
                        <CardDescription>{t("dashboard.booking.number", { 0: booking.id.substring(0, 8) })}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">{t("dashboard.booking.pickup")} </span>
                              <span className="font-medium">{format(startDate, "yyyy/MM/dd")}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("dashboard.booking.return")} </span>
                              <span className="font-medium">{format(endDate, "yyyy/MM/dd")}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">{t("dashboard.booking.status")} </span>
                              <span className={`font-medium ${
                                booking.status === "active" ? "text-accent" :
                                booking.status === "cancelled" ? "text-destructive" : ""
                              }`}>
                                {t(`dashboard.booking.status.${booking.status}`)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("dashboard.booking.date")} </span>
                              <span className="font-medium">{format(new Date(booking.createdAt), "yyyy/MM/dd")}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col space-y-3">
                        <div className="flex flex-wrap gap-2 w-full">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/cars/${car.id}`)}
                            size="sm"
                          >
                            {t("dashboard.booking.view")}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setSelectedCar(car);
                              setIsInvoiceOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            {t("invoice.print")}
                          </Button>

                          {booking.status === "active" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              {t("dashboard.booking.cancel")}
                            </Button>
                          )}

                          {booking.status === "completed" && (
                            <Button
                              variant={isBookingRated(booking.id) ? "outline" : "default"}
                              size="sm"
                              className={isBookingRated(booking.id) ? "border-yellow-400 text-yellow-500" : "bg-yellow-500 hover:bg-yellow-600 text-white"}
                              onClick={() => handleOpenRatingDialog(booking)}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              {isBookingRated(booking.id)
                                ? t("dashboard.booking.editRating")
                                : t("dashboard.booking.rate")}
                            </Button>
                          )}
                        </div>

                        {isBookingRated(booking.id) && (
                          <div className="flex items-center justify-between w-full pt-2 border-t">
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">
                                {t("dashboard.booking.yourRating")}:
                              </span>
                              <ReadOnlyRating
                                value={getBookingRating(booking.id)?.rating || 0}
                                size="sm"
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(getBookingRating(booking.id)?.createdAt || "").toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{t("dashboard.nobookings")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("dashboard.nobookings.desc")}
            </p>
            <Button className="bg-primary text-secondary hover:bg-primary/90" onClick={() => navigate("/cars")}>
              {t("dashboard.explore")}
            </Button>
          </div>
        )}
          </TabsContent>

          <TabsContent value="cars">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("dashboard.tabs.cars")}</h2>
              {!showAddCarForm && (
                <Button
                  onClick={() => setShowAddCarForm(true)}
                  className="bg-primary text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.addCar.button")}
                </Button>
              )}
            </div>

            {showAddCarForm ? (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <AddCarForm
                    onCarAdded={handleAddCar}
                    onCancel={() => setShowAddCarForm(false)}
                  />
                </CardContent>
              </Card>
            ) : null}

            {userCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map(car => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="h-48 relative">
                      <OptimizedImage
                        src={car.images[0]}
                        alt={car.name}
                        aspectRatio="aspect-video"
                        containerClassName="h-full"
                        loadingStrategy="lazy"
                        showSkeleton={true}
                        fallbackSrc="/images/car-8.jpg"
                      />
                      <div className="absolute top-0 left-0 bg-primary text-secondary px-2 py-1 m-2 rounded text-sm font-medium">
                        {car.category}
                      </div>
                      {car.availability ? (
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded text-sm font-medium">
                          {t("admin.cars.available")}
                        </div>
                      ) : (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded text-sm font-medium">
                          {t("admin.cars.unavailable")}
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{car.name}</CardTitle>
                      <CardDescription>{car.brand} {car.model} • {car.year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-primary">
                          {car.dailyPrice} {t("cardetails.price.day")}
                        </div>
                        <div className="flex items-center">
                          <ReadOnlyRating value={car.rating} size="sm" />
                          <span className="text-sm text-muted-foreground ml-1">
                            ({car.reviews})
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/cars/${car.id}`)}
                      >
                        {t("dashboard.car.view")}
                      </Button>
                      <Button
                        variant={car.availability ? "destructive" : "default"}
                        onClick={() => {
                          // Toggle availability
                          setUserCars(prev =>
                            prev.map(c =>
                              c.id === car.id
                                ? { ...c, availability: !c.availability }
                                : c
                            )
                          );

                          toast({
                            title: t("dashboard.car.availability.title"),
                            description: car.availability
                              ? t("dashboard.car.availability.disabled")
                              : t("dashboard.car.availability.enabled"),
                          });
                        }}
                      >
                        {car.availability
                          ? t("admin.cars.disable")
                          : t("admin.cars.enable")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CarFront className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">{t("dashboard.nocars")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("dashboard.nocars.desc")}
                </p>
                <Button
                  className="bg-primary text-secondary hover:bg-primary/90"
                  onClick={() => setShowAddCarForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.addCar.button")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>

      {/* Invoice Dialog */}
      {isInvoiceOpen && selectedBooking && selectedCar && user && (
        <InvoiceDialog
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          bookingId={selectedBooking.id}
          bookingDate={selectedBooking.createdAt}
          startDate={selectedBooking.startDate}
          endDate={selectedBooking.endDate}
          totalPrice={selectedBooking.totalPrice}
          car={selectedCar}
          user={user}
        />
      )}

      {/* Success Notification */}
      <SuccessNotification
        title={t("dashboard.booking.success")}
        message={t("dashboard.booking.success.desc")}
        open={showBookingSuccess}
        onClose={() => setShowBookingSuccess(false)}
        duration={6000}
      />

      {/* Rating Dialog */}
      {selectedCar && selectedBooking && (
        <RatingDialog
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
          car={selectedCar}
          bookingId={selectedBooking.id}
          onRatingSubmitted={() => {
            // Force re-render to update the UI
            setRatingDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

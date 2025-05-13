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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCarById } from "@/services/carService";
import { SuccessNotification } from "@/components/ui/success-notification";
import { ReadOnlyRating } from "@/components/ui/rating";
import { hasUserRatedBooking, getUserRatingForBooking } from "@/services/ratingService";
import { getFavoriteCars, removeFromFavorites } from "@/services/favoriteService";
import RatingDialog from "@/components/RatingDialog";
import AddCarForm from "@/components/AddCarForm";
import BookingTabs from "@/components/BookingTabs";
import ProfileInfo from "@/components/ProfileInfo";
import { Car } from "@/types/car";
import { canAddCars } from "@/data/permissions";
import {
  Star,
  CalendarIcon,
  CarFront,
  Plus,
  User,
  Heart,
  Clock,
  Settings,
  LogOut,
  Trash2,
  Loader2,
  ShieldAlert
} from "lucide-react";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin, hasPermission, bookings, cancelBooking, logout } = useAuth();
  const { t, isRTL } = useLanguage();

  // UI state
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // User data
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);

  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // Car management state
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

  // Load user data
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load favorite cars
      const favorites = getFavoriteCars(user.id);
      setFavoriteCars(favorites);

      // Separate active and past bookings
      const now = new Date();
      const active = bookings.filter(booking =>
        booking.status === "active" && new Date(booking.endDate) >= now
      );
      const past = bookings.filter(booking =>
        booking.status === "completed" || new Date(booking.endDate) < now
      );

      setActiveBookings(active);
      setPastBookings(past);
    }
  }, [isAuthenticated, user, bookings]);

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
          setActiveTab("bookings");

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
    // Check if user has permission to add cars
    if (!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")) {
      toast({
        title: t("auth.access.denied"),
        description: t("auth.access.special_permission_required"),
        variant: "destructive",
      });
      return;
    }

    // Add metadata to the car
    const carWithMetadata: Car = {
      ...car,
      addedBy: user?.id || "unknown",
      addedByName: user?.name || "Unknown User",
      addedAt: new Date().toISOString()
    };

    setUserCars(prev => [...prev, carWithMetadata]);
    setShowAddCarForm(false);
    setCarAddedSuccess(true);

    // Hide success message after a few seconds
    setTimeout(() => {
      setCarAddedSuccess(false);
    }, 5000);
  };

  // Handle removing a car from favorites
  const handleRemoveFromFavorites = (carId: number) => {
    if (user) {
      removeFromFavorites(user.id, carId);
      setFavoriteCars(prev => prev.filter(car => car.id !== carId));

      toast({
        title: t("favorites.removed.title"),
        description: t("favorites.removed.desc"),
        variant: "default",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Header */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-secondary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <span className="font-bold text-lg">{bookings.length}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t("profile.bookings")}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <span className="font-bold text-lg">{favoriteCars.length}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t("profile.favorites")}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <CarFront className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <span className="font-bold text-lg">{userCars.length}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t("dashboard.cars")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("profile.logout")}
              </Button>
            </div>
          </div>
        </div>

        {/* Success notification for car added */}
        {carAddedSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-400 flex items-center">
            <div className="bg-green-100 dark:bg-green-800/50 p-2 rounded-full mr-3">
              <CarFront className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium">{t("dashboard.addCar.success.title")}</h4>
              <p className="text-sm">{t("dashboard.addCar.success.description")}</p>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {t("dashboard.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {t("dashboard.tabs.bookings")}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {t("dashboard.tabs.favorites")}
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-1">
              <CarFront className="h-4 w-4" />
              {t("dashboard.tabs.cars")}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              {t("dashboard.tabs.profile")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Bookings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.active")}</CardTitle>
                  <CardDescription>{t("dashboard.active.desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeBookings.length > 0 ? (
                    <div className="space-y-4">
                      {activeBookings.slice(0, 2).map(booking => {
                        const car = getCarById(booking.carId);
                        if (!car) return null;

                        return (
                          <div key={booking.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <OptimizedImage
                                src={car.images[0]}
                                alt={car.name}
                                aspectRatio="aspect-square"
                                containerClassName="h-full"
                                loadingStrategy="lazy"
                                showSkeleton={true}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{car.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.startDate), "yyyy/MM/dd")} - {format(new Date(booking.endDate), "yyyy/MM/dd")}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 flex-shrink-0">
                              {t("dashboard.booking.status.active")}
                            </Badge>
                          </div>
                        );
                      })}

                      {activeBookings.length > 2 && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => setActiveTab("bookings")}
                        >
                          {t("dashboard.view_more", { count: activeBookings.length - 2 })}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">{t("dashboard.no_active_bookings")}</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => navigate("/cars")}
                      >
                        {t("dashboard.explore")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Favorites Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.favorites")}</CardTitle>
                  <CardDescription>{t("profile.favorites_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteCars.length > 0 ? (
                    <div className="space-y-4">
                      {favoriteCars.slice(0, 2).map(car => (
                        <div key={car.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={car.images[0]}
                              alt={car.name}
                              aspectRatio="aspect-square"
                              containerClassName="h-full"
                              loadingStrategy="lazy"
                              showSkeleton={true}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{car.name}</h4>
                            <div className="flex items-center">
                              <ReadOnlyRating value={car.rating} size="sm" />
                              <span className="text-xs text-muted-foreground ml-1">({car.reviews})</span>
                            </div>
                          </div>
                          <div className="text-accent font-bold flex-shrink-0">
                            {car.dailyPrice} {t("carcard.price.day")}
                          </div>
                        </div>
                      ))}

                      {favoriteCars.length > 2 && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => setActiveTab("favorites")}
                        >
                          {t("dashboard.view_more", { count: favoriteCars.length - 2 })}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">{t("profile.no_favorites_desc")}</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => navigate("/cars")}
                      >
                        {t("profile.browse_cars")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("dashboard.recent_activity")}</CardTitle>
                  <CardDescription>{t("dashboard.recent_activity_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map(booking => {
                          const car = getCarById(booking.carId);
                          if (!car) return null;

                          return (
                            <div key={booking.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <OptimizedImage
                                  src={car.images[0]}
                                  alt={car.name}
                                  aspectRatio="aspect-square"
                                  containerClassName="h-full"
                                  loadingStrategy="lazy"
                                  showSkeleton={true}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{car.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {booking.status === "active"
                                    ? t("dashboard.activity.booked")
                                    : booking.status === "completed"
                                    ? t("dashboard.activity.completed")
                                    : t("dashboard.activity.cancelled")}
                                </p>
                              </div>
                              <div className="text-sm text-muted-foreground flex-shrink-0">
                                {format(new Date(booking.createdAt), "yyyy/MM/dd")}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">{t("dashboard.no_activity")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("dashboard.bookings")}</h2>
            </div>

            <BookingTabs highlightedBookingId={highlightedBookingId} />

          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("profile.my_favorites")}</h2>
            </div>

            {favoriteCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteCars.map(car => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="h-40 relative">
                      <OptimizedImage
                        src={car.images[0]}
                        alt={car.name}
                        aspectRatio="aspect-auto"
                        containerClassName="h-full"
                        loadingStrategy="lazy"
                        showSkeleton={true}
                      />
                      <Badge className="absolute top-2 left-2 bg-primary text-secondary">
                        {car.category}
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white border-none text-red-500"
                        onClick={() => handleRemoveFromFavorites(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{car.name}</h3>
                        <div className="flex items-center">
                          <ReadOnlyRating value={car.rating} size="sm" />
                          <span className="text-sm text-muted-foreground ml-1">({car.reviews})</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-accent font-bold text-lg">{car.dailyPrice}</span>
                          <span className="text-muted-foreground text-sm"> {t("carcard.price.day")}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="text-card-foreground border-primary hover:bg-primary hover:text-secondary"
                          onClick={() => navigate(`/cars/${car.id}`)}
                        >
                          {t("carcard.details")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-card text-card-foreground">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("profile.no_favorites")}</h3>
                <p className="text-muted-foreground mb-6">{t("profile.no_favorites_desc")}</p>
                <Button onClick={() => navigate("/cars")}>
                  {t("profile.browse_cars")}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Cars Tab */}
          <TabsContent value="cars">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{t("dashboard.tabs.cars")}</h2>
                {!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars") && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <ShieldAlert className="inline-block h-4 w-4 mr-1 text-destructive" />
                    {t("dashboard.cars.special_permission_required")}
                  </p>
                )}
                {canAddCars(user?.id, isAdmin) && !isAdmin && !hasPermission("manage_cars") && (
                  <p className="text-sm text-primary mt-1">
                    <ShieldAlert className="inline-block h-4 w-4 mr-1 text-primary" />
                    {t("dashboard.cars.special_user_allowed")}
                  </p>
                )}
              </div>
              {!showAddCarForm && (
                <TooltipWrapper content={canAddCars(user?.id, isAdmin) || hasPermission("manage_cars") ? "tooltip.add_car" : "tooltip.special_permission_required"}>
                  <Button
                    onClick={() => {
                      if (canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")) {
                        setShowAddCarForm(true);
                      } else {
                        toast({
                          title: t("auth.access.denied"),
                          description: t("auth.access.special_permission_required"),
                          variant: "destructive",
                        });
                      }
                    }}
                    className={canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground cursor-not-allowed"}
                    disabled={!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("dashboard.addCar.button")}
                    {!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars") && (
                      <ShieldAlert className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TooltipWrapper>
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
              <div className="text-center py-12 bg-card text-card-foreground rounded-lg shadow">
                <CarFront className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">{t("dashboard.nocars")}</h3>
                <p className="text-muted-foreground mb-2">
                  {t("dashboard.nocars.desc")}
                </p>
                {!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars") && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md border border-destructive/20 mb-4">
                    <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.cars.special_permission_required_message")}
                    </p>
                  </div>
                )}
                {canAddCars(user?.id, isAdmin) && !isAdmin && !hasPermission("manage_cars") && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-md border border-primary/20 mb-4">
                    <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.cars.special_user_allowed_message")}
                    </p>
                  </div>
                )}
                <Button
                  className={canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")
                    ? "bg-primary text-secondary hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"}
                  onClick={() => {
                    if (canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")) {
                      setShowAddCarForm(true);
                    } else {
                      toast({
                        title: t("auth.access.denied"),
                        description: t("auth.access.special_permission_required"),
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.addCar.button")}
                  {!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars") && (
                    <ShieldAlert className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileInfo />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>

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
          onOpenChange={setRatingDialogOpen}
          car={selectedCar}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default UserDashboard;

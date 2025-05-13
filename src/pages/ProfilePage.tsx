import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReadOnlyRating } from "@/components/ui/rating";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getFavoriteCars } from "@/services/favoriteService";
import { getUserBookings } from "@/services/bookingService";
import { Car } from "@/types/car";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { User, Calendar, Car as CarIcon, Heart, Clock, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Load user data
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load favorite cars
      const favorites = getFavoriteCars(user.id);
      setFavoriteCars(favorites);
      
      // Load bookings
      const userBookings = getUserBookings(user.id);
      setBookings(userBookings);
      
      // Separate active and past bookings
      const now = new Date();
      const active = userBookings.filter(booking => new Date(booking.endDate) >= now);
      const past = userBookings.filter(booking => new Date(booking.endDate) < now);
      
      setActiveBookings(active);
      setPastBookings(past);
    }
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary text-secondary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl text-center">{user.name}</CardTitle>
                  <CardDescription className="text-center">{user.email}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mb-1" />
                      <span className="text-2xl font-bold">{bookings.length}</span>
                      <span className="text-sm text-muted-foreground">{t("profile.bookings")}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Heart className="h-5 w-5 text-red-500 mb-1" />
                      <span className="text-2xl font-bold">{favoriteCars.length}</span>
                      <span className="text-sm text-muted-foreground">{t("profile.favorites")}</span>
                    </div>
                  </div>
                  
                  {/* Account Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                      <Clock className="mr-2 h-4 w-4" />
                      {t("profile.view_bookings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("profile.settings")}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:bg-destructive/10"
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
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {t("profile.favorites")}
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("profile.bookings")}
                </TabsTrigger>
              </TabsList>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <h2 className="text-2xl font-bold mb-4">{t("profile.my_favorites")}</h2>
                
                {favoriteCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="text-center py-12 border rounded-lg">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t("profile.no_favorites")}</h3>
                    <p className="text-muted-foreground mb-6">{t("profile.no_favorites_desc")}</p>
                    <Button onClick={() => navigate("/cars")}>
                      {t("profile.browse_cars")}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <h2 className="text-2xl font-bold mb-4">{t("profile.my_bookings")}</h2>
                
                {bookings.length > 0 ? (
                  <div className="space-y-6">
                    {/* Active Bookings */}
                    {activeBookings.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">{t("profile.active_bookings")}</h3>
                        <div className="space-y-4">
                          {activeBookings.map(booking => (
                            <Card key={booking.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 h-40 md:h-auto">
                                  <OptimizedImage
                                    src={booking.car.images[0]}
                                    alt={booking.car.name}
                                    aspectRatio="aspect-auto"
                                    containerClassName="h-full"
                                    loadingStrategy="lazy"
                                    showSkeleton={true}
                                  />
                                </div>
                                <CardContent className="p-4 w-full md:w-2/3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold">{booking.car.name}</h3>
                                    <Badge className="bg-green-100 text-green-700">
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 my-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">{t("dashboard.booking.pickup")}</p>
                                      <p className="font-medium">{format(new Date(booking.startDate), "yyyy/MM/dd")}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">{t("dashboard.booking.return")}</p>
                                      <p className="font-medium">{format(new Date(booking.endDate), "yyyy/MM/dd")}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-4">
                                    <div>
                                      <span className="text-accent font-bold text-lg">{booking.totalPrice}</span>
                                      <span className="text-muted-foreground text-sm"> {t("carcard.price.total")}</span>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      className="text-card-foreground border-primary hover:bg-primary hover:text-secondary"
                                      onClick={() => navigate(`/cars/${booking.car.id}`)}
                                    >
                                      {t("carcard.details")}
                                    </Button>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Past Bookings */}
                    {pastBookings.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">{t("profile.past_bookings")}</h3>
                        <div className="space-y-4">
                          {pastBookings.map(booking => (
                            <Card key={booking.id} className="overflow-hidden opacity-75">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 h-40 md:h-auto">
                                  <OptimizedImage
                                    src={booking.car.images[0]}
                                    alt={booking.car.name}
                                    aspectRatio="aspect-auto"
                                    containerClassName="h-full"
                                    loadingStrategy="lazy"
                                    showSkeleton={true}
                                  />
                                </div>
                                <CardContent className="p-4 w-full md:w-2/3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold">{booking.car.name}</h3>
                                    <Badge variant="outline">
                                      {t("profile.completed")}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 my-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">{t("dashboard.booking.pickup")}</p>
                                      <p className="font-medium">{format(new Date(booking.startDate), "yyyy/MM/dd")}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">{t("dashboard.booking.return")}</p>
                                      <p className="font-medium">{format(new Date(booking.endDate), "yyyy/MM/dd")}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-4">
                                    <div>
                                      <span className="text-accent font-bold text-lg">{booking.totalPrice}</span>
                                      <span className="text-muted-foreground text-sm"> {t("carcard.price.total")}</span>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      className="text-card-foreground border-primary hover:bg-primary hover:text-secondary"
                                      onClick={() => navigate(`/cars/${booking.car.id}`)}
                                    >
                                      {t("carcard.details")}
                                    </Button>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <CarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t("profile.no_bookings")}</h3>
                    <p className="text-muted-foreground mb-6">{t("profile.no_bookings_desc")}</p>
                    <Button onClick={() => navigate("/cars")}>
                      {t("profile.book_now")}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/types/auth";
import { Car } from "@/types/car";
import { getCarById } from "@/services/carService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarBookingAnimation from "@/components/animations/CarBookingAnimation";
import BookingInvoice from "@/components/BookingInvoice";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Calendar, Clock, MapPin, Car as CarIcon, CreditCard, FileText } from "lucide-react";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const { addBooking } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);
  const [activeTab, setActiveTab] = useState("animation");

  // Get booking data from location state
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state?.booking && location.state?.carId) {
          const bookingData = location.state.booking as Booking;
          setBooking(bookingData);

          // Fetch car details
          const carData = await getCarById(location.state.carId);
          if (carData) {
            setCar(carData);
          }
        } else {
          // No booking data, redirect to home
          navigate("/");
          toast({
            title: t("booking.error"),
            description: t("booking.no_data"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: t("booking.error"),
          description: t("booking.fetch_error"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, navigate, t]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setActiveTab("details");

    // Add booking to user's bookings
    if (booking) {
      addBooking(booking);

      toast({
        title: t("booking.success.title"),
        description: t("booking.success.description"),
      });
    }
  };

  // Handle view bookings button click
  const handleViewBookings = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">{t("booking.loading")}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car || !booking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t("booking.error")}</CardTitle>
              <CardDescription>{t("booking.no_data")}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/")} className="w-full">
                {t("booking.go_home")}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("booking.confirmation_title")}
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="animation" disabled={!showAnimation} className="h-12 sm:h-10 text-sm">
              <CarIcon className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t("booking.animation.title")}</span>
              <span className="sm:hidden">تأكيد</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="h-12 sm:h-10 text-sm">
              <Calendar className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t("booking.details")}</span>
              <span className="sm:hidden">تفاصيل</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="h-12 sm:h-10 text-sm">
              <FileText className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t("booking.invoice")}</span>
              <span className="sm:hidden">فاتورة</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="animation" className="mt-0">
            {showAnimation && (
              <CarBookingAnimation
                car={car}
                booking={booking}
                onComplete={handleAnimationComplete}
                className="mb-8"
              />
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("booking.details")}</CardTitle>
                <CardDescription>
                  {t("booking.details_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <CarIcon className="h-6 w-6 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-base sm:text-sm">{t("booking.car_details")}</h3>
                        <p className="text-base sm:text-sm">{car.brand} {car.name} ({car.year})</p>
                        <p className="text-sm text-muted-foreground">{car.type}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Calendar className="h-6 w-6 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-base sm:text-sm">{t("booking.dates")}</h3>
                        <p className="text-base sm:text-sm">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Clock className="h-6 w-6 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-base sm:text-sm">{t("booking.duration")}</h3>
                        <p className="text-base sm:text-sm">
                          {Math.ceil(
                            (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          {t("booking.days")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <MapPin className="h-6 w-6 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-base sm:text-sm">{t("booking.pickup_location")}</h3>
                        <p className="text-base sm:text-sm">{t("booking.main_office")}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("booking.office_address")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <CreditCard className="h-6 w-6 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-base sm:text-sm">{t("booking.payment")}</h3>
                        <p className="text-base sm:text-sm">{t("booking.payment_method")}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("booking.total")}: {car.price} {t("invoice.currency")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleViewBookings}
                  className="w-full sm:w-auto bg-primary text-secondary hover:bg-primary/90 h-12 sm:h-10 text-base sm:text-sm"
                >
                  {t("booking.view_bookings")}
                </Button>
                <Button
                  onClick={() => setActiveTab("invoice")}
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
                >
                  {t("booking.view_invoice")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="mt-0">
            <BookingInvoice car={car} booking={booking} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;

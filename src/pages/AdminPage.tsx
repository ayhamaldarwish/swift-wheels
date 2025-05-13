import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockCars } from "@/data/mockData";
import { Car } from "@/types/car";
import { Booking } from "@/types/auth";
import { Trash2, Plus, Edit, Car as CarIcon, AlertTriangle, ShieldAlert } from "lucide-react";
import DashboardStats from "@/components/admin/DashboardStats";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import { canAddCars } from "@/data/permissions";

/**
 * AdminPage component
 *
 * Admin dashboard for managing cars, bookings, and users
 * Only accessible to users with admin role
 */
const AdminPage = () => {
  const { user, bookings, isAdmin, hasPermission } = useAuth();
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // New car form state
  const [newCar, setNewCar] = useState<Partial<Car>>({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "Economy",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    dailyPrice: 200,
    availability: true,
    features: [],
    images: ["/cars/default-car.jpg"],
    rating: 0,
    reviews: 0
  });

  // Filter cars based on search term
  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter bookings to show all bookings (admin can see all)
  const allBookings = bookings;

  // Handle car selection for editing
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
  };

  // Handle car availability toggle
  const handleToggleAvailability = (carId: number) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === carId
          ? { ...car, availability: !car.availability }
          : car
      )
    );

    toast({
      title: t("admin.cars.toast.availability.title"),
      description: t("admin.cars.toast.availability.description"),
    });
  };

  // Handle car deletion
  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteDialogOpen(true);
  };

  // Confirm car deletion
  const confirmDeleteCar = () => {
    if (!carToDelete) return;

    setCars(prevCars => prevCars.filter(car => car.id !== carToDelete.id));
    setIsDeleteDialogOpen(false);
    setCarToDelete(null);

    // If the deleted car was selected, clear selection
    if (selectedCar && selectedCar.id === carToDelete.id) {
      setSelectedCar(null);
    }

    toast({
      title: t("admin.cars.toast.delete.title"),
      description: t("admin.cars.toast.delete.description"),
    });
  };

  // Handle adding a new car
  const handleAddCar = () => {
    // Check if user has permission to add cars
    if (!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")) {
      toast({
        title: t("auth.access.denied"),
        description: t("auth.access.special_permission_required"),
        variant: "destructive",
      });
      return;
    }

    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...cars.map(car => car.id)) + 1;

    // Create the new car object with metadata
    const carToAdd: Car = {
      id: newId,
      ...newCar as Omit<Car, 'id'>,
      features: newCar.features || [],
      images: newCar.images || ["/cars/default-car.jpg"],
      addedBy: user?.id || "unknown",
      addedByName: user?.name || "Unknown User",
      addedAt: new Date().toISOString()
    };

    // Add the new car to the list
    setCars(prevCars => [...prevCars, carToAdd]);

    // Reset the form and close the dialog
    setNewCar({
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      category: "Economy",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      dailyPrice: 200,
      availability: true,
      features: [],
      images: ["/cars/default-car.jpg"],
      rating: 0,
      reviews: 0
    });
    setIsAddCarDialogOpen(false);

    toast({
      title: t("admin.cars.toast.add.title"),
      description: t("admin.cars.toast.add.description"),
    });
  };

  // Handle new car form changes
  const handleNewCarChange = (field: string, value: any) => {
    setNewCar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("admin.welcome")}, {user?.name} ({user?.role})
          </p>
        </div>

        {/* Dashboard Statistics */}
        <DashboardStats cars={cars} bookings={allBookings} />

        <Tabs defaultValue="cars" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="cars">{t("admin.tabs.cars")}</TabsTrigger>
            <TabsTrigger value="bookings">{t("admin.tabs.bookings")}</TabsTrigger>
            <TabsTrigger value="users">{t("admin.tabs.users")}</TabsTrigger>
          </TabsList>

          {/* Cars Management Tab */}
          <TabsContent value="cars">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Car List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{t("admin.cars.title")}</CardTitle>
                      <CardDescription>{t("admin.cars.description")}</CardDescription>
                    </div>
                    <TooltipWrapper content={canAddCars(user?.id, isAdmin) || hasPermission("manage_cars") ? "tooltip.add_car" : "tooltip.special_permission_required"}>
                      <Button
                        onClick={() => {
                          if (canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")) {
                            setIsAddCarDialogOpen(true);
                          } else {
                            toast({
                              title: t("auth.access.denied"),
                              description: t("auth.access.special_permission_required"),
                              variant: "destructive",
                            });
                          }
                        }}
                        className={canAddCars(user?.id, isAdmin) || hasPermission("manage_cars")
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-muted text-muted-foreground cursor-not-allowed"}
                        disabled={!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin.cars.add")}
                        {!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars") && (
                          <ShieldAlert className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TooltipWrapper>
                  </div>
                  <div className="mt-4">
                    <Input
                      placeholder={t("admin.cars.search")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCars.length > 0 ? (
                      filteredCars.map(car => (
                        <div
                          key={car.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex-1 cursor-pointer" onClick={() => handleSelectCar(car)}>
                            <h3 className="font-medium">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {car.brand} • {car.model} • {car.year}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${car.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {car.availability ? t("admin.cars.available") : t("admin.cars.unavailable")}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {car.dailyPrice} {t("cardetails.price.currency")} / {t("cardetails.price.day")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TooltipWrapper content="tooltip.toggle_availability">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAvailability(car.id)}
                              >
                                {car.availability ? t("admin.cars.disable") : t("admin.cars.enable")}
                              </Button>
                            </TooltipWrapper>
                            <TooltipWrapper content="tooltip.edit_car">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSelectCar(car)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipWrapper>
                            <TooltipWrapper content="tooltip.delete_car">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCar(car)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipWrapper>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchTerm
                          ? t("admin.cars.no_results")
                          : t("admin.cars.no_cars")}
                      </div>
                    )}
                  </div>
                </CardContent>
                {filteredCars.length > 5 && (
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="outline" size="sm">
                      {t("admin.cars.load_more")}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCar ? t("admin.cars.edit") : t("admin.cars.select")}
                  </CardTitle>
                  {selectedCar && (
                    <CardDescription>
                      {t("admin.cars.edit.description")}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedCar ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="car-name">{t("admin.cars.form.name")}</Label>
                        <Input
                          id="car-name"
                          value={selectedCar.name}
                          onChange={(e) => setSelectedCar({...selectedCar, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="car-brand">{t("admin.cars.form.brand")}</Label>
                          <Input
                            id="car-brand"
                            value={selectedCar.brand}
                            onChange={(e) => setSelectedCar({...selectedCar, brand: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="car-model">{t("admin.cars.form.model")}</Label>
                          <Input
                            id="car-model"
                            value={selectedCar.model}
                            onChange={(e) => setSelectedCar({...selectedCar, model: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="car-year">{t("admin.cars.form.year")}</Label>
                          <Input
                            id="car-year"
                            type="number"
                            value={selectedCar.year}
                            onChange={(e) => setSelectedCar({...selectedCar, year: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="car-seats">{t("admin.cars.form.seats")}</Label>
                          <Input
                            id="car-seats"
                            type="number"
                            value={selectedCar.seats}
                            onChange={(e) => setSelectedCar({...selectedCar, seats: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="car-price">{t("admin.cars.form.price")}</Label>
                          <Input
                            id="car-price"
                            type="number"
                            value={selectedCar.dailyPrice}
                            onChange={(e) => setSelectedCar({...selectedCar, dailyPrice: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="car-category">{t("admin.cars.form.category")}</Label>
                          <Select
                            value={selectedCar.category}
                            onValueChange={(value) => setSelectedCar({...selectedCar, category: value})}
                          >
                            <SelectTrigger id="car-category">
                              <SelectValue placeholder={t("admin.cars.form.select_category")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Economy">{t("home.categories.economy")}</SelectItem>
                              <SelectItem value="Sedan">{t("home.categories.sedan")}</SelectItem>
                              <SelectItem value="SUV">{t("home.categories.suv")}</SelectItem>
                              <SelectItem value="Luxury">{t("home.categories.luxury")}</SelectItem>
                              <SelectItem value="Sports">{t("cars.filter.category.sports")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="car-transmission">{t("admin.cars.form.transmission")}</Label>
                          <Select
                            value={selectedCar.transmission}
                            onValueChange={(value) => setSelectedCar({...selectedCar, transmission: value})}
                          >
                            <SelectTrigger id="car-transmission">
                              <SelectValue placeholder={t("admin.cars.form.select_transmission")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Automatic">{t("cars.filter.transmission.automatic")}</SelectItem>
                              <SelectItem value="Manual">{t("cars.filter.transmission.manual")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="car-fuel">{t("admin.cars.form.fuel")}</Label>
                          <Select
                            value={selectedCar.fuelType}
                            onValueChange={(value) => setSelectedCar({...selectedCar, fuelType: value})}
                          >
                            <SelectTrigger id="car-fuel">
                              <SelectValue placeholder={t("admin.cars.form.select_fuel")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Petrol">{t("cars.filter.fuelType.petrol")}</SelectItem>
                              <SelectItem value="Diesel">{t("cars.filter.fuelType.diesel")}</SelectItem>
                              <SelectItem value="Electric">{t("cars.filter.fuelType.electric")}</SelectItem>
                              <SelectItem value="Hybrid">{t("cars.filter.fuelType.hybrid")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="car-availability" className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id="car-availability"
                            checked={selectedCar.availability}
                            onChange={(e) => setSelectedCar({...selectedCar, availability: e.target.checked})}
                            className="h-4 w-4"
                          />
                          {t("admin.cars.form.availability")}
                        </Label>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedCar(null)}
                        >
                          {t("admin.cars.form.cancel")}
                        </Button>
                        <Button
                          className="flex-1 bg-primary text-primary-foreground"
                          onClick={() => {
                            // Update the car in the list
                            setCars(prevCars =>
                              prevCars.map(car =>
                                car.id === selectedCar.id ? selectedCar : car
                              )
                            );

                            // Show success message
                            toast({
                              title: t("admin.cars.toast.update.title"),
                              description: t("admin.cars.toast.update.description"),
                            });
                          }}
                        >
                          {t("admin.cars.form.save")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      {t("admin.cars.no_selection")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Management Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.bookings.title")}</CardTitle>
                <CardDescription>{t("admin.bookings.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                {allBookings.length > 0 ? (
                  <div className="space-y-4">
                    {allBookings.map((booking: Booking) => {
                      const car = cars.find(c => c.id === booking.carId);
                      return (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{car?.name || t("admin.bookings.unknown_car")}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t("admin.bookings.booking_id")}: {booking.id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("admin.bookings.user_id")}: {booking.userId}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === "active"
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === "completed"
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                              <p className="text-sm font-medium mt-1">
                                {booking.totalPrice} {t("cardetails.price.currency")}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>
                              {t("admin.bookings.dates")}: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm" disabled>
                              {t("admin.bookings.manage")}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("admin.bookings.no_bookings")}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.users.title")}</CardTitle>
                <CardDescription>{t("admin.users.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  {t("admin.demo_mode")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </main>

      <Footer />

      {/* Add Car Dialog */}
      <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t("admin.cars.add.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.cars.add.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="new-car-name">{t("admin.cars.form.name")}</Label>
                <Input
                  id="new-car-name"
                  value={newCar.name}
                  onChange={(e) => handleNewCarChange("name", e.target.value)}
                  placeholder={t("admin.cars.form.name.placeholder")}
                />
              </div>
              <div>
                <Label htmlFor="new-car-brand">{t("admin.cars.form.brand")}</Label>
                <Input
                  id="new-car-brand"
                  value={newCar.brand}
                  onChange={(e) => handleNewCarChange("brand", e.target.value)}
                  placeholder={t("admin.cars.form.brand.placeholder")}
                />
              </div>
              <div>
                <Label htmlFor="new-car-model">{t("admin.cars.form.model")}</Label>
                <Input
                  id="new-car-model"
                  value={newCar.model}
                  onChange={(e) => handleNewCarChange("model", e.target.value)}
                  placeholder={t("admin.cars.form.model.placeholder")}
                />
              </div>
              <div>
                <Label htmlFor="new-car-year">{t("admin.cars.form.year")}</Label>
                <Input
                  id="new-car-year"
                  type="number"
                  value={newCar.year}
                  onChange={(e) => handleNewCarChange("year", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="new-car-seats">{t("admin.cars.form.seats")}</Label>
                <Input
                  id="new-car-seats"
                  type="number"
                  value={newCar.seats}
                  onChange={(e) => handleNewCarChange("seats", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="new-car-price">{t("admin.cars.form.price")}</Label>
                <Input
                  id="new-car-price"
                  type="number"
                  value={newCar.dailyPrice}
                  onChange={(e) => handleNewCarChange("dailyPrice", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="new-car-category">{t("admin.cars.form.category")}</Label>
                <Select
                  value={newCar.category}
                  onValueChange={(value) => handleNewCarChange("category", value)}
                >
                  <SelectTrigger id="new-car-category">
                    <SelectValue placeholder={t("admin.cars.form.select_category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">{t("home.categories.economy")}</SelectItem>
                    <SelectItem value="Sedan">{t("home.categories.sedan")}</SelectItem>
                    <SelectItem value="SUV">{t("home.categories.suv")}</SelectItem>
                    <SelectItem value="Luxury">{t("home.categories.luxury")}</SelectItem>
                    <SelectItem value="Sports">{t("cars.filter.category.sports")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-car-transmission">{t("admin.cars.form.transmission")}</Label>
                <Select
                  value={newCar.transmission}
                  onValueChange={(value) => handleNewCarChange("transmission", value)}
                >
                  <SelectTrigger id="new-car-transmission">
                    <SelectValue placeholder={t("admin.cars.form.select_transmission")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">{t("cars.filter.transmission.automatic")}</SelectItem>
                    <SelectItem value="Manual">{t("cars.filter.transmission.manual")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-car-fuel">{t("admin.cars.form.fuel")}</Label>
                <Select
                  value={newCar.fuelType}
                  onValueChange={(value) => handleNewCarChange("fuelType", value)}
                >
                  <SelectTrigger id="new-car-fuel">
                    <SelectValue placeholder={t("admin.cars.form.select_fuel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">{t("cars.filter.fuelType.petrol")}</SelectItem>
                    <SelectItem value="Diesel">{t("cars.filter.fuelType.diesel")}</SelectItem>
                    <SelectItem value="Electric">{t("cars.filter.fuelType.electric")}</SelectItem>
                    <SelectItem value="Hybrid">{t("cars.filter.fuelType.hybrid")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="new-car-availability" className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="new-car-availability"
                    checked={newCar.availability}
                    onChange={(e) => handleNewCarChange("availability", e.target.checked)}
                    className="h-4 w-4"
                  />
                  {t("admin.cars.form.availability")}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCarDialogOpen(false)}>
              {t("admin.cars.form.cancel")}
            </Button>
            <Button
              onClick={handleAddCar}
              disabled={!newCar.name || !newCar.brand || !newCar.model}
            >
              {t("admin.cars.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("admin.cars.delete.title")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.cars.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {carToDelete && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{carToDelete.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {carToDelete.brand} • {carToDelete.model} • {carToDelete.year}
                </p>
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              {t("admin.cars.delete.warning")}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("admin.cars.delete.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCar}>
              {t("admin.cars.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;

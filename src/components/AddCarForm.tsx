import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "@/types/car";
import { mockCars } from "@/data/mockData";
import { canAddCars } from "@/data/permissions";
import { Car as CarIcon, Plus, ShieldAlert } from "lucide-react";

interface AddCarFormProps {
  onCarAdded: (car: Car) => void;
  onCancel: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onCarAdded, onCancel }) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const { user, isAdmin, hasPermission } = useAuth();
  const [hasAddCarPermission, setHasAddCarPermission] = useState(false);

  // Check if user has permission to add cars
  useEffect(() => {
    // Check if user is admin, has manage_cars permission, or is in the allowed list
    const userCanAddCars = canAddCars(user?.id, isAdmin) || hasPermission("manage_cars");
    setHasAddCarPermission(userCanAddCars);

    if (!userCanAddCars) {
      toast({
        title: t("auth.access.denied"),
        description: t("auth.access.permission_required"),
        variant: "destructive",
      });
      onCancel();
    }
  }, [user?.id, isAdmin, hasPermission, toast, t, onCancel]);

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
    features: ["Air Conditioning", "Bluetooth", "Parking Sensors"],
    images: ["/cars/default-car.jpg"],
    rating: 0,
    reviews: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setNewCar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user has permission to add cars
    if (!hasAddCarPermission) {
      toast({
        title: t("auth.access.denied"),
        description: t("auth.access.special_permission_required"),
        variant: "destructive",
      });
      return;
    }

    // Double-check permission (security measure)
    if (!canAddCars(user?.id, isAdmin) && !hasPermission("manage_cars")) {
      toast({
        title: t("auth.access.denied"),
        description: t("auth.access.special_permission_required"),
        variant: "destructive",
      });
      return;
    }

    if (!newCar.name || !newCar.brand || !newCar.model) {
      toast({
        title: t("dashboard.addCar.error.title"),
        description: t("dashboard.addCar.error.required"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate a new ID (in a real app, this would be handled by the backend)
        const newId = Math.max(...mockCars.map(car => car.id)) + 1;

        // Create the new car object with added metadata
        const carToAdd: Car = {
          id: newId,
          ...newCar as Omit<Car, 'id'>,
          features: newCar.features || [],
          images: newCar.images || ["/cars/default-car.jpg"],
          addedBy: user?.id || "unknown",
          addedByName: user?.name || "Unknown User",
          addedAt: new Date().toISOString()
        };

        // Call the callback to add the car
        onCarAdded(carToAdd);

        // Show success message
        toast({
          title: t("dashboard.addCar.success.title"),
          description: t("dashboard.addCar.success.description"),
          variant: "default",
        });

        // Reset form
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
          features: ["Air Conditioning", "Bluetooth", "Parking Sensors"],
          images: ["/cars/default-car.jpg"],
          rating: 0,
          reviews: 0
        });
      } catch (error) {
        toast({
          title: t("dashboard.addCar.error.title"),
          description: t("dashboard.addCar.error.general"),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  // If user doesn't have permission, show a message
  if (!hasAddCarPermission) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="h-6 w-6 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">{t("auth.access.denied")}</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {t("auth.access.admin_required_message")}
        </p>
        <Button variant="outline" onClick={onCancel}>
          {t("admin.cars.form.cancel")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CarIcon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{t("dashboard.addCar.title")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <Label htmlFor="car-name">{t("admin.cars.form.name")}</Label>
          <Input
            id="car-name"
            value={newCar.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t("admin.cars.form.name.placeholder")}
            required
          />
        </div>

        <div>
          <Label htmlFor="car-brand">{t("admin.cars.form.brand")}</Label>
          <Input
            id="car-brand"
            value={newCar.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder={t("admin.cars.form.brand.placeholder")}
            required
          />
        </div>

        <div>
          <Label htmlFor="car-model">{t("admin.cars.form.model")}</Label>
          <Input
            id="car-model"
            value={newCar.model}
            onChange={(e) => handleChange("model", e.target.value)}
            placeholder={t("admin.cars.form.model.placeholder")}
            required
          />
        </div>

        <div>
          <Label htmlFor="car-year">{t("admin.cars.form.year")}</Label>
          <Input
            id="car-year"
            type="number"
            value={newCar.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            min={2000}
            max={new Date().getFullYear() + 1}
          />
        </div>

        <div>
          <Label htmlFor="car-seats">{t("admin.cars.form.seats")}</Label>
          <Input
            id="car-seats"
            type="number"
            value={newCar.seats}
            onChange={(e) => handleChange("seats", parseInt(e.target.value))}
            min={2}
            max={10}
          />
        </div>

        <div>
          <Label htmlFor="car-price">{t("admin.cars.form.price")}</Label>
          <Input
            id="car-price"
            type="number"
            value={newCar.dailyPrice}
            onChange={(e) => handleChange("dailyPrice", parseInt(e.target.value))}
            min={50}
            max={1000}
          />
        </div>

        <div>
          <Label htmlFor="car-category">{t("admin.cars.form.category")}</Label>
          <Select
            value={newCar.category}
            onValueChange={(value) => handleChange("category", value)}
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

        <div>
          <Label htmlFor="car-transmission">{t("admin.cars.form.transmission")}</Label>
          <Select
            value={newCar.transmission}
            onValueChange={(value) => handleChange("transmission", value)}
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
            value={newCar.fuelType}
            onValueChange={(value) => handleChange("fuelType", value)}
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

        <div className="col-span-full">
          <Label htmlFor="car-features">{t("dashboard.addCar.features")}</Label>
          <Textarea
            id="car-features"
            value={newCar.features?.join(", ")}
            onChange={(e) => handleChange("features", e.target.value.split(",").map(f => f.trim()))}
            placeholder={t("dashboard.addCar.features.placeholder")}
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.addCar.features.help")}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("admin.cars.form.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !newCar.name || !newCar.brand || !newCar.model}
          className="bg-primary text-white"
        >
          {isSubmitting ? (
            <>{t("dashboard.addCar.submitting")}</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {t("dashboard.addCar.submit")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCarForm;

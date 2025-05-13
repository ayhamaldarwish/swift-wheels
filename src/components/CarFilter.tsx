
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter, Sliders, Car, Banknote } from "lucide-react";

interface CarFilterProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  search: string;
  category: string;
  transmission: string;
  fuelType: string;
  priceRange: [number, number];
  priceCategory: string; // "under200", "200to400", "above400"
  carType: string; // "economy", "sedan", "suv", "luxury", "sports"
}

const CarFilter = ({ onFilter }: CarFilterProps) => {
  const { t, isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [priceCategory, setPriceCategory] = useState("");
  const [carType, setCarType] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Handle price category selection
  const handlePriceCategory = (value: string) => {
    setPriceCategory(value);

    // Update price range based on category
    switch (value) {
      case "under200":
        setPriceRange([50, 199]);
        break;
      case "200to400":
        setPriceRange([200, 400]);
        break;
      case "above400":
        setPriceRange([401, 500]);
        break;
      default:
        setPriceRange([50, 500]);
        break;
    }
  };

  // Handle car type selection
  const handleCarType = (value: string) => {
    setCarType(value);
    setCategory(value.charAt(0).toUpperCase() + value.slice(1)); // Capitalize first letter
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search,
      category,
      transmission,
      fuelType,
      priceRange,
      priceCategory,
      carType
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setTransmission("all");
    setFuelType("all");
    setPriceRange([50, 500]);
    setPriceCategory("");
    setCarType("");
    setActiveTab("all");
    onFilter({
      search: "",
      category: "",
      transmission: "",
      fuelType: "",
      priceRange: [50, 500],
      priceCategory: "",
      carType: ""
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-6 border">
      <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5" />
        {t("cars.filter.title")}
      </h3>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1 px-4 py-2">
            <Sliders className="h-4 w-4" />
            {t("cars.filter.tabs.all")}
          </TabsTrigger>
          <TabsTrigger value="type" className="flex items-center gap-1 px-4 py-2">
            <Car className="h-4 w-4" />
            {t("cars.filter.tabs.type")}
          </TabsTrigger>
          <TabsTrigger value="price" className="flex items-center gap-1 px-4 py-2">
            <Banknote className="h-4 w-4" />
            {t("cars.filter.tabs.price")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">{t("cars.filter.search")}</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder={t("cars.filter.search.placeholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">{t("cars.filter.category")}</Label>
                <Select value={category || "all"} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("cars.filter.category.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("cars.filter.category.all")}</SelectItem>
                    <SelectItem value="Economy">{t("home.categories.economy")}</SelectItem>
                    <SelectItem value="Sedan">{t("home.categories.sedan")}</SelectItem>
                    <SelectItem value="SUV">{t("home.categories.suv")}</SelectItem>
                    <SelectItem value="Luxury">{t("home.categories.luxury")}</SelectItem>
                    <SelectItem value="Sports">{t("cars.filter.category.sports")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission">{t("cars.filter.transmission")}</Label>
                <Select value={transmission || "all"} onValueChange={setTransmission}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("cars.filter.transmission.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("cars.filter.transmission.all")}</SelectItem>
                    <SelectItem value="Automatic">{t("cars.filter.transmission.automatic")}</SelectItem>
                    <SelectItem value="Manual">{t("cars.filter.transmission.manual")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType">{t("cars.filter.fuelType")}</Label>
                <Select value={fuelType || "all"} onValueChange={setFuelType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("cars.filter.fuelType.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("cars.filter.fuelType.all")}</SelectItem>
                    <SelectItem value="Petrol">{t("cars.filter.fuelType.petrol")}</SelectItem>
                    <SelectItem value="Diesel">{t("cars.filter.fuelType.diesel")}</SelectItem>
                    <SelectItem value="Electric">{t("cars.filter.fuelType.electric")}</SelectItem>
                    <SelectItem value="Hybrid">{t("cars.filter.fuelType.hybrid")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <Label>{t("cars.filter.price")}</Label>
                <span className="text-sm text-muted-foreground">
                  {priceRange[0]} - {priceRange[1]} {t("cardetails.price.day")}
                </span>
              </div>
              <Slider
                defaultValue={[50, 500]}
                min={50}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-primary text-primary hover:bg-primary/10"
              >
                {t("cars.filter.reset")}
              </Button>
              <Button type="submit" className="bg-primary text-secondary hover:bg-primary/90">
                {t("cars.filter.apply")}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="type">
          <div className="space-y-4">
            <h4 className="text-md font-medium">{t("cars.filter.carType.title")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Button
                variant={carType === "economy" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  const newType = carType === "economy" ? "" : "economy";
                  handleCarType(newType);
                  onFilter({
                    search, transmission, fuelType, priceRange, priceCategory,
                    category: newType ? "Economy" : "",
                    carType: newType
                  });
                }}
              >
                <Badge variant={carType === "economy" ? "outline" : "secondary"} className="mr-2">
                  {t("cars.filter.carType.economy.count")}
                </Badge>
                {t("home.categories.economy")}
              </Button>

              <Button
                variant={carType === "sedan" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  const newType = carType === "sedan" ? "" : "sedan";
                  handleCarType(newType);
                  onFilter({
                    search, transmission, fuelType, priceRange, priceCategory,
                    category: newType ? "Sedan" : "",
                    carType: newType
                  });
                }}
              >
                <Badge variant={carType === "sedan" ? "outline" : "secondary"} className="mr-2">
                  {t("cars.filter.carType.sedan.count")}
                </Badge>
                {t("home.categories.sedan")}
              </Button>

              <Button
                variant={carType === "suv" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  const newType = carType === "suv" ? "" : "suv";
                  handleCarType(newType);
                  onFilter({
                    search, transmission, fuelType, priceRange, priceCategory,
                    category: newType ? "SUV" : "",
                    carType: newType
                  });
                }}
              >
                <Badge variant={carType === "suv" ? "outline" : "secondary"} className="mr-2">
                  {t("cars.filter.carType.suv.count")}
                </Badge>
                {t("home.categories.suv")}
              </Button>

              <Button
                variant={carType === "luxury" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  const newType = carType === "luxury" ? "" : "luxury";
                  handleCarType(newType);
                  onFilter({
                    search, transmission, fuelType, priceRange, priceCategory,
                    category: newType ? "Luxury" : "",
                    carType: newType
                  });
                }}
              >
                <Badge variant={carType === "luxury" ? "outline" : "secondary"} className="mr-2">
                  {t("cars.filter.carType.luxury.count")}
                </Badge>
                {t("home.categories.luxury")}
              </Button>

              <Button
                variant={carType === "sports" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  const newType = carType === "sports" ? "" : "sports";
                  handleCarType(newType);
                  onFilter({
                    search, transmission, fuelType, priceRange, priceCategory,
                    category: newType ? "Sports" : "",
                    carType: newType
                  });
                }}
              >
                <Badge variant={carType === "sports" ? "outline" : "secondary"} className="mr-2">
                  {t("cars.filter.carType.sports.count")}
                </Badge>
                {t("cars.filter.category.sports")}
              </Button>
            </div>

            {carType && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCarType("");
                    setCategory("");
                    onFilter({
                      search, transmission, fuelType, priceRange, priceCategory,
                      category: "",
                      carType: ""
                    });
                  }}
                >
                  {t("cars.filter.clear")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="price">
          <div className="space-y-4">
            <h4 className="text-md font-medium">{t("cars.filter.priceCategory.title")}</h4>
            <RadioGroup
              value={priceCategory}
              onValueChange={(value) => {
                handlePriceCategory(value);

                // Get price range based on selected category
                let newPriceRange: [number, number] = [50, 500];
                switch (value) {
                  case "under200":
                    newPriceRange = [50, 199];
                    break;
                  case "200to400":
                    newPriceRange = [200, 400];
                    break;
                  case "above400":
                    newPriceRange = [401, 500];
                    break;
                }

                // Apply filter immediately
                onFilter({
                  search, category, transmission, fuelType, carType,
                  priceRange: newPriceRange,
                  priceCategory: value
                });
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className={`flex items-center space-x-2 border rounded-md p-4 ${priceCategory === "under200" ? "border-primary bg-primary/5" : "border-muted"}`}>
                <RadioGroupItem value="under200" id="under200" />
                <Label htmlFor="under200" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t("cars.filter.priceCategory.under200")}</div>
                  <div className="text-sm text-muted-foreground">50 - 199 {t("cardetails.price.day")}</div>
                </Label>
              </div>

              <div className={`flex items-center space-x-2 border rounded-md p-4 ${priceCategory === "200to400" ? "border-primary bg-primary/5" : "border-muted"}`}>
                <RadioGroupItem value="200to400" id="200to400" />
                <Label htmlFor="200to400" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t("cars.filter.priceCategory.200to400")}</div>
                  <div className="text-sm text-muted-foreground">200 - 400 {t("cardetails.price.day")}</div>
                </Label>
              </div>

              <div className={`flex items-center space-x-2 border rounded-md p-4 ${priceCategory === "above400" ? "border-primary bg-primary/5" : "border-muted"}`}>
                <RadioGroupItem value="above400" id="above400" />
                <Label htmlFor="above400" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t("cars.filter.priceCategory.above400")}</div>
                  <div className="text-sm text-muted-foreground">401 - 500 {t("cardetails.price.day")}</div>
                </Label>
              </div>
            </RadioGroup>

            {/* Custom price range */}
            <div className="mt-6 space-y-2">
              <h4 className="text-md font-medium">{t("cars.filter.priceCustom.title")}</h4>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {priceRange[0]} - {priceRange[1]} {t("cardetails.price.day")}
                </span>
              </div>
              <Slider
                defaultValue={[50, 500]}
                min={50}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={(value) => {
                  const newRange = value as [number, number];
                  setPriceRange(newRange);

                  // Clear price category when using custom range
                  if (priceCategory) {
                    setPriceCategory("");
                  }
                }}
                className="py-4"
              />

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    onFilter({
                      search, category, transmission, fuelType, carType,
                      priceRange,
                      priceCategory: ""
                    });
                  }}
                >
                  {t("cars.filter.apply")}
                </Button>
              </div>
            </div>

            {priceCategory && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceCategory("");
                    setPriceRange([50, 500]);
                    onFilter({
                      search, category, transmission, fuelType, carType,
                      priceRange: [50, 500],
                      priceCategory: ""
                    });
                  }}
                >
                  {t("cars.filter.clear")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarFilter;

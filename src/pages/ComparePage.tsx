import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ReadOnlyRating } from "@/components/ui/rating";
import { useCompare } from "@/contexts/CompareContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ArrowLeft, Car as CarIcon, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ComparePage = () => {
  const { carsToCompare, removeCarFromCompare, clearCompare } = useCompare();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Redirect to cars page if there are no cars to compare
  if (carsToCompare.length === 0) {
    return (
      <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <CarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h1 className="text-2xl font-bold mb-2">{t("compare.no_cars.title")}</h1>
            <p className="text-muted-foreground mb-6">{t("compare.no_cars.desc")}</p>
            <Button
              className="bg-primary text-secondary hover:bg-primary/90"
              onClick={() => navigate("/cars")}
            >
              {t("compare.browse_cars")}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Define comparison attributes
  const comparisonAttributes = [
    { key: "brand", label: t("compare.attributes.brand") },
    { key: "model", label: t("compare.attributes.model") },
    { key: "year", label: t("compare.attributes.year") },
    { key: "category", label: t("compare.attributes.category") },
    { key: "transmission", label: t("compare.attributes.transmission") },
    { key: "fuelType", label: t("compare.attributes.fuel_type") },
    { key: "seats", label: t("compare.attributes.seats") },
    { key: "dailyPrice", label: t("compare.attributes.daily_price"), format: (value: number) => `${value} ${t("cardetails.price.day")}` },
    { key: "rating", label: t("compare.attributes.rating"), format: (value: number) => <ReadOnlyRating value={value} size="sm" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t("compare.title")}</h1>
          </div>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={clearCompare}
          >
            <X className="h-4 w-4 mr-2" />
            {t("compare.clear")}
          </Button>
        </div>

        {/* Car Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {carsToCompare.map((car) => (
            <div key={car.id} className="relative">
              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <OptimizedImage
                  src={car.images[0]}
                  alt={car.name}
                  aspectRatio="aspect-auto"
                  containerClassName="h-full"
                  loadingStrategy="eager"
                  showSkeleton={true}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white rounded-full h-10 w-10 sm:h-8 sm:w-8 shadow-md"
                onClick={() => removeCarFromCompare(car.id)}
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
              <div className="mt-3">
                <h2 className="text-xl font-bold">{car.name}</h2>
                <p className="text-muted-foreground">
                  {car.brand} {car.model} {car.year}
                </p>
              </div>
            </div>
          ))}

          {/* Empty slot if only one car */}
          {carsToCompare.length === 1 && (
            <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 h-64">
              <CarIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                {t("compare.add_second_car")}
              </p>
              <Button
                className="bg-primary text-secondary hover:bg-primary/90 h-12 text-base"
                onClick={() => navigate("/cars")}
              >
                {t("compare.browse_cars")}
              </Button>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-8">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-muted">
                <th className="p-4 text-left font-medium text-muted-foreground">
                  {t("compare.specification")}
                </th>
                {carsToCompare.map((car) => (
                  <th key={car.id} className="p-4 text-left font-medium">
                    {car.name}
                  </th>
                ))}
                {carsToCompare.length === 1 && (
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    {t("compare.second_car")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {comparisonAttributes.map((attr) => (
                <tr key={attr.key} className="border-t">
                  <td className="p-4 text-muted-foreground">{attr.label}</td>
                  {carsToCompare.map((car) => {
                    const value = car[attr.key as keyof typeof car];
                    return (
                      <td key={`${car.id}-${attr.key}`} className="p-4 font-medium">
                        {attr.format ? attr.format(value as any) : value}
                      </td>
                    );
                  })}
                  {carsToCompare.length === 1 && <td className="p-4">-</td>}
                </tr>
              ))}

              {/* Features */}
              <tr className="border-t">
                <td className="p-4 text-muted-foreground">{t("compare.attributes.features")}</td>
                {carsToCompare.map((car) => (
                  <td key={`${car.id}-features`} className="p-4">
                    <ul className="space-y-2">
                      {car.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {carsToCompare.length === 1 && <td className="p-4">-</td>}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/cars")}
            className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
          >
            {t("compare.continue_browsing")}
          </Button>

          {carsToCompare.length === 2 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/cars/${carsToCompare[0].id}`)}
                className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
              >
                {t("compare.view_details", { car: carsToCompare[0].name })}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/cars/${carsToCompare[1].id}`)}
                className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
              >
                {t("compare.view_details", { car: carsToCompare[1].name })}
              </Button>
            </div>
          )}

          {carsToCompare.length === 1 && (
            <Button
              variant="outline"
              onClick={() => navigate(`/cars/${carsToCompare[0].id}`)}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
            >
              {t("compare.view_details", { car: carsToCompare[0].name })}
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComparePage;

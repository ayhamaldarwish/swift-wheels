import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { mockCars } from "@/data/mockData";
import { Car } from "@/types/car";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilter, { FilterOptions } from "@/components/CarFilter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart2 } from "lucide-react";

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { t, isRTL } = useLanguage();

  // Get parameters from URL
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialTransmission = searchParams.get("transmission") || "all";
  const initialFuelType = searchParams.get("fuelType") || "all";
  const initialPriceCategory = searchParams.get("priceCategory") || "";
  const initialCarType = searchParams.get("carType") || "";

  // Get initial price range from URL or default
  const initialPriceMin = searchParams.get("priceMin") ? parseInt(searchParams.get("priceMin") || "50") : 50;
  const initialPriceMax = searchParams.get("priceMax") ? parseInt(searchParams.get("priceMax") || "500") : 500;

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: initialSearch,
    category: initialCategory,
    transmission: initialTransmission,
    fuelType: initialFuelType,
    priceRange: [initialPriceMin, initialPriceMax],
    priceCategory: initialPriceCategory,
    carType: initialCarType
  });

  // Apply filters when component mounts and when URL params change
  useEffect(() => {
    applyFilters(filterOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyFilters = (filters: FilterOptions) => {
    // Simulate loading state
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      let result = [...mockCars];

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          car =>
            car.name.toLowerCase().includes(searchLower) ||
            car.brand.toLowerCase().includes(searchLower) ||
            car.model.toLowerCase().includes(searchLower) ||
            car.category.toLowerCase().includes(searchLower)
        );
      }

      // Filter by category - skip if "all" or empty
      if (filters.category && filters.category !== "all") {
        result = result.filter(car => car.category === filters.category);
      }

      // Filter by car type - skip if "all" or empty
      if (filters.carType && filters.carType !== "all") {
        // Convert carType to proper category format (e.g., "suv" to "SUV")
        const categoryMap: Record<string, string> = {
          "economy": "Economy",
          "sedan": "Sedan",
          "suv": "SUV",
          "luxury": "Luxury",
          "sports": "Sports"
        };

        const categoryValue = categoryMap[filters.carType];
        if (categoryValue) {
          result = result.filter(car => car.category === categoryValue);
        }
      }

      // Filter by transmission - skip if "all" or empty
      if (filters.transmission && filters.transmission !== "all") {
        result = result.filter(car => car.transmission === filters.transmission);
      }

      // Filter by fuel type - skip if "all" or empty
      if (filters.fuelType && filters.fuelType !== "all") {
        result = result.filter(car => car.fuelType === filters.fuelType);
      }

      // Filter by price range
      result = result.filter(
        car =>
          car.dailyPrice >= filters.priceRange[0] &&
          car.dailyPrice <= filters.priceRange[1]
      );

      // Filter by price category
      if (filters.priceCategory) {
        switch (filters.priceCategory) {
          case "under200":
            result = result.filter(car => car.dailyPrice < 200);
            break;
          case "200to400":
            result = result.filter(car => car.dailyPrice >= 200 && car.dailyPrice <= 400);
            break;
          case "above400":
            result = result.filter(car => car.dailyPrice > 400);
            break;
        }
      }

      // Update filtered cars
      setFilteredCars(result);
      setIsLoading(false);

      // Update URL params
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category && filters.category !== "all") params.set("category", filters.category);
      if (filters.transmission && filters.transmission !== "all") params.set("transmission", filters.transmission);
      if (filters.fuelType && filters.fuelType !== "all") params.set("fuelType", filters.fuelType);
      if (filters.priceCategory) params.set("priceCategory", filters.priceCategory);
      if (filters.carType) params.set("carType", filters.carType);

      // Add price range to URL
      params.set("priceMin", filters.priceRange[0].toString());
      params.set("priceMax", filters.priceRange[1].toString());

      setSearchParams(params);
    }, 300); // Short delay for better UX
  };

  const handleFilter = (filters: FilterOptions) => {
    setFilterOptions(filters);
    applyFilters(filters);
  };

  // Reset all filters
  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      search: "",
      category: "",
      transmission: "",
      fuelType: "",
      priceRange: [50, 500],
      priceCategory: "",
      carType: ""
    };

    setFilterOptions(defaultFilters);
    applyFilters(defaultFilters);
  };



  return (
    <div
      className="flex flex-col min-h-screen bg-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8 text-foreground"
        >
          {t("cars.title")}
        </h1>

        <div>
          <CarFilter onFilter={handleFilter} />
        </div>

        <div>
          {isLoading ? (
            <div
              key="loader"
              className="flex justify-center items-center py-20"
            >
              <Loader size="lg" text={t("cars.loading")} />
            </div>
          ) : filteredCars.length > 0 ? (
            <div
              key="results"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <p
                    className="text-muted-foreground text-sm sm:text-base"
                  >
                    {t("cars.found", { 0: filteredCars.length })}
                  </p>

                  {/* View Mode Toggle */}
                  <div
                    className="flex items-center border rounded-md overflow-hidden shadow-sm"
                  >
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className={`h-10 w-10 sm:h-8 sm:w-8 rounded-none ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}
                      onClick={() => setViewMode("grid")}
                      aria-label={t("cars.view.grid")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                      </svg>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className={`h-10 w-10 sm:h-8 sm:w-8 rounded-none ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}
                      onClick={() => setViewMode("list")}
                      aria-label={t("cars.view.list")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </Button>
                  </div>
                </div>

                {(filterOptions.category || filterOptions.carType || filterOptions.priceCategory ||
                  filterOptions.transmission || filterOptions.fuelType || filterOptions.search) && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-sm h-10 sm:h-9 px-3 sm:px-2"
                    >
                      {t("cars.filter.reset.all")}
                    </Button>
                  </div>
                )}
              </div>
              {viewMode === "grid" ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  key="grid-view"
                >
                  {filteredCars.map((car) => (
                    <div key={car.id}>
                      <CarCard car={car} />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col space-y-4"
                  key="list-view"
                >
                  {filteredCars.map((car) => (
                    <div
                      key={car.id}
                      className="bg-card rounded-lg shadow-md overflow-hidden border transition-all hover:shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 lg:w-1/4 h-56 sm:h-48 md:h-auto relative">
                          <OptimizedImage
                            src={car.images[0]}
                            alt={car.name}
                            aspectRatio="aspect-auto"
                            containerClassName="h-full"
                            loadingStrategy="lazy"
                            showSkeleton={true}
                          />
                          <div className="absolute top-0 left-0 bg-primary text-secondary px-2 py-1 m-2 rounded text-sm font-medium z-10">
                            {car.category}
                          </div>
                        </div>

                        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-card-foreground">{car.name}</h3>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-medium text-card-foreground">{car.rating} ({car.reviews})</span>
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-4">{car.brand} {car.model} • {car.year}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8"></path>
                                </svg>
                                <span className="text-sm">{t("carcard.transmission")}: {car.transmission}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                <span className="text-sm">{t("carcard.fuel")}: {car.fuelType}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <span className="text-sm">{car.seats} {t("cardetails.specs.seats")}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                <span className="text-sm">{car.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <span className="text-accent font-bold text-2xl">{car.dailyPrice}</span>
                              <span className="text-muted-foreground text-sm"> {t("carcard.price.day")}</span>
                            </div>
                            <div className="flex space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-full w-10 h-10 sm:w-8 sm:h-8 p-0 shadow-sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <BarChart2 className="h-5 w-5 sm:h-4 sm:w-4 text-primary" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("compare.add_tooltip")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <Link to={`/cars/${car.id}`}>
                                <Button
                                  variant="outline"
                                  className="text-card-foreground border-primary hover:bg-primary hover:text-secondary h-10 sm:h-9 text-base sm:text-sm"
                                >
                                  {t("carcard.details")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              key="no-results"
              className="text-center py-16"
            >
              <h3
                className="text-xl font-semibold mb-2 text-foreground"
              >
                {t("cars.noresults")}
              </h3>
              <p
                className="text-muted-foreground mb-6"
              >
                {t("cars.noresults.desc")}
              </p>
              <div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  {t("cars.filter.reset.all")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CarsPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadOnlyRating } from "@/components/ui/rating";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getFavoriteCars, removeFromFavorites } from "@/services/favoriteService";
import { Car } from "@/types/car";
import { Heart, Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FavoritesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/favorites" } });
    }
  }, [isAuthenticated, navigate]);
  
  // Load favorite cars
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(true);
      const favorites = getFavoriteCars(user.id);
      setFavoriteCars(favorites);
      setFilteredCars(favorites);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  // Filter and sort cars when search query or sort option changes
  useEffect(() => {
    if (favoriteCars.length > 0) {
      let filtered = [...favoriteCars];
      
      // Apply search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(car => 
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === "price") {
          return a.dailyPrice - b.dailyPrice;
        } else if (sortBy === "rating") {
          return b.rating - a.rating;
        } else {
          // Sort by name
          return a.name.localeCompare(b.name);
        }
      });
      
      setFilteredCars(filtered);
    }
  }, [favoriteCars, searchQuery, sortBy]);
  
  const handleRemoveFromFavorites = (carId: number) => {
    if (user) {
      const removed = removeFromFavorites(user.id, carId);
      if (removed) {
        // Update state
        const updatedFavorites = favoriteCars.filter(car => car.id !== carId);
        setFavoriteCars(updatedFavorites);
        
        // Show toast
        toast({
          title: t("favorites.removed.title"),
          description: t("favorites.removed.desc"),
          variant: "default",
        });
      }
    }
  };
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("favorites.title")}</h1>
            <p className="text-muted-foreground">{t("favorites.subtitle")}</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("favorites.back")}
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("favorites.search")}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs 
              defaultValue="name" 
              className="w-full md:w-auto"
              onValueChange={(value) => setSortBy(value as "name" | "price" | "rating")}
            >
              <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
                <TabsTrigger value="name">{t("favorites.sort.name")}</TabsTrigger>
                <TabsTrigger value="price">{t("favorites.sort.price")}</TabsTrigger>
                <TabsTrigger value="rating">{t("favorites.sort.rating")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Favorites List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <Card key={car.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 relative">
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
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(car.id);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{car.name}</h3>
                    <div className="flex items-center">
                      <ReadOnlyRating value={car.rating} size="sm" />
                      <span className="text-sm text-muted-foreground ml-1">({car.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span>{car.brand} {car.year}</span>
                    <span className="mx-2">•</span>
                    <span>{car.transmission}</span>
                    <span className="mx-2">•</span>
                    <span>{car.fuelType}</span>
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
            <h3 className="text-lg font-medium mb-2">{t("favorites.empty.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("favorites.empty.desc")}</p>
            <Button onClick={() => navigate("/cars")}>
              {t("favorites.browse_cars")}
            </Button>
          </div>
        )}
        
        {/* Stats */}
        {filteredCars.length > 0 && (
          <div className="mt-8 text-sm text-muted-foreground">
            {searchQuery ? (
              <p>{t("favorites.showing")} {filteredCars.length} {t("favorites.of")} {favoriteCars.length} {t("favorites.cars")}</p>
            ) : (
              <p>{t("favorites.total")} {favoriteCars.length} {t("favorites.cars")}</p>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;

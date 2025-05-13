import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReadOnlyRating } from "@/components/ui/rating";
import { Car } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { isInFavorites, toggleFavorite } from "@/services/favoriteService";
import { Heart, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  bookingCount?: number;
  variant?: "default" | "compact" | "horizontal";
  showActions?: boolean;
  showCategory?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showDetails?: boolean;
  badge?: {
    text: string;
    variant?: "default" | "accent" | "primary" | "secondary";
  };
  className?: string;
}

/**
 * CarCard component
 * 
 * A standardized card for displaying car information
 */
const CarCard: React.FC<CarCardProps> = ({
  car,
  bookingCount,
  variant = "default",
  showActions = true,
  showCategory = true,
  showPrice = true,
  showRating = true,
  showDetails = true,
  badge,
  className,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addCarToCompare, isInCompare, canAddToCompare } = useCompare();
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(false);

  // Check if car is in favorites when component mounts or user changes
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setIsFavorite(isInFavorites(user.id, car.id));
    }
  }, [isAuthenticated, user, car.id]);

  // Handle adding/removing from favorites
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      toast({
        title: t("favorites.login.required.title"),
        description: t("favorites.login.required.desc"),
        variant: "destructive",
      });
      return;
    }

    const newState = toggleFavorite(user.id, car.id);
    setIsFavorite(newState);
    
    // Show toast notification
    if (newState) {
      toast({
        title: t("favorites.added.title"),
        description: t("favorites.added.desc", { car: car.name }),
        variant: "default",
      });
    } else {
      toast({
        title: t("favorites.removed.title"),
        description: t("favorites.removed.desc"),
        variant: "default",
      });
    }
  };

  // Get badge variant class
  const getBadgeClass = () => {
    if (!badge) return "";
    
    const variants = {
      default: "bg-muted text-muted-foreground",
      accent: "bg-accent text-accent-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    };
    
    return variants[badge.variant || "default"];
  };

  // Determine card layout based on variant
  const isHorizontal = variant === "horizontal";
  const imageHeight = variant === "compact" ? "h-36" : "h-48";
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-border",
        isHorizontal ? "flex flex-col md:flex-row" : "flex flex-col",
        className
      )}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden", 
        imageHeight,
        isHorizontal ? "md:w-2/5" : "w-full"
      )}>
        <OptimizedImage
          src={car.images[0]}
          alt={car.name}
          aspectRatio="aspect-auto"
          containerClassName="h-full"
          loadingStrategy="lazy"
          showSkeleton={true}
        />
        
        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-0 left-0 bg-primary text-secondary px-2 py-1 m-2 rounded text-sm font-medium z-10">
            {car.category}
          </div>
        )}
        
        {/* Custom Badge */}
        {badge && (
          <Badge className={cn("absolute top-0 right-0 m-2", getBadgeClass())}>
            {badge.text}
          </Badge>
        )}
        
        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-0 right-0 m-2 z-10 flex space-x-2">
            {/* Favorite Button */}
            {isAuthenticated && user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isFavorite
                          ? "bg-red-50 dark:bg-red-900/30 text-red-500 border-red-200 dark:border-red-800"
                          : "bg-background text-foreground hover:text-red-500 border-input"
                      )}
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? t("favorites.remove") : t("favorites.add")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {/* Compare Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isInCompare(car.id) ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      isInCompare(car.id)
                        ? "bg-primary text-secondary"
                        : "bg-background text-primary hover:bg-accent hover:text-accent-foreground border-input"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addCarToCompare(car);
                    }}
                    disabled={!canAddToCompare() && !isInCompare(car.id)}
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInCompare(car.id)
                    ? t("compare.added_tooltip")
                    : !canAddToCompare()
                    ? t("compare.max_reached_tooltip")
                    : t("compare.add_tooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className={cn(
        "p-4 flex flex-col",
        isHorizontal ? "md:w-3/5" : "w-full"
      )}>
        {/* Car Title */}
        <div className="mb-2">
          <h3 className="font-bold text-lg">{car.name}</h3>
          <p className="text-muted-foreground text-sm">
            {car.brand} {car.model} • {car.year}
          </p>
        </div>
        
        {/* Rating */}
        {showRating && (
          <div className="flex items-center mb-3">
            <ReadOnlyRating value={car.rating} size="sm" />
            <span className="text-sm text-muted-foreground ms-2">
              ({car.reviews})
            </span>
          </div>
        )}
        
        {/* Car Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center">
            <span className="text-muted-foreground">{t("carcard.transmission")}: </span>
            <span className="font-medium ms-1">{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground">{t("carcard.fuel")}: </span>
            <span className="font-medium ms-1">{car.fuelType}</span>
          </div>
        </div>
        
        {/* Price and Action */}
        <div className="mt-auto flex justify-between items-center">
          {showPrice && (
            <div>
              <span className="text-accent font-bold text-xl">{car.dailyPrice}</span>
              <span className="text-muted-foreground text-sm"> {t("carcard.price.day")}</span>
            </div>
          )}
          
          {showDetails && (
            <Link to={`/cars/${car.id}`}>
              <Button 
                variant="outline" 
                className="text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
              >
                {t("carcard.details")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export { CarCard };

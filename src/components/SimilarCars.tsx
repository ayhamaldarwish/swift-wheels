import React from "react";
import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ReadOnlyRating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SimilarCarsProps {
  cars: Car[];
  title: string;
  description?: string;
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ cars, title, description }) => {
  const { t, isRTL } = useLanguage();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Adjust as needed
      
      if (direction === "left") {
        container.scrollBy({ left: isRTL ? scrollAmount : -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: isRTL ? -scrollAmount : scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (cars.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border-gray-200"
            onClick={() => scroll("left")}
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border-gray-200"
            onClick={() => scroll("right")}
          >
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cars.map((car) => (
          <Link 
            key={car.id} 
            to={`/cars/${car.id}`} 
            className="flex-shrink-0 w-64 border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-40 relative">
              <OptimizedImage
                src={car.images[0]}
                alt={car.name}
                aspectRatio="aspect-auto"
                containerClassName="h-full"
                loadingStrategy="lazy"
                showSkeleton={true}
              />
              <Badge 
                variant="outline" 
                className="absolute top-2 left-2 bg-primary text-secondary"
              >
                {car.category}
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{car.name}</h3>
              
              <div className="flex items-center mb-2">
                <ReadOnlyRating value={car.rating} size="sm" />
                <span className="text-sm text-muted-foreground ml-1">
                  ({car.reviews})
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-accent">
                  {car.dailyPrice} {t("cardetails.price.day")}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                >
                  {t("cardetails.view")}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarCars;

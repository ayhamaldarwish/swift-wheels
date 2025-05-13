import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRandomCar } from "@/services/carService";
import { Car } from "@/types/car";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ReadOnlyRating } from "@/components/ui/rating";
import { Shuffle, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

interface RandomCarSuggestionProps {
  className?: string;
}

/**
 * RandomCarSuggestion component
 *
 * Displays a button to suggest a random car and shows the suggested car
 * when the button is clicked.
 */
const RandomCarSuggestion: React.FC<RandomCarSuggestionProps> = ({ className }) => {
  const { t, isRTL } = useLanguage();
  const [suggestedCar, setSuggestedCar] = useState<Car | null>(null);
  const [previousCarIds, setPreviousCarIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get a random car suggestion
  const handleGetSuggestion = () => {
    setIsLoading(true);

    // Get a random car, excluding previously suggested cars if possible
    const randomCar = getRandomCar(previousCarIds);

    // Add a small delay to make the loading state visible
    setTimeout(() => {
      setSuggestedCar(randomCar);

      // Add the car ID to the list of previous car IDs
      setPreviousCarIds(prev => {
        // Keep only the last 5 car IDs to avoid excluding too many cars
        const updatedIds = [...prev, randomCar.id];
        return updatedIds.length > 5 ? updatedIds.slice(-5) : updatedIds;
      });

      setIsLoading(false);
    }, 600);
  };

  return (
    <Section
      title={t("random.suggestion.title")}
      subtitle={t("random.suggestion.description")}
      background="default"
      spacing="default"
      className={className}
    >
      <Card className="p-6 bg-card text-card-foreground shadow-sm border border-border">
        {!suggestedCar ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Button
              size="lg"
              className="bg-primary text-secondary hover:bg-primary/90 px-8 py-6 text-lg flex items-center gap-2"
              onClick={handleGetSuggestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Shuffle className="h-5 w-5 mr-2" />
              )}
              {t("random.suggestion.button")}
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={suggestedCar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-6"
            >
              <div className="md:w-1/3 relative rounded-lg overflow-hidden h-64 md:h-auto bg-card">
                <OptimizedImage
                  src={suggestedCar.images[0]}
                  alt={suggestedCar.name}
                  aspectRatio="aspect-auto"
                  containerClassName="h-full"
                  loadingStrategy="lazy"
                  showSkeleton={true}
                />
                <div className="absolute top-0 left-0 bg-primary text-secondary px-2 py-1 m-2 rounded text-sm font-medium z-10">
                  {suggestedCar.category}
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{suggestedCar.name}</h3>
                  <p className="text-muted-foreground">{suggestedCar.brand} {suggestedCar.model} • {suggestedCar.year}</p>
                </div>

                <div className="flex items-center mb-4">
                  <ReadOnlyRating value={suggestedCar.rating} />
                  <span className="text-sm text-muted-foreground ms-2">({suggestedCar.reviews} reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{t("cardetails.transmission")}</span>
                    <span className="font-medium">{suggestedCar.transmission}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{t("cardetails.fuel")}</span>
                    <span className="font-medium">{suggestedCar.fuelType}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{t("cardetails.seats")}</span>
                    <span className="font-medium">{suggestedCar.seats} {t("cardetails.seats.value")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{t("random.suggestion.price")}</span>
                    <span className="font-medium text-accent">{suggestedCar.dailyPrice} {t("cardetails.price.currency")}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-input hover:bg-accent hover:text-accent-foreground"
                    onClick={handleGetSuggestion}
                  >
                    <Shuffle className="h-4 w-4" />
                    {t("random.suggestion.try_again")}
                  </Button>

                  <Link to={`/cars/${suggestedCar.id}`}>
                    <Button className="bg-primary text-secondary hover:bg-primary/90 flex items-center gap-2">
                      {t("random.suggestion.view_details")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
    </Section>
  );
};

export default RandomCarSuggestion;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPopularCars } from "@/services/bookingService";
import { Car } from "@/types/car";
import { Section } from "@/components/ui/section";
import { CarCard } from "@/components/ui/car-card";

interface PopularCarsSectionProps {
  limit?: number;
}

/**
 * PopularCarsSection component
 *
 * Displays a section with the most popular cars based on booking count
 */
const PopularCarsSection: React.FC<PopularCarsSectionProps> = ({ limit = 4 }) => {
  const { t } = useLanguage();
  const [popularCars, setPopularCars] = useState<Array<Car & { bookingCount: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load popular cars
  useEffect(() => {
    setIsLoading(true);
    const cars = getPopularCars(limit);
    setPopularCars(cars);
    setIsLoading(false);
  }, [limit]);

  if (popularCars.length === 0 && !isLoading) {
    return null; // Don't show the section if there are no popular cars
  }

  // Action button for the section header
  const actionButton = (
    <Link to="/cars">
      <AnimatedButton
        variant="outline"
        animationType="scale"
        className="border-input text-card-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {t("home.popular.viewall")}
      </AnimatedButton>
    </Link>
  );

  return (
    <Section
      title={t("home.popular.title")}
      subtitle={t("home.popular.subtitle")}
      action={actionButton}
      background="default"
      spacing="default"
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {popularCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              badge={{
                text: t("home.popular.bookings", { count: car.bookingCount }),
                variant: "accent"
              }}
            />
          ))}
        </div>
      )}
    </Section>
  );
};

export default PopularCarsSection;


import React from "react";
import { Car } from "@/data/cars";
import { CarCard as StandardCarCard } from "@/components/ui/car-card";

interface CarCardProps {
  car: Car;
  className?: string;
}

/**
 * CarCard component
 *
 * A wrapper around the standardized CarCard component
 */
const CarCard: React.FC<CarCardProps> = ({ car, className }) => {
  return (
    <StandardCarCard
      car={car}
      variant="default"
      showActions={true}
      showCategory={true}
      showPrice={true}
      showRating={true}
      showDetails={true}
      className={className}
    />
  );
};

export default CarCard;

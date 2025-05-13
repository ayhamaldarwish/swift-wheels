import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Car } from "@/types/car";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "./LanguageContext";

interface CompareContextType {
  carsToCompare: Car[];
  addCarToCompare: (car: Car) => void;
  removeCarFromCompare: (carId: number) => void;
  clearCompare: () => void;
  isInCompare: (carId: number) => boolean;
  canAddToCompare: () => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "swift-wheels-compare";
const MAX_CARS_TO_COMPARE = 2;

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carsToCompare, setCarsToCompare] = useState<Car[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Load cars from localStorage on initial render
  useEffect(() => {
    const storedCars = localStorage.getItem(STORAGE_KEY);
    if (storedCars) {
      try {
        setCarsToCompare(JSON.parse(storedCars));
      } catch (error) {
        console.error("Error parsing stored cars for comparison:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save cars to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carsToCompare));
  }, [carsToCompare]);

  const addCarToCompare = (car: Car) => {
    if (isInCompare(car.id)) {
      toast({
        title: t("compare.already_added.title"),
        description: t("compare.already_added.desc"),
        variant: "destructive",
      });
      return;
    }

    if (carsToCompare.length >= MAX_CARS_TO_COMPARE) {
      toast({
        title: t("compare.max_reached.title"),
        description: t("compare.max_reached.desc"),
        variant: "destructive",
      });
      return;
    }

    setCarsToCompare((prev) => [...prev, car]);
    toast({
      title: t("compare.added.title"),
      description: t("compare.added.desc", { car: car.name }),
      variant: "default",
    });
  };

  const removeCarFromCompare = (carId: number) => {
    setCarsToCompare((prev) => prev.filter((car) => car.id !== carId));
    toast({
      title: t("compare.removed.title"),
      description: t("compare.removed.desc"),
      variant: "default",
    });
  };

  const clearCompare = () => {
    setCarsToCompare([]);
    toast({
      title: t("compare.cleared.title"),
      description: t("compare.cleared.desc"),
      variant: "default",
    });
  };

  const isInCompare = (carId: number) => {
    return carsToCompare.some((car) => car.id === carId);
  };

  const canAddToCompare = () => {
    return carsToCompare.length < MAX_CARS_TO_COMPARE;
  };

  return (
    <CompareContext.Provider
      value={{
        carsToCompare,
        addCarToCompare,
        removeCarFromCompare,
        clearCompare,
        isInCompare,
        canAddToCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};

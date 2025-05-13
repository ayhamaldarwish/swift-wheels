import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockCars } from "@/data/mockData";
import { Car } from "@/types/car";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Section } from "@/components/ui/section";
import { CarCard } from "@/components/ui/car-card";

interface BudgetCarSuggestionProps {
  className?: string;
}

/**
 * BudgetCarSuggestion component
 *
 * Allows users to find cars within their budget using a slider or input
 */
const BudgetCarSuggestion: React.FC<BudgetCarSuggestionProps> = ({ className }) => {
  const { t, isRTL } = useLanguage();
  const [budget, setBudget] = useState<number>(300);
  const [suggestedCars, setSuggestedCars] = useState<Car[]>([]);
  const [inputBudget, setInputBudget] = useState<string>("300");
  const [inputMethod, setInputMethod] = useState<"slider" | "input">("slider");

  // Find cars within budget
  useEffect(() => {
    const carsWithinBudget = mockCars
      .filter(car => car.dailyPrice <= budget)
      .sort((a, b) => b.dailyPrice - a.dailyPrice) // Sort by price (highest first within budget)
      .slice(0, 4); // Get top 4 cars

    setSuggestedCars(carsWithinBudget);
  }, [budget]);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newBudget = value[0];
    setBudget(newBudget);
    setInputBudget(newBudget.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputBudget(value);

    // Convert to number and update budget if valid
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 50 && numValue <= 1000) {
      setBudget(numValue);
    }
  };

  // Handle input blur (validate and correct input)
  const handleInputBlur = () => {
    let numValue = parseInt(inputBudget);

    if (isNaN(numValue)) {
      numValue = 300; // Default value
    } else if (numValue < 50) {
      numValue = 50; // Minimum value
    } else if (numValue > 1000) {
      numValue = 1000; // Maximum value
    }

    setBudget(numValue);
    setInputBudget(numValue.toString());
  };

  // Action button for the section header
  const actionButton = (
    <Link to="/cars">
      <AnimatedButton
        variant="outline"
        animationType="scale"
        className="border-input text-card-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {t("budget.suggestion.view_all")}
      </AnimatedButton>
    </Link>
  );

  return (
    <Section
      title={t("budget.suggestion.title")}
      subtitle={t("budget.suggestion.description")}
      action={actionButton}
      background="default"
      spacing="default"
      className={className}
    >
      <Card className="p-6 bg-card text-card-foreground shadow-sm border border-border">
        <Tabs defaultValue="slider" onValueChange={(value) => setInputMethod(value as "slider" | "input")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="slider" className="px-4 py-2">{t("budget.suggestion.slider")}</TabsTrigger>
            <TabsTrigger value="input" className="px-4 py-2">{t("budget.suggestion.input")}</TabsTrigger>
          </TabsList>

          <TabsContent value="slider" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("budget.suggestion.min")}</span>
                <span className="font-medium">{budget} {t("cardetails.price.currency")}</span>
                <span className="text-sm text-muted-foreground">{t("budget.suggestion.max")}</span>
              </div>
              <Slider
                defaultValue={[300]}
                max={1000}
                min={50}
                step={10}
                value={[budget]}
                onValueChange={handleSliderChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="input" className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Input
                type="number"
                value={inputBudget}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min={50}
                max={1000}
                className="w-full"
                placeholder={t("budget.suggestion.enter")}
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {t("cardetails.price.currency")}
              </span>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            {suggestedCars.length > 0
              ? t("budget.suggestion.results", { 0: suggestedCars.length })
              : t("budget.suggestion.no_results")}
          </h3>

          {suggestedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  badge={{
                    text: `${car.dailyPrice} ${t("cardetails.price.currency")}`,
                    variant: "accent"
                  }}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("budget.suggestion.try_higher")}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("budget.suggestion.footer")}
          </p>
        </div>
      </Card>
    </Section>
  );
};

export default BudgetCarSuggestion;

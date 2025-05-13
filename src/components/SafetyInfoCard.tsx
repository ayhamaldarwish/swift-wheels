import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "@/types/car";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface SafetyInfoCardProps {
  /**
   * Car data to display safety information for
   */
  car: Car;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
}

/**
 * SafetyInfoCard component
 * 
 * Displays safety and insurance information for a car
 */
const SafetyInfoCard: React.FC<SafetyInfoCardProps> = ({
  car,
  className = "",
}) => {
  const { t, isRTL } = useLanguage();
  
  // Helper function to render safety rating stars
  const renderSafetyRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-500">{t("cardetails.safety.not_available")}</span>;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-500">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">★</span>
        );
      }
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  // Helper function to get insurance type display text
  const getInsuranceTypeText = (type?: string) => {
    if (!type) return t("cardetails.safety.not_available");
    
    switch (type) {
      case "Basic":
        return t("cardetails.safety.basic");
      case "Comprehensive":
        return t("cardetails.safety.comprehensive");
      case "Premium":
        return t("cardetails.safety.premium");
      default:
        return type;
    }
  };
  
  // Helper function to get insurance type icon
  const getInsuranceTypeIcon = (type?: string) => {
    if (!type) return Info;
    
    switch (type) {
      case "Basic":
        return Info;
      case "Comprehensive":
        return CheckCircle;
      case "Premium":
        return Shield;
      default:
        return Info;
    }
  };
  
  const InsuranceIcon = getInsuranceTypeIcon(car.insuranceType);
  
  return (
    <Card className={`shadow-md ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-primary" />
          {t("cardetails.safety.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Safety Rating */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t("cardetails.safety.rating")}:</span>
            <div className="flex items-center">
              {renderSafetyRating(car.safetyRating)}
            </div>
          </div>
          
          {/* Airbags */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t("cardetails.safety.airbags")}:</span>
            <div className="flex items-center">
              {car.airbags ? (
                <span className="font-medium">{car.airbags}</span>
              ) : (
                <span className="text-gray-500">{t("cardetails.safety.not_available")}</span>
              )}
            </div>
          </div>
          
          {/* Insurance Type */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{t("cardetails.safety.insurance")}:</span>
            <div className="flex items-center gap-1">
              <InsuranceIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {getInsuranceTypeText(car.insuranceType)}
              </span>
            </div>
          </div>
          
          {/* Safety Features */}
          {car.safetyFeatures && car.safetyFeatures.length > 0 && (
            <div className="mt-4">
              <h4 className="text-gray-700 font-medium mb-2">{t("cardetails.safety.features")}:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {car.safetyFeatures.map((feature, index) => (
                  <li key={index} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyInfoCard;

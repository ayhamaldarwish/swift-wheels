import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, MapPin } from "lucide-react";

interface SimpleMapProps {
  address: string;
  officeName: string;
  className?: string;
}

/**
 * SimpleMap component
 * 
 * A simple CSS-based map for when Google Maps is not available
 */
const SimpleMap: React.FC<SimpleMapProps> = ({ address, officeName, className }) => {
  const { t, isRTL } = useLanguage();
  
  // Function to open directions in Google Maps
  const openDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-md ${className}`}>
      <div className="h-96 w-full relative bg-blue-50">
        {/* Simple map background with CSS */}
        <div className="absolute inset-0">
          {/* Map grid lines */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Main roads */}
          <div className="absolute left-0 right-0 top-1/2 h-2 bg-yellow-400 transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-yellow-400 transform -translate-x-1/2"></div>
          
          {/* Secondary roads */}
          <div className="absolute left-0 right-0 top-1/4 h-1 bg-white transform -translate-y-1/2"></div>
          <div className="absolute left-0 right-0 top-3/4 h-1 bg-white transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white transform -translate-x-1/2"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-white transform -translate-x-1/2"></div>
          
          {/* City blocks */}
          <div className="absolute top-1/4 left-1/4 right-1/2 bottom-1/2 bg-green-100 border border-green-200"></div>
          <div className="absolute top-1/4 left-1/2 right-1/4 bottom-1/2 bg-gray-100 border border-gray-200"></div>
          <div className="absolute top-1/2 left-1/4 right-1/2 bottom-3/4 bg-gray-100 border border-gray-200"></div>
          <div className="absolute top-1/2 left-1/2 right-1/4 bottom-3/4 bg-blue-100 border border-blue-200"></div>
        </div>
        
        {/* Office marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
          </div>
        </div>
        
        {/* Office info card */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-white rounded-lg shadow-lg p-4 max-w-xs`}>
          <h3 className="font-bold text-lg mb-2">{officeName}</h3>
          <p className="text-gray-600 mb-4 whitespace-pre-line">
            {address}
          </p>
          <Button 
            variant="outline" 
            className="w-full bg-primary/10 hover:bg-primary/20 border-primary/20 flex items-center justify-center gap-2"
            onClick={openDirections}
          >
            {t("contact.map.directions")}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Map label */}
        <div className="absolute bottom-4 left-4 bg-white/80 p-1 rounded">
          <span className="text-xs font-medium text-gray-700">RentCar Map</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;

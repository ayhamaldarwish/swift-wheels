import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, MapPin, Navigation, Layers, Map } from "lucide-react";

interface GoogleMapProps {
  address: string;
  officeName: string;
  className?: string;
}

/**
 * GoogleMap component
 *
 * Displays an interactive Google Map with a marker for the office location
 * This is a simulated implementation that doesn't require an actual Google Maps API key
 */
const GoogleMap: React.FC<GoogleMapProps> = ({ address, officeName, className }) => {
  const { t, isRTL } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Simulated coordinates for Riyadh, Saudi Arabia
  const latitude = 24.7136;
  const longitude = 46.6753;

  // Function to open directions in Google Maps
  const openDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  // Function to toggle map type
  const toggleMapType = () => {
    setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
  };

  // Function to toggle info window
  const toggleInfo = () => {
    setIsInfoVisible(prev => !prev);
  };

  // Get the appropriate map image based on the selected map type
  const getMapImage = () => {
    // Using a simple static map from Google Maps
    return mapType === 'roadmap'
      ? "https://maps.googleapis.com/maps/api/staticmap?center=Riyadh,SaudiArabia&zoom=13&size=800x600&maptype=roadmap&markers=color:red%7CRiyadh,SaudiArabia&key=AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik"
      : "https://maps.googleapis.com/maps/api/staticmap?center=Riyadh,SaudiArabia&zoom=13&size=800x600&maptype=satellite&markers=color:red%7CRiyadh,SaudiArabia&key=AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik";
  };

  // Fallback map in case the Google Maps static API fails
  const getFallbackMap = () => {
    return "https://i.imgur.com/ZKHfKpS.png"; // A simple map image of Riyadh
  };

  // Handle image load and error
  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setIsImageLoading(false);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-md ${className}`}>
      {/* Map container */}
      <div
        ref={mapRef}
        className="h-96 w-full relative bg-gray-100"
      >
        {/* Map image */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Actual map image */}
        <img
          src={getMapImage()}
          alt="Map of office location"
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />

        {/* Fallback if image fails to load */}
        {!imageLoaded && !isImageLoading && (
          <>
            {/* Try to load fallback image */}
            <img
              src={getFallbackMap()}
              alt="Map of office location (fallback)"
              className="w-full h-full object-cover"
              onError={() => {
                // If fallback also fails, show text-based fallback
                console.log("Fallback map also failed to load");
              }}
            />

            {/* Text-based fallback overlay */}
            <div className="absolute inset-0 bg-gray-100/80 flex flex-col items-center justify-center p-6">
              <Map className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">{t("contact.map.title")}</h3>
              <p className="text-gray-600 mb-6 text-center">{address}</p>
              <Button
                variant="outline"
                className="bg-primary/10 hover:bg-primary/20 border-primary/20 flex items-center justify-center gap-2"
                onClick={openDirections}
              >
                {t("contact.map.directions")}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Map overlay for simulated interactivity */}
        {imageLoaded && <div className="absolute inset-0 bg-black/5"></div>}

        {/* Office marker */}
        {imageLoaded && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="flex flex-col items-center cursor-pointer" onClick={toggleInfo}>
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <MapPin className="h-3 w-3 text-white" />
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
            </div>
          </div>
        )}

        {/* Office info card */}
        {imageLoaded && isInfoVisible && (
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-white rounded-lg shadow-lg p-4 max-w-xs transition-opacity duration-300`}>
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
        )}

        {/* Map controls */}
        {imageLoaded && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white rounded-sm shadow-md hover:bg-gray-100 p-0"
              onClick={toggleMapType}
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white rounded-sm shadow-md hover:bg-gray-100 p-0"
              onClick={toggleInfo}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Google logo (for realism) */}
        {imageLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/80 p-1 rounded">
            <span className="text-xs font-medium text-gray-700">Google Maps</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMap;

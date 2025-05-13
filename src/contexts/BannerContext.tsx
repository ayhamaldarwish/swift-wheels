import React, { createContext, useContext, useState, useEffect } from "react";
import TopBanner, { BannerType, TopBannerProps } from "@/components/TopBanner";

interface BannerContextType {
  showBanner: (props: Omit<TopBannerProps, "onClose">) => void;
  hideBanner: (id?: string) => void;
  hideAllBanners: () => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

interface BannerProviderProps {
  children: React.ReactNode;
  initialBanners?: Omit<TopBannerProps, "onClose">[];
}

export const BannerProvider: React.FC<BannerProviderProps> = ({ 
  children, 
  initialBanners = [] 
}) => {
  const [banners, setBanners] = useState<TopBannerProps[]>(
    initialBanners.map(banner => ({
      ...banner,
      id: banner.id || `banner-${Math.random().toString(36).substring(2, 9)}`,
      onClose: () => hideBanner(banner.id)
    }))
  );

  // Check for new car announcements or other system notifications
  useEffect(() => {
    // This could be replaced with an API call to check for new announcements
    const checkForAnnouncements = () => {
      // Example: Check localStorage for new cars flag
      const newCars = localStorage.getItem("newCars");
      if (newCars) {
        try {
          const carsData = JSON.parse(newCars);
          if (carsData.length > 0 && !localStorage.getItem(`announced-${carsData[0].id}`)) {
            showBanner({
              message: `جديد! تم إضافة سيارة ${carsData[0].brand} ${carsData[0].model}`,
              type: "announcement",
              id: `new-car-${carsData[0].id}`,
              action: {
                label: "عرض التفاصيل",
                onClick: () => {
                  // Navigate to car details or mark as seen
                  localStorage.setItem(`announced-${carsData[0].id}`, "true");
                  window.location.href = `/cars/${carsData[0].id}`;
                }
              }
            });
          }
        } catch (error) {
          console.error("Error parsing new cars data:", error);
        }
      }
    };

    checkForAnnouncements();
  }, []);

  const showBanner = (props: Omit<TopBannerProps, "onClose">) => {
    const id = props.id || `banner-${Math.random().toString(36).substring(2, 9)}`;
    
    // Check if banner with this ID already exists
    if (banners.some(banner => banner.id === id)) {
      // Update existing banner
      setBanners(prev => 
        prev.map(banner => 
          banner.id === id 
            ? { ...props, id, onClose: () => hideBanner(id) } 
            : banner
        )
      );
    } else {
      // Add new banner
      setBanners(prev => [
        ...prev, 
        { ...props, id, onClose: () => hideBanner(id) }
      ]);
    }
  };

  const hideBanner = (id?: string) => {
    if (id) {
      setBanners(prev => prev.filter(banner => banner.id !== id));
    } else if (banners.length > 0) {
      // If no ID provided, remove the first banner
      setBanners(prev => prev.slice(1));
    }
  };

  const hideAllBanners = () => {
    setBanners([]);
  };

  return (
    <BannerContext.Provider value={{ showBanner, hideBanner, hideAllBanners }}>
      {/* Render all active banners */}
      {banners.map((banner) => (
        <TopBanner key={banner.id} {...banner} />
      ))}
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBanner must be used within a BannerProvider");
  }
  return context;
};

export default BannerProvider;

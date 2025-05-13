import React from "react";
import { Button } from "@/components/ui/button";
import { useBanner } from "@/contexts/BannerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

const BannerDemo = () => {
  const { showBanner, hideAllBanners } = useBanner();
  const { t } = useLanguage();

  const showNewCarBanner = () => {
    showBanner({
      message: t("banner.new_car").replace("{car}", "Mercedes S500"),
      type: "announcement",
      icon: <Megaphone className="h-5 w-5" />,
      action: {
        label: t("banner.view_details"),
        onClick: () => {
          // Navigate to car details
          console.log("Navigating to Mercedes S500 details");
        },
      },
      id: "new-car-banner",
    });
  };

  const showSpecialOfferBanner = () => {
    showBanner({
      message: t("banner.special_offer")
        .replace("{discount}", "15")
        .replace("{category}", t("cars.category.luxury")),
      type: "success",
      icon: <CheckCircle className="h-5 w-5" />,
      action: {
        label: t("banner.book_now"),
        onClick: () => {
          // Navigate to luxury cars
          console.log("Navigating to luxury cars");
        },
      },
      id: "special-offer-banner",
    });
  };

  const showMaintenanceBanner = () => {
    showBanner({
      message: t("banner.maintenance").replace(
        "{date}",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      ),
      type: "warning",
      icon: <AlertTriangle className="h-5 w-5" />,
      action: {
        label: t("banner.learn_more"),
        onClick: () => {
          // Show more info
          console.log("Show maintenance details");
        },
      },
      id: "maintenance-banner",
    });
  };

  const showHolidayBanner = () => {
    showBanner({
      message: t("banner.holiday").replace(
        "{date}",
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
      ),
      type: "info",
      icon: <Info className="h-5 w-5" />,
      dismissible: true,
      id: "holiday-banner",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("banner.demo.title")}</CardTitle>
        <CardDescription>{t("banner.demo.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button onClick={showNewCarBanner} className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            {t("banner.demo.new_car")}
          </Button>
          <Button onClick={showSpecialOfferBanner} variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {t("banner.demo.special_offer")}
          </Button>
          <Button onClick={showMaintenanceBanner} variant="outline" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("banner.demo.maintenance")}
          </Button>
          <Button onClick={showHolidayBanner} variant="outline" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("banner.demo.holiday")}
          </Button>
          <Button onClick={hideAllBanners} variant="destructive" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("banner.demo.clear_all")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerDemo;

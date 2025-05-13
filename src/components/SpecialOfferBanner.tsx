import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpecialOfferBannerProps {
  /**
   * End date for the offer
   */
  endDate: Date | string;

  /**
   * Title of the offer
   */
  title?: string;

  /**
   * Description of the offer
   */
  description?: string;

  /**
   * URL to navigate to when the CTA button is clicked
   * @default "/cars"
   */
  ctaUrl?: string;

  /**
   * Text for the CTA button
   * @default "View Offers"
   */
  ctaText?: string;

  /**
   * CSS class to apply to the container
   */
  className?: string;

  /**
   * Callback function to execute when the countdown ends
   */
  onExpire?: () => void;
}

/**
 * SpecialOfferBanner component
 *
 * Displays a banner with a countdown timer and offer details
 */
const SpecialOfferBanner: React.FC<SpecialOfferBannerProps> = ({
  endDate,
  title,
  description,
  ctaUrl = "/cars",
  ctaText,
  className = "",
  onExpire,
}) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Calculate if the offer has expired
  const isExpired = new Date(endDate).getTime() < new Date().getTime();

  // Handle CTA button click
  const handleCtaClick = () => {
    navigate(ctaUrl);
  };

  return (
    <div
      className={`bg-stone-100 dark:bg-stone-800/20 rounded-lg shadow-md overflow-hidden ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Countdown Timer */}
        <div className="md:w-1/3 lg:w-1/4">
          <CountdownTimer
            endDate={endDate}
            title={title || t("countdown.special_discount")}
            className="h-full rounded-none md:rounded-r-none"
            onExpire={onExpire}
          />
        </div>

        {/* Offer Details */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-lg text-secondary dark:text-secondary">
              {title || t("countdown.special_discount")}
            </h3>
          </div>

          <p className="text-secondary font-medium dark:text-secondary mb-4">
            {description || t("countdown.get_discount")}
          </p>

          {!isExpired && (
            <div>
              <Button
                onClick={handleCtaClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-secondary"
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBanner;

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber = "966123456789" // Default Saudi Arabia number (example)
}) => {
  const { t, isRTL } = useLanguage();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const handleWhatsAppClick = () => {
    // Encode the message for the URL
    const message = encodeURIComponent(t("whatsapp.message"));
    // Create WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div 
      className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50`}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-16 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-2 w-64`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-primary">{t("whatsapp.help")}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setIsTooltipVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {t("whatsapp.message")}
            </p>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleWhatsAppClick}
            >
              {t("whatsapp.chat")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg"
        onClick={handleWhatsAppClick}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default WhatsAppButton;

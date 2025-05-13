import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import DeliverySimulation from "@/components/DeliverySimulation";
import { Car } from "@/types/car";

interface DeliveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  bookingId: string;
}

/**
 * DeliveryDialog component
 * 
 * Displays a dialog with a delivery simulation for a car booking
 */
const DeliveryDialog: React.FC<DeliveryDialogProps> = ({
  isOpen,
  onClose,
  car,
  bookingId,
}) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isDeliveryComplete, setIsDeliveryComplete] = useState(false);

  // Handle delivery completion
  const handleDeliveryComplete = () => {
    setIsDeliveryComplete(true);
    
    // Show success toast
    toast({
      title: t("delivery.success"),
      description: t("delivery.success.desc"),
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              {t("delivery.title")}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>
            {t("delivery.status")}: {car.name}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <DeliverySimulation
            carName={car.name}
            carImage={car.images[0]}
            onComplete={handleDeliveryComplete}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant={isDeliveryComplete ? "default" : "outline"}
            className={isDeliveryComplete ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={onClose}
          >
            {isDeliveryComplete ? t("delivery.success") : t("cardetails.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDialog;

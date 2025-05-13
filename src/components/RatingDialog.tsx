import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Car } from "@/types/car";
import { UserRating } from "@/types/rating";
import { saveRating, getUserRatingForBooking } from "@/services/ratingService";

interface RatingDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when the dialog is closed
   */
  onClose: () => void;
  
  /**
   * The car to rate
   */
  car: Car;
  
  /**
   * The booking ID
   */
  bookingId: string;
  
  /**
   * Callback when rating is submitted
   */
  onRatingSubmitted?: (rating: UserRating) => void;
}

/**
 * RatingDialog component
 * 
 * Dialog for users to rate a car after booking
 */
const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  car,
  bookingId,
  onRatingSubmitted
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get existing rating if any
  const existingRating = user ? getUserRatingForBooking(user.id, bookingId) : null;
  
  const [rating, setRating] = useState<number>(existingRating?.rating || 0);
  const [comment, setComment] = useState<string>(existingRating?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Create rating object
      const ratingData: UserRating = {
        id: existingRating?.id || `rating-${Date.now()}`,
        userId: user.id,
        carId: car.id,
        bookingId,
        rating,
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      
      // Save rating
      const savedRating = saveRating(ratingData);
      
      // Show success message
      toast({
        title: existingRating 
          ? t("rating.toast.updated.title") 
          : t("rating.toast.success.title"),
        description: existingRating 
          ? t("rating.toast.updated.desc") 
          : t("rating.toast.success.desc"),
        variant: "default",
      });
      
      // Call callback
      onRatingSubmitted?.(savedRating);
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error saving rating:", error);
      toast({
        title: t("rating.toast.error.title"),
        description: t("rating.toast.error.desc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("rating.title")}</DialogTitle>
          <DialogDescription>
            {t("rating.description", { car: car.name })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-center font-medium">
              {t("rating.question")}
            </p>
            <Rating
              value={rating}
              onChange={setRating}
              size="lg"
              className="py-2"
            />
            <p className="text-sm text-muted-foreground">
              {rating === 0 
                ? t("rating.select") 
                : t(`rating.value.${rating}`)}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("rating.comment.label")}
            </label>
            <Textarea
              placeholder={t("rating.comment.placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("rating.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting 
              ? t("rating.submitting") 
              : existingRating 
                ? t("rating.update") 
                : t("rating.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;

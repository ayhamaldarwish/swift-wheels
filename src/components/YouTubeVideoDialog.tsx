import React, { useEffect, useState } from "react";
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

interface YouTubeVideoDialogProps {
  videoUrl: string;
  carName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * YouTubeVideoDialog component
 * 
 * Displays a YouTube video in a dialog/modal
 */
const YouTubeVideoDialog: React.FC<YouTubeVideoDialogProps> = ({
  videoUrl,
  carName,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset iframe loaded state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIframeLoaded(false);
    }
  }, [isOpen]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
        <DialogHeader className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">{t("cardetails.test_drive.title", { 0: carName })}</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-white/80">
            {t("cardetails.test_drive.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video w-full">
          {/* Loading spinner */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* YouTube iframe */}
          <iframe
            src={`${videoUrl}?autoplay=1&rel=0`}
            title={`${carName} Test Drive`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            onLoad={handleIframeLoad}
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubeVideoDialog;

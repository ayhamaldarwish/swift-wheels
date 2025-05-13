import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { generateInvoicePDF } from "@/services/invoiceService";
import { Car } from "@/types/car";
import { User } from "@/types/auth";

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: Car;
  user: User;
}

/**
 * InvoiceDialog component
 *
 * Displays an invoice in a dialog with options to print or download as PDF
 */
const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  isOpen,
  onClose,
  bookingId,
  bookingDate,
  startDate,
  endDate,
  totalPrice,
  car,
  user,
}) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle print invoice
  const handlePrint = () => {
    if (invoiceRef.current) {
      window.print();
    }
  };

  // Handle download invoice as PDF
  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      setIsGenerating(true);

      // Generate PDF
      await generateInvoicePDF(invoiceRef, {
        filename: `invoice-${bookingId}.pdf`,
        orientation: 'portrait',
        format: 'a4',
      });

      // Show success toast
      toast({
        title: t("invoice.success"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Show error toast
      toast({
        title: t("invoice.error"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className="p-6 bg-white sticky top-0 z-10 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">{t("invoice.title")}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handlePrint}
                disabled={isGenerating}
              >
                <Printer className="h-4 w-4" />
                {t("invoice.print")}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1 bg-primary text-secondary hover:bg-primary/90"
                onClick={handleDownload}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isGenerating ? t("invoice.generating") : t("invoice.download")}
              </Button>
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
          </div>
          <DialogDescription>
            {t("invoice.booking.id")}: {bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          <InvoiceTemplate
            ref={invoiceRef}
            bookingId={bookingId}
            bookingDate={bookingDate}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            car={car}
            user={user}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;

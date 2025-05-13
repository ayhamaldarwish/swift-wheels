import React, { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Booking } from "@/types/auth";
import { Car } from "@/types/car";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Printer, Download } from "lucide-react";
import Logo from "@/components/Logo";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";

interface BookingInvoiceProps {
  car: Car;
  booking: Booking;
}

const BookingInvoice: React.FC<BookingInvoiceProps> = ({ car, booking }) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Calculate booking details
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Ensure car price is a valid number
  const carPrice = typeof car.price === 'number' ? car.price : 0;

  const totalPrice = carPrice * days;
  const tax = totalPrice * 0.15; // 15% tax
  const grandTotal = totalPrice + tax;

  // Ensure we have valid numbers and handle undefined values
  const formattedTotalPrice = isNaN(totalPrice) || totalPrice === undefined ? carPrice : totalPrice;
  const formattedTax = isNaN(tax) || tax === undefined ? 0 : tax;
  const formattedGrandTotal = isNaN(grandTotal) || grandTotal === undefined ? carPrice : grandTotal;

  // Generate invoice number
  const invoiceNumber = `INV-${booking.id.substring(0, 8).toUpperCase()}`;
  const invoiceDate = new Date().toLocaleDateString();

  // Handle print invoice
  const handlePrint = () => {
    window.print();
  };

  // Handle download invoice as PDF
  const handleDownload = () => {
    // This is a simplified version. In a real app, you would use a library like jsPDF
    // to generate a PDF and download it.
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4 rtl:space-x-reverse mb-4">
        <TooltipWrapper content="tooltip.print">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            {t("invoice.print")}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="tooltip.download">
          <Button
            className="flex items-center gap-2 bg-primary text-secondary hover:bg-primary/90"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            {t("invoice.download")}
          </Button>
        </TooltipWrapper>
      </div>

      <Card className="p-8" id="invoice-print-area" ref={invoiceRef}>
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-primary">
                <span className="text-secondary">رينت</span> كار
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t("invoice.company_address")}
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">
                {t("invoice.title")}
              </h1>
              <p className="text-gray-500 mt-1">#{invoiceNumber}</p>
              <p className="text-gray-500">{invoiceDate}</p>
            </div>
          </div>

          {/* Customer & Car Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {t("invoice.customer_info")}
              </h2>
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="font-medium">{user?.name || booking.userId}</p>
                <p className="text-gray-600">{user?.email || "customer@example.com"}</p>
                <p className="text-gray-600">{t("invoice.customer_id")}: {user?.id.substring(0, 8) || "N/A"}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {t("invoice.car_info")}
              </h2>
              <div className="border rounded-md p-4 bg-gray-50 flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
                  <OptimizedImage
                    src={car.images[0]}
                    alt={car.name}
                    aspectRatio="aspect-square"
                    containerClassName="h-full"
                    loadingStrategy="eager"
                  />
                </div>
                <div>
                  <p className="font-medium">{car.brand} {car.name}</p>
                  <p className="text-gray-600">{car.year} • {car.type}</p>
                  <p className="text-gray-600">{t("invoice.daily_rate")}: {carPrice} {t("invoice.currency")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {t("invoice.booking_details")}
            </h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("invoice.description")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("invoice.dates")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("invoice.days")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("invoice.rate")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("invoice.amount")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t("invoice.car_rental")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {carPrice} {t("invoice.currency")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formattedTotalPrice} {t("invoice.currency")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t("invoice.subtotal")}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formattedTotalPrice} {t("invoice.currency")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t("invoice.tax")}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                        {typeof formattedTax === 'number' ? formattedTax.toFixed(2) : '0.00'} {t("invoice.currency")}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {t("invoice.total")}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {typeof formattedGrandTotal === 'number' ? formattedGrandTotal.toFixed(2) : '0.00'} {t("invoice.currency")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-gray-500 text-sm">
            <p>{t("invoice.thank_you")}</p>
            <p className="mt-1">{t("invoice.contact_info")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingInvoice;

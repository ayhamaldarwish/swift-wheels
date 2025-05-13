import React, { forwardRef } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Car } from "@/types/car";
import { User } from "@/types/auth";
import Logo from "@/components/Logo";

interface InvoiceTemplateProps {
  bookingId: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: Car;
  user: User;
}

/**
 * InvoiceTemplate component
 *
 * A printable invoice template for car bookings
 */
const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ bookingId, bookingDate, startDate, endDate, totalPrice, car, user }, ref) => {
    const { t, isRTL } = useLanguage();

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate subtotal and tax
    const subtotal = car.dailyPrice * days;
    const taxRate = 0.15; // 15% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return (
      <div
        ref={ref}
        id="invoice-print-area"
        className="bg-white p-8 max-w-4xl mx-auto shadow-none"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <div className="flex items-center">
              <Logo size="md" />
              <h1 className="text-2xl font-bold ms-2">{t("invoice.company.name")}</h1>
            </div>
            <p className="text-gray-600 mt-2">{t("invoice.company.address")}</p>
            <p className="text-gray-600">{t("invoice.company.phone")}</p>
            <p className="text-gray-600">{t("invoice.company.email")}</p>
            <p className="text-gray-600">{t("invoice.company.website")}</p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-bold text-primary mb-2">{t("invoice.title")}</h2>
            <p className="text-gray-600">
              <span className="font-semibold">{t("invoice.booking.id")}:</span> {bookingId}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">{t("invoice.booking.date")}:</span> {format(new Date(bookingDate), "yyyy/MM/dd")}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-gray-800">{t("invoice.customer")}</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{t("dashboard.booking.number", { 0: bookingId })}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-gray-800">{t("invoice.booking.details")}</h3>
          <div className="bg-gray-50 p-4 rounded-md grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{t("invoice.booking.pickup")}</p>
              <p className="font-semibold">{format(new Date(startDate), "yyyy/MM/dd")}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("invoice.booking.return")}</p>
              <p className="font-semibold">{format(new Date(endDate), "yyyy/MM/dd")}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("invoice.booking.duration")}</p>
              <p className="font-semibold">{days} {days === 1 ? t("cardetails.booking.day") : t("cardetails.booking.days")}</p>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-gray-800">{t("invoice.car.details")}</h3>
          <div className="bg-gray-50 p-4 rounded-md grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">{t("invoice.car.name")}</p>
              <p className="font-semibold">{car.name}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("invoice.car.model")}</p>
              <p className="font-semibold">{car.brand} {car.model}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("invoice.car.year")}</p>
              <p className="font-semibold">{car.year}</p>
            </div>
            <div>
              <p className="text-gray-600">{t("cardetails.specs.category")}</p>
              <p className="font-semibold">{car.category}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-gray-800">{t("invoice.payment.details")}</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">{t("invoice.payment.daily_rate")}</th>
                <th className="text-left p-3 border">{t("invoice.payment.days")}</th>
                <th className="text-right p-3 border">{t("invoice.payment.subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">
                  {car.dailyPrice} {t("invoice.payment.currency")}
                </td>
                <td className="p-3 border">
                  {days}
                </td>
                <td className="p-3 border text-right">
                  {subtotal} {t("invoice.payment.currency")}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={2} className="p-3 border text-right font-semibold">
                  {t("invoice.payment.subtotal")}
                </td>
                <td className="p-3 border text-right">
                  {subtotal} {t("invoice.payment.currency")}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-3 border text-right font-semibold">
                  {t("invoice.payment.tax")}
                </td>
                <td className="p-3 border text-right">
                  {taxAmount.toFixed(2)} {t("invoice.payment.currency")}
                </td>
              </tr>
              <tr className="bg-primary/5">
                <td colSpan={2} className="p-3 border text-right font-bold text-lg">
                  {t("invoice.payment.total")}
                </td>
                <td className="p-3 border text-right font-bold text-lg text-primary">
                  {total.toFixed(2)} {t("invoice.payment.currency")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center">
          <p className="text-gray-600 mb-2">{t("invoice.footer.text")}</p>
          <p className="text-gray-400 text-sm">{t("invoice.footer.terms")}</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;

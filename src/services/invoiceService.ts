import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Car } from '@/types/car';
import { User } from '@/types/auth';

/**
 * Interface for invoice data
 */
export interface InvoiceData {
  bookingId: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: Car;
  user: User;
}

/**
 * Options for generating a PDF invoice
 */
export interface InvoiceOptions {
  filename?: string;
  format?: string;
  orientation?: 'portrait' | 'landscape';
  unit?: string;
}

/**
 * Generate a PDF invoice from a React ref
 *
 * @param targetRef - React ref to the component to convert to PDF
 * @param options - PDF generation options
 * @returns Promise that resolves when the PDF is generated
 */
export const generateInvoicePDF = async (
  targetRef: React.RefObject<HTMLElement>,
  options?: InvoiceOptions
): Promise<void> => {
  try {
    if (!targetRef.current) {
      throw new Error('Target element not found');
    }

    const defaultOptions = {
      filename: 'invoice.pdf',
      format: 'a4',
      orientation: 'portrait' as const,
      unit: 'mm',
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    // Create canvas from the DOM element
    const canvas = await html2canvas(targetRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions based on orientation
    const isPortrait = mergedOptions.orientation === 'portrait';
    const imgWidth = isPortrait ? 210 : 297; // A4 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;

    // Create PDF
    const pdf = new jsPDF(
      mergedOptions.orientation,
      mergedOptions.unit,
      mergedOptions.format
    );

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save PDF
    pdf.save(mergedOptions.filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Format a booking ID for display
 *
 * @param bookingId - The booking ID to format
 * @returns Formatted booking ID
 */
export const formatBookingId = (bookingId: string): string => {
  // If the booking ID already has a prefix, return it as is
  if (bookingId.includes('-')) {
    return bookingId.toUpperCase();
  }

  // Otherwise, add a prefix
  return `INV-${bookingId}`.toUpperCase();
};

/**
 * Calculate the number of days between two dates
 *
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Number of days
 */
export const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Calculate the total price with tax
 *
 * @param dailyPrice - Daily price
 * @param days - Number of days
 * @param taxRate - Tax rate (default: 0.15 for 15%)
 * @returns Total price with tax
 */
export const calculateTotalWithTax = (
  dailyPrice: number,
  days: number,
  taxRate: number = 0.15
): { subtotal: number; tax: number; total: number } => {
  const subtotal = dailyPrice * days;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
  };
};

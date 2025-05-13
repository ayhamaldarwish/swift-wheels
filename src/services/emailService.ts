import emailjs from '@emailjs/browser';

// EmailJS configuration
// These would typically come from environment variables in a real application
const SERVICE_ID = "service_example"; // Replace with your EmailJS service ID
const TEMPLATE_ID = "template_example"; // Replace with your EmailJS template ID
const PUBLIC_KEY = "your_public_key"; // Replace with your EmailJS public key

/**
 * Interface for booking email data
 */
export interface BookingEmailData {
  userEmail: string;
  userName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  bookingId: string;
  currency?: string;
}

/**
 * Sends a booking confirmation email using EmailJS
 * 
 * @param data Booking data to include in the email
 * @returns Promise that resolves when the email is sent
 */
export const sendBookingConfirmationEmail = async (data: BookingEmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Prepare template parameters
    const templateParams = {
      to_email: data.userEmail,
      to_name: data.userName,
      booking_id: data.bookingId,
      car_name: data.carName,
      start_date: data.startDate,
      end_date: data.endDate,
      total_price: `${data.totalPrice} ${data.currency || 'SAR'}`,
      booking_url: `${window.location.origin}/dashboard`,
    };

    // Send the email
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true, message: 'Email sent successfully' };
    } else {
      console.error('EmailJS response:', response);
      return { success: false, message: 'Failed to send email' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
  }
};

/**
 * Initialize EmailJS
 * Call this function once when the application starts
 */
export const initEmailJS = (): void => {
  emailjs.init(PUBLIC_KEY);
};

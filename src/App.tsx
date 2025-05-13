
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { BannerProvider } from "@/contexts/BannerContext";
import AppRoutes from "@/components/AppRoutes";
import BookingExpirationChecker from "@/components/BookingExpirationChecker";
import ChatBot from "@/components/chat/ChatBot";
import ErrorBoundary from "@/components/ErrorBoundary";
import WhatsAppButton from "@/components/WhatsAppButton";

/**
 * Create a new QueryClient instance for React Query
 */
const queryClient = new QueryClient();

/**
 * Main App component
 *
 * Sets up the application providers and main structure
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <CompareProvider>
                <BannerProvider>
                  {/* Toast notifications */}
                  <Toaster />
                  <Sonner />

                  {/* Booking expiration checker */}
                  <BookingExpirationChecker />

                  {/* Router setup */}
                  <BrowserRouter>
                    <ErrorBoundary>
                      <AppRoutes />
                      <ChatBot />
                      <WhatsAppButton phoneNumber="966123456789" />
                    </ErrorBoundary>
                  </BrowserRouter>
                </BannerProvider>
              </CompareProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

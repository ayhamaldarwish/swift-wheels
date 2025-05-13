import React, { useEffect, useState } from "react";
import { CheckCircle, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SuccessNotificationProps {
  /**
   * Title of the notification
   */
  title: string;

  /**
   * Description or message of the notification
   */
  message: string;

  /**
   * Whether the notification is visible
   * @default false
   */
  open?: boolean;

  /**
   * Callback when the notification is closed
   */
  onClose?: () => void;

  /**
   * Auto-close duration in milliseconds
   * @default 5000 (5 seconds)
   */
  duration?: number;

  /**
   * Optional action button text
   */
  actionText?: string;

  /**
   * Optional action button callback
   */
  onAction?: () => void;

  /**
   * Optional invoice button text
   */
  invoiceText?: string;

  /**
   * Optional invoice button callback
   */
  onInvoice?: () => void;

  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * SuccessNotification component
 *
 * Displays a success notification with optional action button
 */
export function SuccessNotification({
  title,
  message,
  open = false,
  onClose,
  duration = 5000,
  actionText,
  onAction,
  invoiceText,
  onInvoice,
  className,
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(open);

  // Handle open state changes
  useEffect(() => {
    setIsVisible(open);

    // Auto-close timer
    let timer: NodeJS.Timeout;
    if (open && duration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, duration, onClose]);

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // If not visible, don't render
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md bg-card text-card-foreground rounded-lg shadow-lg border border-green-200 dark:border-green-900 p-4 transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {actionText && onAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAction();
                  handleClose();
                }}
                className="text-sm text-primary hover:text-primary-foreground hover:bg-primary"
              >
                {actionText}
              </Button>
            )}
            {invoiceText && onInvoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onInvoice();
                }}
                className="text-sm flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
              >
                <FileText className="h-4 w-4" />
                {invoiceText}
              </Button>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-card rounded-md inline-flex text-muted-foreground hover:text-foreground focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

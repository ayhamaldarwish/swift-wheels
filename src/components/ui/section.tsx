import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  background?: "default" | "card" | "muted" | "primary" | "secondary";
  spacing?: "default" | "compact" | "none";
}

/**
 * Section component
 * 
 * A consistent section layout with standardized spacing and structure
 */
const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
  headerClassName,
  background = "default",
  spacing = "default",
  ...props
}) => {
  // Map background values to Tailwind classes
  const backgroundClasses = {
    default: "bg-background",
    card: "bg-card",
    muted: "bg-muted",
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
  };

  // Map spacing values to Tailwind classes
  const spacingClasses = {
    default: "py-16",
    compact: "py-8",
    none: "",
  };

  return (
    <section
      className={cn(
        backgroundClasses[background],
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        {(title || action) && (
          <div className={cn("flex justify-between items-center mb-8", headerClassName)}>
            {title && (
              <div>
                <h2 className="text-3xl font-bold">{title}</h2>
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
              </div>
            )}
            {action && <div>{action}</div>}
          </div>
        )}
        <div className={cn(contentClassName)}>{children}</div>
      </div>
    </section>
  );
};

export { Section };

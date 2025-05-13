import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  /**
   * Size of the loader
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  
  /**
   * Color variant of the loader
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "accent" | "white";
  
  /**
   * Optional text to display below the loader
   */
  text?: string;
  
  /**
   * Optional className to apply to the container
   */
  className?: string;
  
  /**
   * Whether to show the loader fullscreen with overlay
   * @default false
   */
  fullScreen?: boolean;
}

/**
 * Loader component
 * 
 * Displays a loading spinner with optional text
 */
export function Loader({
  size = "default",
  variant = "primary",
  text,
  className,
  fullScreen = false,
}: LoaderProps) {
  // Size classes
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    default: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };
  
  // Color classes
  const variantClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    accent: "border-accent border-t-transparent",
    white: "border-white border-t-transparent",
  };
  
  // Container for fullscreen mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={cn(
              "rounded-full animate-spin",
              sizeClasses[size],
              variantClasses[variant],
              className
            )}
          />
          {text && <p className="text-foreground font-medium">{text}</p>}
        </div>
      </div>
    );
  }
  
  // Regular loader
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && <p className="text-foreground text-sm mt-2">{text}</p>}
    </div>
  );
}

/**
 * PageTransition component
 * 
 * Displays a fullscreen loader during page transitions
 */
export function PageTransition({ text }: { text?: string }) {
  return (
    <Loader
      fullScreen
      size="lg"
      variant="primary"
      text={text}
    />
  );
}

/**
 * ButtonLoader component
 * 
 * Small loader to be used inside buttons
 */
export function ButtonLoader({ className }: { className?: string }) {
  return (
    <Loader
      size="sm"
      variant="white"
      className={className}
    />
  );
}

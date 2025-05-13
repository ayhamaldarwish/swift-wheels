import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  /**
   * Maximum rating value
   * @default 5
   */
  max?: number;

  /**
   * Current rating value
   * @default 0
   */
  value?: number;

  /**
   * Whether the rating is read-only
   * @default false
   */
  readOnly?: boolean;

  /**
   * Size of the stars
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Color of the filled stars
   * @default "text-yellow-400"
   */
  color?: string;

  /**
   * Callback when rating changes
   */
  onChange?: (value: number) => void;

  /**
   * Optional className to apply to the container
   */
  className?: string;

  /**
   * Optional label to display next to the stars
   */
  label?: string;
}

/**
 * Rating component
 *
 * Displays a star rating that can be interactive or read-only
 */
export function Rating({
  max = 5,
  value = 0,
  readOnly = false,
  size = "md",
  color = "text-yellow-400",
  onChange,
  className,
  label,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);

  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Handle mouse enter on star
  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  // Handle click on star
  const handleClick = (index: number) => {
    if (readOnly) return;

    // Animate the clicked star
    setAnimateIndex(index);
    setTimeout(() => setAnimateIndex(null), 300);

    // If clicking the same star twice, remove the rating
    const newValue = value === index ? 0 : index;
    onChange?.(newValue);
  };

  // Determine if a star should be filled
  const isFilled = (index: number) => {
    if (hoverValue !== null) {
      return index <= hoverValue;
    }
    return index <= value;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {label && (
        <span className="text-sm text-muted-foreground mr-2">{label}</span>
      )}
      <div className="flex">
        {Array.from({ length: max }).map((_, index) => {
          const starIndex = index + 1;
          return (
            <button
              key={starIndex}
              type="button"
              className={cn(
                "focus:outline-none transition-transform",
                readOnly ? "cursor-default" : "cursor-pointer",
                animateIndex === starIndex && "animate-ping scale-125",
              )}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(starIndex)}
              disabled={readOnly}
              aria-label={`Rate ${starIndex} out of ${max}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled(starIndex)
                    ? color
                    : "text-muted-foreground/30",
                  isFilled(starIndex) && "fill-current"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ReadOnlyRating component
 *
 * A simplified version of Rating that is always read-only
 */
export function ReadOnlyRating({
  value = 0,
  max = 5,
  size = "sm",
  color = "text-yellow-400",
  className,
  showValue = false,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  showValue?: boolean;
}) {
  // Size classes
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, index) => {
          const starIndex = index + 1;
          return (
            <Star
              key={starIndex}
              className={cn(
                sizeClasses[size],
                starIndex <= value
                  ? cn(color, "fill-current")
                  : "text-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

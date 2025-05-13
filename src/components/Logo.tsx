import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  className?: string;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  withText = true,
  className,
  textClassName,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <Link to="/" className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <circle cx="50" cy="50" r="50" fill="#3B82F6" />
          <path
            d="M70 30H30C25.5817 30 22 33.5817 22 38V62C22 66.4183 25.5817 70 30 70H70C74.4183 70 78 66.4183 78 62V38C78 33.5817 74.4183 30 70 30Z"
            fill="#1E3A8A"
          />
          <path
            d="M30 40C30 37.7909 31.7909 36 34 36H66C68.2091 36 70 37.7909 70 40V60C70 62.2091 68.2091 64 66 64H34C31.7909 64 30 62.2091 30 60V40Z"
            fill="#FFFFFF"
          />
          <circle cx="35" cy="50" r="8" fill="#3B82F6" />
          <circle cx="65" cy="50" r="8" fill="#3B82F6" />
        </svg>
      </div>
      {withText && (
        <span
          className={cn(
            "font-bold text-primary",
            textSizeClasses[size],
            textClassName
          )}
        >
          <span className="text-secondary">رينت</span>كار
        </span>
      )}
    </Link>
  );
};

export default Logo;

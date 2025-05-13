import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animationType?: "pulse" | "bounce" | "scale" | "shine";
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animationType = "pulse", children, ...props }, ref) => {
    const animationClasses = {
      pulse: "hover:animate-pulse",
      bounce: "hover:animate-bounce",
      scale: "transition-transform hover:scale-105 active:scale-95",
      shine: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shine_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:before:animate-[shine_1.5s_infinite]",
    };

    return (
      <Button
        ref={ref}
        className={cn(animationClasses[animationType], className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

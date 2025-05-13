import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

/**
 * TooltipWrapper component
 * 
 * A wrapper component that adds a tooltip to any element
 * 
 * @param children - The element to wrap with a tooltip
 * @param content - The tooltip content (translation key or direct text)
 * @param side - The side of the element to show the tooltip (default: "top")
 * @param align - The alignment of the tooltip (default: "center")
 * @param delayDuration - The delay before showing the tooltip in ms (default: 300)
 * @param className - Additional classes for the tooltip content
 */
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 300,
  className = "",
}) => {
  const { t, isRTL } = useLanguage();
  
  // Adjust side based on RTL
  const adjustedSide = isRTL
    ? side === "left" 
      ? "right" 
      : side === "right" 
        ? "left" 
        : side
    : side;

  // Check if content is a translation key
  const tooltipContent = content.startsWith("tooltip.") ? t(content) : content;

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side={adjustedSide as "top" | "right" | "bottom" | "left"} 
        align={align}
        className={className}
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;

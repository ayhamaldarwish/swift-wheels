import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  loadingStrategy?: "lazy" | "eager";
  placeholderColor?: string;
  showSkeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * مكون OptimizedImage - يوفر تحميل كسول للصور مع دعم الصور البديلة وتأثيرات التحميل
 */
export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc = "",
      className,
      containerClassName,
      aspectRatio = "aspect-[16/9]",
      loadingStrategy = "lazy",
      placeholderColor = "bg-gray-200",
      showSkeleton = true,
      onLoad: onLoadProp,
      onError: onErrorProp,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(src);

    // إعادة تعيين حالة التحميل عند تغيير مصدر الصورة
    useEffect(() => {
      setIsLoading(true);
      setError(false);
      setImageSrc(src);
    }, [src]);

    // تحويل الصورة إلى WebP إذا كانت الصورة من Unsplash
    const optimizedSrc = React.useMemo(() => {
      if (imageSrc.includes("unsplash.com") && !imageSrc.includes("&fm=webp")) {
        // إضافة معلمات تحسين الصورة لـ Unsplash
        const separator = imageSrc.includes("?") ? "&" : "?";
        return `${imageSrc}${separator}fm=webp&q=80&w=800`;
      }
      return imageSrc;
    }, [imageSrc]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoadProp?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setError(true);
      if (fallbackSrc && !imageSrc.includes(fallbackSrc)) {
        setImageSrc(fallbackSrc);
      }
      onErrorProp?.();
    };

    return (
      <div
        className={cn(
          "relative overflow-hidden",
          aspectRatio,
          placeholderColor,
          containerClassName
        )}
      >
        {isLoading && showSkeleton && (
          <Skeleton className="absolute inset-0 z-10" />
        )}

        <img
          ref={ref}
          src={optimizedSrc}
          alt={alt}
          loading={loadingStrategy}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

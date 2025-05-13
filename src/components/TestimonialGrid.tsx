import React from "react";
import { Testimonial } from "@/components/TestimonialCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialGridProps {
  testimonials: Testimonial[];
  className?: string;
}

/**
 * TestimonialGrid component
 * 
 * Displays testimonials in a responsive grid layout with animations
 */
const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  testimonials,
  className,
}) => {
  const { isRTL } = useLanguage();
  
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-border"
        >
          {/* Quote Icon */}
          <div className="mb-4 text-primary/30">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="opacity-50"
            >
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
            </svg>
          </div>
          
          {/* Testimonial Content */}
          <p className="text-card-foreground leading-relaxed mb-6">{testimonial.content}</p>
          
          {/* Rating */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < testimonial.rating ? "text-yellow-400" : "text-muted-foreground/30"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          
          {/* User Info */}
          <div className="flex items-center">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                {testimonial.name.charAt(0)}
              </div>
            )}
            <div className="ms-4">
              <h4 className="font-bold text-lg">{testimonial.name}</h4>
              {testimonial.role && (
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialGrid;

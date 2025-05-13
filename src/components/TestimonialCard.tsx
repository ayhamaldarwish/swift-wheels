import React from "react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  content: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 ml-4">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg">{testimonial.name}</h4>
          {testimonial.role && (
            <p className="text-muted-foreground text-sm">{testimonial.role}</p>
          )}
        </div>
      </div>

      <div className="flex mb-3">
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

      <p className="text-card-foreground leading-relaxed">{testimonial.content}</p>
    </div>
  );
};

export default TestimonialCard;

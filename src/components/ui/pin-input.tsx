import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  /**
   * Number of digits in the PIN
   * @default 4
   */
  length?: number;
  
  /**
   * Callback function when PIN is complete
   */
  onComplete?: (pin: string) => void;
  
  /**
   * Callback function when PIN changes
   */
  onChange?: (pin: string) => void;
  
  /**
   * Whether to mask the PIN with dots
   * @default false
   */
  mask?: boolean;
  
  /**
   * Whether to auto focus the first input on mount
   * @default true
   */
  autoFocus?: boolean;
  
  /**
   * Additional CSS class for the container
   */
  className?: string;
  
  /**
   * Additional CSS class for each input
   */
  inputClassName?: string;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * PinInput component
 * 
 * A component for entering PIN codes with individual input fields for each digit
 */
const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onComplete,
  onChange,
  mask = false,
  autoFocus = true,
  className,
  inputClassName,
  disabled = false,
  error,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);
  
  // Auto focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);
  
  // Handle value change
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update values
    const newValues = [...values];
    newValues[index] = value.slice(-1); // Only take the last character
    setValues(newValues);
    
    // Call onChange callback
    if (onChange) {
      onChange(newValues.join(""));
    }
    
    // Move focus to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Call onComplete callback if all values are filled
    if (newValues.every(v => v) && onComplete) {
      onComplete(newValues.join(""));
    }
  };
  
  // Handle key down
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Move focus to next input on right arrow
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Move focus to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Only allow digits
    if (!/^\d*$/.test(pastedData)) return;
    
    // Fill values from pasted data
    const newValues = [...values];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newValues[i] = pastedData[i];
    }
    
    setValues(newValues);
    
    // Call onChange callback
    if (onChange) {
      onChange(newValues.join(""));
    }
    
    // Call onComplete callback if all values are filled
    if (newValues.every(v => v) && onComplete) {
      onComplete(newValues.join(""));
    }
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newValues.findIndex(v => !v);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };
  
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={el => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={values[index]}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-14 text-center text-2xl font-bold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              "transition-all duration-200",
              error ? "border-destructive focus:ring-destructive" : "border-input",
              disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background",
              inputClassName
            )}
            aria-label={`PIN digit ${index + 1}`}
            autoComplete="off"
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default PinInput;

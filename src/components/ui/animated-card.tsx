import React, { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface AnimatedCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  layoutId?: string;
}

/**
 * AnimatedCard component that wraps content with Framer Motion animations
 * 
 * @param children - The content to be wrapped
 * @param className - Additional CSS classes
 * @param whileHover - Animation properties when hovering
 * @param whileTap - Animation properties when tapping/clicking
 * @param initial - Initial animation state
 * @param animate - Animation state to animate to
 * @param exit - Animation state when component is removed
 * @param transition - Animation transition properties
 * @param layoutId - Unique ID for shared layout animations
 * @param props - Additional motion props
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  whileHover = { scale: 1.03, y: -5 },
  whileTap = { scale: 0.98 },
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: 20 },
  transition = { 
    duration: 0.3,
    type: "spring",
    stiffness: 500,
    damping: 30
  },
  layoutId,
  ...props
}) => {
  return (
    <motion.div
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      layoutId={layoutId}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedContainer component for page-level animations
 */
export const AnimatedContainer: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { duration: 0.5 },
  ...props
}) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered children animation container
 */
export const StaggerContainer: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { staggerChildren: 0.1 },
  ...props
}) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered item for use within StaggerContainer
 */
export const StaggerItem: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: 20 },
  transition = { duration: 0.3 },
  ...props
}) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

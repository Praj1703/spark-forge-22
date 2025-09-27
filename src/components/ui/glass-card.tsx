import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  "backdrop-blur-glass border border-glass-border shadow-glass transition-smooth",
  {
    variants: {
      variant: {
        default: "bg-gradient-glass",
        solid: "bg-card",
        transparent: "bg-glass",
      },
      size: {
        sm: "p-4 rounded-lg",
        default: "p-6 rounded-xl",
        lg: "p-8 rounded-2xl",
      },
      hover: {
        none: "",
        lift: "hover:shadow-glass-hover hover:-translate-y-1",
        glow: "hover:shadow-glass-hover hover:border-primary/20",
        scale: "hover:scale-[1.02] hover:shadow-glass-hover",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "lift",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, size, hover, className }))}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
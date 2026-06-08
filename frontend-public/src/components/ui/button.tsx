import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px] px-6 py-3",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-white shadow-md hover:opacity-90",
        outline: "border-2 border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent)]/10",
        ghost: "hover:bg-black/5",
        chip: "rounded-full border-2 border-[var(--secondary)]/50 text-[var(--text)] bg-white/70 backdrop-blur-sm shadow-sm hover:border-[var(--accent)]/40",
        chipActive: "rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_16px_rgba(139,154,125,0.4)]",
      },
      size: {
        default: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

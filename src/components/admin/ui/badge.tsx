import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--admin-primary))] text-white hover:bg-[hsl(var(--admin-primary-hover))]",
        secondary:
          "border-transparent bg-[hsl(var(--admin-hover))] text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-border))]",
        destructive:
          "border-transparent bg-[hsl(var(--admin-danger))] text-white hover:bg-[hsl(var(--admin-danger))]/90",
        outline:
          "border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))]",
        success:
          "border-transparent bg-[hsl(var(--admin-success))] text-white hover:bg-[hsl(var(--admin-success))]/90",
        warning:
          "border-transparent bg-[hsl(var(--admin-warning))] text-white hover:bg-[hsl(var(--admin-warning))]/90",
        info: "border-transparent bg-[hsl(var(--admin-info))] text-white hover:bg-[hsl(var(--admin-info))]/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border-2 p-4 text-sm [&>svg~div]:translate-y-[-1px] [&>svg+div]:mt-0 [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:mr-3 flex items-start shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))]",
        info: "border-[hsl(var(--admin-info))]/50 text-[hsl(var(--admin-info))] bg-[hsl(var(--admin-info))]/10 [&>svg]:text-[hsl(var(--admin-info))]",
        success:
          "border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))] bg-[hsl(var(--admin-success))]/10 [&>svg]:text-[hsl(var(--admin-success))]",
        warning:
          "border-[hsl(var(--admin-warning))]/50 text-[hsl(var(--admin-warning))] bg-[hsl(var(--admin-warning))]/10 [&>svg]:text-[hsl(var(--admin-warning))]",
        destructive:
          "border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))] bg-[hsl(var(--admin-danger))]/10 [&>svg]:text-[hsl(var(--admin-danger))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        pending: "bg-blue-600 text-white hover:bg-blue-500",
        cancelled: "bg-red-600 text-white hover:bg-red-500",
        secondary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        pink: "bg-pink-500 text-white hover:bg-pink-400",
        purple: "bg-purple-500 text-white hover:bg-purple-400",
        violet: "bg-violet-500 text-white hover:bg-violet-400",
        indigo: "bg-indigo-500 text-white hover:bg-indigo-400",
        pinkLight: "bg-pink-100 text-pink-800 hover:bg-pink-50",
        purpleLight: "bg-purple-100 text-purple-800 hover:bg-purple-50",
        violetLight: "bg-violet-100 text-violet-800 hover:bg-violet-50",
        indigoLight: "bg-indigo-100 text-indigo-800 hover:bg-indigo-50",
        lightOrange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        brightRed: "bg-red-500 text-white hover:bg-red-400", 
        deepRed: "bg-red-700 text-white hover:bg-red-600",   
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };

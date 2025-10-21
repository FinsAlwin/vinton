import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: "blue" | "green" | "orange" | "red" | "purple";
  className?: string;
}

const iconColorClasses = {
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
  orange: "bg-orange-500/10 text-orange-500",
  red: "bg-red-500/10 text-red-500",
  purple: "bg-purple-500/10 text-purple-500",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconColor = "blue",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "admin-card admin-card-hover p-6 admin-transition shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium admin-text-secondary mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold admin-text mb-2">{value}</h3>
          {description && (
            <p className="text-xs admin-text-muted">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.value}%
              </span>
              <span className="text-xs admin-text-muted ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            iconColorClasses[iconColor]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyStatsProps {
  target: number;
  revenue: number;
  today: number;
  currency?: string;
}

export function MonthlyStats({
  target,
  revenue,
  today,
  currency = "$",
}: MonthlyStatsProps) {
  const targetPercentage = (revenue / target) * 100;
  const isOverTarget = revenue >= target;

  return (
    <Card hover="lift" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white pb-16">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5" />
          Monthly Target
        </CardTitle>
        <p className="text-sm text-blue-100 mt-2">
          Target you&apos;ve set for this month
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Target Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm admin-text-secondary">Progress</span>
            <span
              className={cn(
                "text-sm font-semibold",
                isOverTarget ? "text-green-500" : "admin-primary-text"
              )}
            >
              {targetPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isOverTarget
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
              )}
              style={{ width: `${Math.min(targetPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg admin-card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 admin-text-secondary" />
              <span className="text-xs admin-text-secondary">Target</span>
            </div>
            <p className="text-xl font-bold admin-text">
              {currency}
              {target.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-lg admin-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 admin-text-secondary" />
              <span className="text-xs admin-text-secondary">Revenue</span>
            </div>
            <p className="text-xl font-bold admin-text">
              {currency}
              {revenue.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-lg admin-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 admin-text-secondary" />
              <span className="text-xs admin-text-secondary">Today</span>
            </div>
            <p className="text-xl font-bold admin-text">
              {currency}
              {today.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Message */}
        {isOverTarget && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Congratulations! You&apos;ve exceeded your monthly target. Keep up
              the great work!
            </p>
          </div>
        )}
        {!isOverTarget && targetPercentage >= 80 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You&apos;re almost there! Just {currency}
              {(target - revenue).toLocaleString()} away from your target.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

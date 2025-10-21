import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
  className,
  actions,
}: ChartCardProps) {
  return (
    <Card className={cn("admin-card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold admin-text">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm admin-text-muted mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Simple Line Chart Placeholder
interface LineChartProps {
  data: number[];
  height?: number;
  color?: string;
}

export function SimpleLineChart({
  data,
  height = 200,
  color = "hsl(var(--admin-primary))",
}: LineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((max - value) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Grid lines */}
        <line
          x1="0"
          y1="25"
          x2="100"
          y2="25"
          stroke="hsl(var(--admin-border))"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="hsl(var(--admin-border))"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="75"
          x2="100"
          y2="75"
          stroke="hsl(var(--admin-border))"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Area under the line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={color}
          fillOpacity="0.1"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Simple Bar Chart Placeholder
interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function SimpleBarChart({
  data,
  height = 200,
  color = "hsl(var(--admin-primary))",
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative" style={{ height: "100%" }}>
              <div
                className="absolute bottom-0 w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(item.value / max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-xs admin-text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple Donut Chart Placeholder
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function SimpleDonutChart({ data, size = 200 }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    };
  });

  const radius = 40;
  const innerRadius = 28;
  const centerX = 50;
  const centerY = 50;

  const getPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, endAngle);
    const startInner = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );
    const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${endInner.x} ${endInner.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}
      Z
    `;
  };

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={getPath(segment.startAngle, segment.endAngle)}
            fill={segment.color}
            className="transition-opacity hover:opacity-80"
          />
        ))}
      </svg>
      <div className="flex-1 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm admin-text flex-1">{item.label}</span>
            <span className="text-sm font-medium admin-text">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

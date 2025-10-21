"use client";

import * as React from "react";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used within ToasterProvider");
  return ctx;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = `t_${++idRef.current}`;
    const next: Toast = { id, duration: 3000, variant: "default", ...toast };
    setToasts((prev) => [...prev, next]);
    if (next.duration && next.duration > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, next.duration);
    }
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => setToasts([]), []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, addToast, dismiss, dismissAll }),
    [toasts, addToast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

const variantClasses: Record<ToastVariant, string> = {
  default:
    "border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-card))] text-[hsl(var(--admin-text-primary))]",
  destructive:
    "border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))] bg-[hsl(var(--admin-danger))]/10",
  success:
    "border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))] bg-[hsl(var(--admin-success))]/10",
  warning:
    "border-[hsl(var(--admin-warning))]/50 text-[hsl(var(--admin-warning))] bg-[hsl(var(--admin-warning))]/10",
  info: "border-[hsl(var(--admin-info))]/50 text-[hsl(var(--admin-info))] bg-[hsl(var(--admin-info))]/10",
};

function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToastContext();
  const variant = toast.variant ?? "default";

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-2 p-4 shadow-xl backdrop-blur-sm animate-in slide-in-from-right-full",
        variantClasses[variant]
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {toast.title ? (
            <div className="text-sm font-semibold leading-none mb-1">
              {toast.title}
            </div>
          ) : null}
          {toast.description ? (
            <div className="mt-1 text-sm opacity-90">{toast.description}</div>
          ) : null}
        </div>
        {toast.action}
        <button
          type="button"
          className="ml-2 inline-flex rounded-md p-1.5 opacity-70 hover:opacity-100 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--admin-primary))] transition-all"
          aria-label="Dismiss"
          onClick={() => dismiss(toast.id)}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToastContext();
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
      <div className="ml-auto mt-auto flex w-full flex-col items-end gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </div>
  );
}

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
  default: "border bg-background text-foreground",
  destructive: "border-destructive/50 text-destructive bg-destructive/10",
  success:
    "border-[hsl(var(--success))] text-[hsl(var(--success-foreground))] bg-[hsl(var(--success))]/10",
  warning:
    "border-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] bg-[hsl(var(--warning))]/10",
  info: "border-primary text-primary-foreground bg-primary/10",
};

function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToastContext();
  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-md border p-4 shadow-lg ring-1 ring-black/5",
        variantClasses[toast.variant ?? "default"]
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {toast.title ? (
            <div className="text-sm font-medium leading-none">
              {toast.title}
            </div>
          ) : null}
          {toast.description ? (
            <div className="mt-1 text-sm text-muted-foreground">
              {toast.description}
            </div>
          ) : null}
        </div>
        {toast.action}
        <button
          type="button"
          className="ml-2 inline-flex rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Dismiss"
          onClick={() => dismiss(toast.id)}
        >
          ×
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

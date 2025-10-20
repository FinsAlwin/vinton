"use client";

import { useToastContext } from "./toast";

type ToastInput = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
};

export function useToast() {
  const { addToast, dismiss, dismissAll } = useToastContext();

  function toast(input: ToastInput) {
    return addToast({ ...input });
  }

  return { toast, dismiss, dismissAll };
}

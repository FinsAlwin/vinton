"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceName?: string;
  confirmationText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  resourceName = "this item",
  confirmationText,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleConfirm() {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[hsl(var(--admin-text-primary))] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--admin-danger))]/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[hsl(var(--admin-danger))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span>Confirm Deletion</span>
          </DialogTitle>
          <DialogDescription className="text-[hsl(var(--admin-text-secondary))] pt-2">
            {confirmationText ?? (
              <>
                Are you sure you want to delete <strong>{resourceName}</strong>?
                This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-hover))] hover:border-[hsl(var(--admin-primary))]"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            aria-label="Confirm delete"
            className="bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/90 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

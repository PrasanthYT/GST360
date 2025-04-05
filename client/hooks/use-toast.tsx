"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { ToastNotification } from "@/components/ui/toast-notification"

export type ToastVariant = "default" | "success" | "info" | "warning" | "destructive"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: React.ReactNode
  icon?: React.ReactNode
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = uuidv4()
    const newToast = { id, ...props }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss
    if (props.duration !== 0) {
      setTimeout(() => {
        dismiss(id)
      }, props.duration || 5000)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // Render the toasts
  const Toasts = useCallback(() => {
    return (
      <>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            open={true}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id)
            }}
            title={toast.title}
            description={toast.description}
            variant={toast.variant || "default"}
            duration={toast.duration}
            position={toast.position || "bottom-right"}
            icon={toast.icon}
            action={toast.action}
          />
        ))}
      </>
    )
  }, [toasts, dismiss])

  return {
    toast,
    dismiss,
    dismissAll,
    Toasts,
  }
}


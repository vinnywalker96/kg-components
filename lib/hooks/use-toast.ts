
import { useToast as useToastUI } from "@/components/ui/use-toast"

import { useState, useEffect } from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    toasts.forEach((toast) => {
      if (toast.duration !== Infinity) {
        const timer = setTimeout(() => {
          setToasts((prevToasts) =>
            prevToasts.filter((t) => t.id !== toast.id)
          )
        }, toast.duration || 5000)

        timers.push(timer)
      }
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  const toast = (options: ToastOptions) => {
    const id = crypto.randomUUID()
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      type: options.type || "default",
      duration: options.duration || 5000,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    return id
  }

  const dismiss = (toastId: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toastId))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}


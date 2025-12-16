import { ref } from 'vue'

type ToastVariant = 'default' | 'destructive'

export interface ToastItem {
  id: number
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

const toasts = ref<ToastItem[]>([])

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function addToast(payload: Omit<ToastItem, 'id'>) {
  const id = Date.now()
  const toast: ToastItem = {
    id,
    duration: 2800,
    ...payload,
  }
  toasts.value = [...toasts.value, toast]
  const duration = toast.duration ?? 2800
  if (duration > 0) {
    window.setTimeout(() => removeToast(id), duration)
  }
  return id
}

export function useToast() {
  return {
    toasts,
    addToast,
    removeToast,
    success(description: string, title = '操作成功') {
      return addToast({ title, description, variant: 'default' })
    },
    error(description: string, title = '操作失败') {
      return addToast({ title, description, variant: 'destructive' })
    },
  }
}

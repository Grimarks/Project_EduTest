// hooks/use-toast.jsx
import * as React from "react"
import { create } from "zustand"

const useToastStore = create((set) => ({
    toasts: [],
    addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
    })),
}))

export function useToast() {
    return useToastStore()
}

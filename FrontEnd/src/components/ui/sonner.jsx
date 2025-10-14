"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                classNames: {
                    toast: "bg-background text-foreground border border-border shadow-lg rounded-md p-4 flex items-center gap-3",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm font-medium hover:opacity-90",
                    cancelButton: "bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm font-medium hover:opacity-90",
                },
            }}
        />
    )
}

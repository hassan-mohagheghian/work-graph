"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      closeButton
      position="bottom-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-lg !border !shadow-lg !font-sans",
          title: "!text-sm !font-semibold",
          description: "!text-sm !opacity-90",
          success: "!border-l-4 !border-l-emerald-500",
          error: "!border-l-4 !border-l-red-500",
          warning: "!border-l-4 !border-l-amber-500",
          info: "!border-l-4 !border-l-sky-500",
          closeButton:
            "!border-border !bg-background !text-foreground hover:!bg-muted",
        },
      }}
      {...props}
    />
  );
}

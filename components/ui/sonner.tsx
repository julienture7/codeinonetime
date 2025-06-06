
import * as React from 'react';
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Using direct Tailwind classes for better CDN compatibility
  // These assume a dark theme context as per your body tag and globals.
  return (
    <Sonner
      theme="dark" 
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-background dark:group-[.toaster]:text-foreground dark:group-[.toaster]:border-border",
          description: "group-[.toast]:text-zinc-400 dark:group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-indigo-600 group-[.toast]:text-white dark:group-[.toast]:bg-primary dark:group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-zinc-700 group-[.toast]:text-zinc-300 dark:group-[.toast]:bg-muted dark:group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

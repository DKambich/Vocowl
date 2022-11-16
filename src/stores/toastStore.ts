import { writable } from "svelte/store";
import type { ToastOptions } from "../types";

export const toasts = writable<ToastOptions[]>([
  {
    message: "test",
    type: "info",
  },
]);

export const dismissToast = (id) => {
  toasts.update((all) => all.filter((toast) => toast.id !== id));
};

export const showToast = (toastProps: ToastOptions) => {
  const id = Math.random().toString(16).slice(2);

  // Setup some sensible defaults for a toast.
  const defaultOptions: ToastOptions = {
    id,
    type: "info",
    dismissible: true,
    timeout: 5000,
    message: id,
  };

  // Push the toast to the top of the list of toasts
  const toast: ToastOptions = { ...defaultOptions, ...toastProps };
  toasts.update((all) => [...all, toast]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

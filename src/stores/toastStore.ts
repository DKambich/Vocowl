import { writable } from "svelte/store";
import type { ToastOptions } from "../types";
import { GUID } from "../utilities";

export const toasts = writable<ToastOptions[]>([]);

const defaultOptions: ToastOptions = {
  type: "info",
  dismissible: true,
  timeout: 5000,
  message: "",
};

export const dismissToast = (id: string) => {
  toasts.update((all) => all.filter((toast) => toast.id !== id));
};

export const showToast = (toastProps: ToastOptions) => {
  const toastID = GUID();

  // Create and add the toast
  const toast: ToastOptions = { ...defaultOptions, id: toastID, ...toastProps };
  toasts.update((all) => [...all, toast]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) {
    setTimeout(() => dismissToast(toastID), toast.timeout);
  }
};

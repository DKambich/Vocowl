import { writable } from "svelte-local-storage-store";
import { get } from "svelte/store";

// Create default preferences
export const preferences = writable<Preferences>("preferences", {
  useDarkTheme: window.matchMedia("(prefers-color-scheme: dark)").matches,
  restaurants: [],
});

// Set the App theme based on the current preferences
if (get(preferences).useDarkTheme) {
  // Use a dark theme
  document.documentElement.classList.add("dark");
} else {
  // Use a light theme
  document.documentElement.classList.remove("dark");
}

export const toggleTheme = () => {
  // Get the current theme
  const useDarkTheme = get(preferences).useDarkTheme;

  // Toggle the App theme based on the current theme
  if (!useDarkTheme) {
    // Toggle from light to dark
    document.documentElement.classList.add("dark");
  } else {
    // Toggle from dark to light
    document.documentElement.classList.remove("dark");
  }

  // Update Preference Store
  preferences.update((prefs) => ({
    ...prefs,
    useDarkTheme: !useDarkTheme,
  }));
};

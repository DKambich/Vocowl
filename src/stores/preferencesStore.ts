import { writable } from "svelte-local-storage-store";
import { get } from "svelte/store";
import type { Preferences } from "../types";

function isPreferences(obj: any): obj is Preferences {
  return (
    obj.useDarkTheme !== undefined &&
    obj.restaurants !== undefined &&
    obj.location !== undefined
  );
}

const defaultPreferences: Preferences = {
  useDarkTheme: window.matchMedia("(prefers-color-scheme: dark)").matches,
  restaurants: [],
  location: { latlng: null, zipcode: "" },
};

// Create default preferences
export const preferences = writable<Preferences>(
  "preferences",
  defaultPreferences
);

if (!isPreferences(get(preferences))) {
  preferences.update((prefs) => ({
    ...defaultPreferences,
    ...prefs,
  }));
}

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

export const cacheLocation = (
  latlng: google.maps.LatLngLiteral,
  zipcode: string
) => {
  preferences.update((prefs) => ({
    ...prefs,
    location: {
      latlng,
      zipcode,
    },
  }));
};

import { writable } from "svelte-local-storage-store";
import { get } from "svelte/store";
import type { LatLng, LocalStorage, Restaurant } from "../types";

function isPreferences(obj: any): obj is LocalStorage {
  return (
    obj.useDarkTheme !== undefined &&
    obj.restaurants !== undefined &&
    obj.location !== undefined
  );
}

function isRestaurant(obj: any): obj is Restaurant {
  return obj.id !== undefined && obj.name !== undefined;
}

const defaultLocalStorage: LocalStorage = {
  useDarkTheme: window.matchMedia("(prefers-color-scheme: dark)").matches,
  restaurants: [],
  location: { latlng: null, zipcode: "" },
};

// Create default preferences
export const localStorage = writable<LocalStorage>(
  "preferences",
  defaultLocalStorage
);

if (!isPreferences(get(localStorage))) {
  localStorage.update((prefs) => ({
    ...defaultLocalStorage,
    ...prefs,
  }));
}

// Set the App theme based on the current preferences
if (get(localStorage).useDarkTheme) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export const toggleTheme = () => {
  const useDarkTheme = get(localStorage).useDarkTheme;

  // Toggle the App theme based on the current theme
  if (useDarkTheme) {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  // Update Preference Store
  localStorage.update((prefs) => ({
    ...prefs,
    useDarkTheme: !useDarkTheme,
  }));
};

export const cacheLocation = (latlng: LatLng, zipcode: string) => {
  localStorage.update((prefs) => ({
    ...prefs,
    location: {
      latlng,
      zipcode,
    },
  }));
};

export const addRestaurant = (restaurant: Restaurant) => {
  localStorage.update((prefs) => ({
    ...prefs,
    restaurants: [...prefs.restaurants, restaurant],
  }));
};

export const removeRestaurant = (restaurant: string | Restaurant) => {
  let restaurantID: string;
  if (isRestaurant(restaurant)) {
    restaurantID = restaurant.id;
  } else {
    restaurantID = restaurant;
  }

  localStorage.update((prefs) => ({
    ...prefs,
    restaurants: prefs.restaurants.filter(
      (restaurant) => restaurant.id !== restaurantID
    ),
  }));
};

import { writable } from "svelte/store";

export const theme = writable("light");

export const toggleTheme = () => {
  // Update Theme Store
  theme.update((storeTheme) => (storeTheme === "light" ? "dark" : "light"));

  //  Check if local storage has a theme preference saved
  const localTheme = localStorage.getItem("color-theme");
  if (localTheme) {
    // Set app theme according to saved local theme
    if (localTheme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save the new theme
    const toggledTheme = localTheme === "light" ? "dark" : "light";
    localStorage.setItem("color-theme", toggledTheme);
  } else {
    // if theme is not in local storage previously, update theme based on class list
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
};

// Initial theme logic when app loads
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  // Use a dark theme if stored by local storage or if not stored and user prefers dark theme
  document.documentElement.classList.add("dark");
  theme.set("dark");
} else {
  // Otherwise use a light theme
  document.documentElement.classList.remove("dark");
  theme.set("light");
}

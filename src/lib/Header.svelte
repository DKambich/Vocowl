<script lang="ts">
  // Module Imports
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Tooltip,
  } from "flowbite-svelte";
  import { Moon, Sun } from "svelte-heros-v2";

  // Local Imports
  import { theme, toggleTheme } from "../stores/themeStore";
  import Vocowl from "./Vocowl.svelte";

  // Listen for changes in theme to update styles accordingly
  let isDarkMode;
  theme.subscribe((value) => {
    isDarkMode = value === "dark";
  });
</script>

<Navbar let:hidden let:toggle color={isDarkMode ? "dark" : "indigo"}>
  <!-- Vocowl Logo and Title -->
  <NavBrand href="./">
    <div class="mx-3 dark:text-white">
      <Vocowl size={28} />
    </div>
    <span class="text-xl font-semibold dark:text-white">Vocowl</span>
  </NavBrand>
  <!-- Hamburger Menu Icon displayed on small screens -->
  <NavHamburger on:click={toggle} />
  <!-- List of Navigation Links -->
  <NavUl {hidden}>
    <NavLi href="./">Home</NavLi>
    <NavLi href="./about">About</NavLi>
    <NavLi href="./select">Select</NavLi>
    <!-- Theme Toggle Button -->
    <NavLi on:click={toggleTheme}>
      <div class="cursor-pointer flex items-center gap-x-2">
        <span class="md:hidden">Toggle Theme</span>
        {#if isDarkMode}
          <Moon size="21" />
        {:else}
          <Sun size="21" />
        {/if}
      </div>
    </NavLi>
  </NavUl>
</Navbar>

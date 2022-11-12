<script lang="ts">
  // Module Imports
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
  } from "flowbite-svelte";
  import { Moon, Sun } from "svelte-heros-v2";
  import { location } from "svelte-spa-router";
  import { ABOUT_ROUTE, HOME_ROUTE, SEARCH_ROUTE } from "../constants";

  // Local Imports
  import { theme, toggleTheme } from "../stores/themeStore";
  import { Vocowl } from "./";

  // Listen for changes in theme to update styles accordingly
  let isDarkMode = false;
  $: isDarkMode = $theme == "dark";

  let currentPage = $location;
</script>

<Navbar let:hidden let:toggle color={isDarkMode ? "dark" : "indigo"}>
  <!-- Vocowl Logo and Title -->
  <NavBrand href="./">
    <div class="mr-3 dark:text-white">
      <Vocowl size={28} />
    </div>
    <span class="text-xl font-semibold dark:text-white">Vocowl</span>
  </NavBrand>
  <!-- Hamburger Menu Icon displayed on small screens -->
  <NavHamburger on:click={toggle} />
  <!-- List of Navigation Links -->
  <NavUl {hidden}>
    <NavLi href={`#${HOME_ROUTE}`} active={currentPage == HOME_ROUTE}>
      Home
    </NavLi>
    <NavLi href={`#${ABOUT_ROUTE}`} active={currentPage == ABOUT_ROUTE}>
      About
    </NavLi>
    <NavLi href={`#${SEARCH_ROUTE}`} active={currentPage == SEARCH_ROUTE}>
      Search
    </NavLi>
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

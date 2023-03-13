<script lang="ts">
  // Module Imports
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
  } from "flowbite-svelte";
  import {
    BuildingStorefront,
    Home,
    Megaphone,
    Moon,
    Sun,
  } from "svelte-heros-v2";
  import { location } from "svelte-spa-router";
  import {
    HOME_ROUTE,
    RESTAURANT_ROUTE,
    DECIDE_ROUTE,
    NAVLI_INACTIVE_CLASS,
    NAVLI_ACTIVE_CLASS,
  } from "../../constants";

  // Local Imports
  import { preferences, toggleTheme } from "../../stores/preferencesStore";
  import { Vocowl } from "../shared";

  let currentPage = $location;
</script>

<Navbar
  let:hidden
  let:toggle
  color={$preferences.useDarkTheme ? "form" : "indigo"}
>
  <!-- Vocowl Logo and Title -->
  <NavBrand href="./" class="gap-3 text-indigo-600 dark:text-white">
    <Vocowl size={28} />
    <span class="text-xl font-semibold">Vocowl</span>
  </NavBrand>
  <!-- Hamburger Menu Icon displayed on small screens -->
  <NavHamburger on:click={toggle} />
  <!-- List of Navigation Links -->
  <NavUl {hidden}>
    <NavLi
      href={`#${HOME_ROUTE}`}
      active={currentPage == HOME_ROUTE}
      class="flex gap-2 items-center"
      activeClass={NAVLI_ACTIVE_CLASS}
      nonActiveClass={NAVLI_INACTIVE_CLASS}
    >
      <Home size="18" />
      Home
    </NavLi>
    <NavLi
      href={`#${RESTAURANT_ROUTE}`}
      active={currentPage == RESTAURANT_ROUTE}
      class="flex gap-2 items-center"
      activeClass={NAVLI_ACTIVE_CLASS}
      nonActiveClass={NAVLI_INACTIVE_CLASS}
    >
      <BuildingStorefront size="18" />
      Restaurants
    </NavLi>
    <NavLi
      href={`#${DECIDE_ROUTE}`}
      active={currentPage == DECIDE_ROUTE}
      class="flex gap-2 items-center"
      activeClass={NAVLI_ACTIVE_CLASS}
      nonActiveClass={NAVLI_INACTIVE_CLASS}
    >
      <Megaphone size="18" />
      Decide
    </NavLi>

    <!-- Theme Toggle Button -->
    <NavLi
      on:click={toggleTheme}
      class="flex gap-2 items-center cursor-pointer"
      activeClass={NAVLI_ACTIVE_CLASS}
      nonActiveClass={NAVLI_INACTIVE_CLASS}
    >
      {#if $preferences.useDarkTheme}
        <Moon size="18" class="md:hidden" />
        <Moon size="22" class="hidden md:block" />
      {:else}
        <Sun size="18" class="md:hidden" />
        <Sun size="22" class="hidden md:block" />
      {/if}
      <span class="md:hidden">Toggle Theme</span>
    </NavLi>
  </NavUl>
</Navbar>

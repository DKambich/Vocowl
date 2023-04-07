<script lang="ts">
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
    DECIDE_ROUTE,
    HOME_ROUTE,
    NAVLI_ACTIVE_CLASS,
    NAVLI_INACTIVE_CLASS,
    RESTAURANT_ROUTE,
  } from "../../constants";
  import { localStorage, toggleTheme } from "../../stores/localStorageStore";
  import { Vocowl } from "../shared";

  // Component Variables
  let currentPage = $location;

  // Component Functions
  function playOwlHoot() {
    const audio = document.getElementById("vocowlAudio") as HTMLAudioElement;
    audio?.play();
  }
</script>

<Navbar
  color={$localStorage.useDarkTheme ? "form" : "indigo"}
  let:hidden
  let:toggle
>
  <NavBrand href="#/" class="gap-3 text-indigo-600 dark:text-white">
    <audio id="vocowlAudio">
      <source src="owl-hoot.mp3" type="audio/mpeg" />
    </audio>
    <Vocowl size={28} on:click={playOwlHoot} />
    <span class="text-xl font-semibold">Vocowl</span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
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
    <NavLi
      on:click={toggleTheme}
      class="flex gap-2 items-center cursor-pointer"
      activeClass={NAVLI_ACTIVE_CLASS}
      nonActiveClass={NAVLI_INACTIVE_CLASS}
    >
      {#if $localStorage.useDarkTheme}
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

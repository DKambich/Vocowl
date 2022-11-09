<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
  } from "flowbite-svelte";
  import { theme, toggleTheme } from "../stores/themeStore";
  import Vocowl from "./Vocowl.svelte";
  import { Moon, Sun } from "svelte-heros-v2";

  let isDarkMode;

  theme.subscribe((value) => {
    isDarkMode = value === "dark";
  });
</script>

<Navbar let:hidden let:toggle color={isDarkMode ? "dark" : "indigo"}>
  <NavBrand href="/">
    <div class="mr-3 h-6 sm:h-9 flex items-center dark:text-white">
      <Vocowl size={24} />
    </div>
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      Vocowl
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="./">Home</NavLi>
    <NavLi href="./about">About</NavLi>
    <NavLi href="./select">Select</NavLi>
    <NavLi on:click={toggleTheme}>
      <div class="cursor-pointer">
        <span class="sm:hidden md:inline">
          {#if isDarkMode}
            <Moon size="20" />
          {:else}
            <Sun size="20" />
          {/if}
        </span>
        <span class="flex items-center gap-x-2 md:hidden ">
          Toggle Theme
          {#if isDarkMode}
            <Moon size="21" />
          {:else}
            <Sun size="21" />
          {/if}
        </span>
      </div>
    </NavLi>
  </NavUl>
</Navbar>

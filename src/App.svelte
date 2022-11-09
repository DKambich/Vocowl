<script lang="ts">
  import {
    NavBrand,
    Navbar,
    NavHamburger,
    NavUl,
    NavLi,
    DarkMode,
  } from "flowbite-svelte";
  import Vocowl from "./lib/Vocowl.svelte";
  let darkMode: boolean = document.documentElement.classList.contains("dark");
  console.log(darkMode);

  function toggleDarkMode() {
    darkMode = !darkMode;
    console.log(darkMode);
  }
</script>

<Navbar let:hidden let:toggle color={darkMode ? "dark" : "indigo"}>
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
    <NavLi on:click={toggleDarkMode}>
      <!-- TODO: Create a custom solution: https://flowbite.com/docs/customize/dark-mode/ -->
      <DarkMode btnClass="relative" />
    </NavLi>
  </NavUl>
</Navbar>

<div class="dark:text-white">Hello World</div>

<script lang="ts">
  import {
    Button,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
  } from "flowbite-svelte";
  import App from "../App.svelte";
  import { theme, toggleTheme } from "../stores/themeStore";
  import Vocowl from "./Vocowl.svelte";
  let isDarkMode;

  theme.subscribe((value) => {
    isDarkMode = value === "dark";
    console.log(value);
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
        Toggle Theme
    </NavLi>
  </NavUl>
</Navbar>

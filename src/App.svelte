<script lang="ts">
  import {
    AppShell,
    Aside,
    Button,
    Footer,
    Header,
    Navbar,
    ShellSection,
    SvelteUIProvider,
    Text,
    theme,
  } from "@svelteuidev/core";
  import HeaderContent from "./lib/HeaderContent.svelte";
  let opened = false;
  let darkMode = false;
  function toggleOpened() {
    opened = !opened;
  }
  function toggleTheme() {
    darkMode = !darkMode;
  }
</script>

<SvelteUIProvider
  withNormalizeCSS
  withGlobalStyles
  themeObserver={darkMode ? "dark" : "light"}
>
  <AppShell fixed navbarOffsetBreakpoint="xl">
    <Navbar
      slot="navbar"
      hiddenBreakpoint="xl"
      hidden={!opened}
      fixed
      width={{
        sm: "100%",
        md: "40%",
        lg: 400,
        xl: 450,
      }}
    >
      Navbar Content
    </Navbar>

    <Header height={60} fixed slot="header"
      ><HeaderContent {opened} {toggleOpened} {darkMode} {toggleTheme} />
    </Header>
    <!-- Main content uses the default slot, so no need to explicitly declare it -->
    <ShellSection grow>Main Content</ShellSection>
    <Footer height={60} slot="footer">Footer Content</Footer>
  </AppShell>
</SvelteUIProvider>

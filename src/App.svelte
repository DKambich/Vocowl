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
  } from "@svelteuidev/core";
  let opened = false;
</script>

<SvelteUIProvider withNormalizeCSS withGlobalStyles>
  <AppShell fixed navbarOffsetBreakpoint="xl">
    <Navbar
      slot="navbar"
      hiddenBreakpoint="xl"
      hidden={!opened}
      fixed
      width={{
        sm: 300,
        md: 350,
        lg: 400,
        xl: 450,
        base: 100,
      }}
    >
      Navbar Content
    </Navbar>

    <Header height={60} fixed slot="header">Header Content</Header>
    <!-- Main content uses the default slot, so no need to explicitly declare it -->
    <ShellSection grow>Main Content</ShellSection>
    <Footer height={60} slot="footer">Footer Content</Footer>
  </AppShell>
</SvelteUIProvider>

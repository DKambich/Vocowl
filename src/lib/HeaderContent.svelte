<script lang="ts">
  import {
    ActionIcon,
    Burger,
    Group,
    Image,
    Switch,
    Text,
  } from "@svelteuidev/core";

  export let opened: boolean;
  export let darkMode: boolean;
  export let toggleOpened: () => void;
  export let toggleTheme: () => void;
</script>

<Group override={{ height: "100%", px: 20 }} position="apart">
  <Burger
    {opened}
    on:click={toggleOpened}
    override={{ d: "block", "@lg": { d: "none" } }}
  />
  <Group>
    <img
      src="./vocowl.svg"
      height={35}
      alt="Vocowl Logo"
      style={darkMode ? "filter: invert(1)" : ""}
    />
    <Text size="xl" override={{ d: "none", "@sm": { d: "block" } }}>
      Vocowl
    </Text>
  </Group>

  <Switch on:change={toggleTheme} />
</Group>

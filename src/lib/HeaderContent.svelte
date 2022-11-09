<script lang="ts">
  import { Burger, Group, Switch, Text } from "@svelteuidev/core";
  import { createStyles } from "@svelteuidev/core";
  import Vocowl from "./Vocowl.svelte";

  export let opened: boolean;
  export let darkMode: boolean;
  export let toggleOpened: () => void;
  export let toggleTheme: () => void;

  const useStyles = createStyles((theme) => {
    return {
      root: {
        [`${theme.dark} &`]: {
          // using of SvelteUI utilities
          // bc === backgroundColor
          bc: theme.colors["dark500"].value,
        },
        // subscribe to color scheme changes right in your styles
        // use theme functions to make styling easier
        backgroundColor: theme.fn.themeColor("indigo", 6),
        color: "White",
      },
    };
  });

  // This is reactive destructuring
  const { getStyles } = useStyles();
</script>

<Group
  override={{ height: "100%", px: 20 }}
  class={getStyles()}
  position="apart"
>
  <Burger
    {opened}
    on:click={toggleOpened}
    override={{ d: "block", "@lg": { d: "none" } }}
  />
  <Group>
    <Vocowl size={36} />
    <Text size="xl" override={{ d: "none", "@sm": { d: "block" }, color: "White" }}>
      Vocowl
    </Text>
  </Group>

  <Switch on:change={toggleTheme} />
</Group>

<script lang="ts">
  import Header from "../lib/Header.svelte";
  import type { ComponentType } from "svelte";

  export let mainContent: ComponentType;
</script>

<div>
  <Header />
  <svelte:component this={mainContent} />
</div>

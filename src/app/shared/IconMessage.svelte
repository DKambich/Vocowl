<script lang="ts">
  import { P } from "flowbite-svelte";

  export let size: "xs" | "sm" | "md" | "lg" | "xl" = "md";
  export let icon: ConstructorOfATypedSvelteComponent;
  const messageClass =
    "flex flex-col justify-center items-center gap-2 text-black dark:text-white " +
    $$props.class;

  let iconSize;
  let fontSize;
  $: {
    switch (size) {
      case "xs":
        fontSize = "xs";
        iconSize = 18;
        break;
      case "sm":
        fontSize = "sm";
        iconSize = 24;
        break;
      case "md":
        fontSize = "base";
        iconSize = 32;
        break;
      case "lg":
        fontSize = "lg";
        iconSize = 48;
        break;
      case "xl":
        fontSize = "xl";
        iconSize = 64;
        break;
    }
  }
</script>

<div class={messageClass}>
  <svelte:component this={icon} size={iconSize} />
  <P size={fontSize}>
    <slot />
  </P>
</div>

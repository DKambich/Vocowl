<script lang="ts">
  import { Checkbox, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { BuildingStorefront } from "svelte-heros-v2";
  import { showToast } from "../../../stores/toastStore";
  import type { Restaurant } from "../../../types";
  import { IconMessage } from "../../shared";

  export let restaurants: Restaurant[];
  export let filteredRestaurants: Restaurant[];
  export let disabled = false;

  type SelectedOption = {
    option: Restaurant;
    selected: boolean;
  };

  let restaurantOptions: SelectedOption[];
  restaurantOptions = restaurants.map((res) => ({
    option: res,
    selected: true,
  }));

  $: {
    filteredRestaurants = restaurantOptions
      .filter((option) => option.selected)
      .map(({ option }) => option);
  }

  function onCheckboxClick(event, index) {
    const isChecked = restaurantOptions[index].selected;

    const numSelected = restaurantOptions.filter(
      (option) => option.selected
    ).length;

    if (isChecked && numSelected <= 1) {
      event.preventDefault();
      showToast({
        message: "You must have at least one restaurant selected",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    restaurantOptions[index].selected = !isChecked;
    restaurantOptions = restaurantOptions;
  }
</script>

<Listgroup class="absolute top-0 right-0 left-0 bottom-0 overflow-scroll">
  <div
    class="bg-primary-700 text-white font-bold text-center sticky top-0 py-2"
  >
    Selected Restaurants
  </div>
  {#if restaurantOptions.length === 0}
    <IconMessage class="py-8" icon={BuildingStorefront} size="lg">
      No restaurants added...
    </IconMessage>
  {/if}
  {#each restaurantOptions as { option, selected }, index}
    <ListgroupItem>
      <Checkbox
        checked={selected}
        class="w-100"
        on:click={(event) => onCheckboxClick(event, index)}
        {disabled}
      >
        {option.name}
      </Checkbox>
    </ListgroupItem>
  {/each}
</Listgroup>

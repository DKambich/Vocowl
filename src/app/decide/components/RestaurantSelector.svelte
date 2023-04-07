<script lang="ts">
  import { Checkbox, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { BuildingStorefront } from "svelte-heros-v2";
  import { showToast } from "../../../stores/toastStore";
  import type { Restaurant } from "../../../types";
  import { IconMessage } from "../../shared";

  // Type Definitions
  type SelectedOption = {
    option: Restaurant;
    selected: boolean;
  };

  // External Variables
  export let restaurants: Restaurant[];
  export let filteredRestaurants: Restaurant[];
  export let disabled = false;

  // Component Variables
  let restaurantOptions: SelectedOption[];

  // Component Setup
  restaurantOptions = restaurants.map((restaurant) => ({
    option: restaurant,
    selected: true,
  }));

  // State Subscription
  $: {
    // Update outputted restaurants when different options are selected
    filteredRestaurants = restaurantOptions
      .filter((option) => option.selected)
      .map(({ option }) => option);
  }

  // Component Functions
  function onSelectRestaurant(event: MouseEvent, index: number) {
    // Determine if the checkbox is selected and how many total are selected
    const isChecked = restaurantOptions[index].selected;
    const numSelected = restaurantOptions.filter(
      (option) => option.selected
    ).length;

    // Only allow deselection if there are two or more selected options
    if (isChecked && numSelected <= 1) {
      event.preventDefault();
      showToast({
        message: "You must have at least one restaurant selected",
        type: "warning",
        timeout: 3000,
      });
    } else {
      restaurantOptions[index].selected = !isChecked;
      // Trigger a svelte refresh
      restaurantOptions = restaurantOptions;
    }
  }
</script>

<Listgroup class="absolute top-0 right-0 bottom-0 left-0 overflow-scroll">
  <div
    class="bg-primary-700 text-white text-center font-bold sticky top-0 py-2"
  >
    Selected Restaurants
  </div>
  {#if !restaurantOptions.length}
    <IconMessage class="py-8" icon={BuildingStorefront} size="lg">
      No restaurants added...
    </IconMessage>
  {/if}
  {#each restaurantOptions as { option, selected }, index}
    <ListgroupItem>
      <Checkbox
        class="w-100"
        checked={selected}
        on:click={(event) => onSelectRestaurant(event, index)}
        {disabled}
      >
        {option.name}
      </Checkbox>
    </ListgroupItem>
  {/each}
</Listgroup>

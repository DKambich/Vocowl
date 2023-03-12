<script lang="ts">
  import {
    Button,
    Checkbox,
    Listgroup,
    ListgroupItem,
    P,
  } from "flowbite-svelte";
  import { BuildingStorefront, Megaphone } from "svelte-heros-v2";
  import { PageBaseline } from ".";
  import Slot from "../components/Slot.svelte";
  import { preferences } from "../stores/preferencesStore";
  import { showToast } from "../stores/toastStore";
  import type { Restaurant } from "../types";
  let restaurants = $preferences.restaurants;

  let restaurantOptions = restaurants.map((restaurant) => ({
    selected: true,
    restaurant,
  }));

  console.log(restaurantOptions);

  let filteredRestaurants;
  $: {
    filteredRestaurants = restaurantOptions
      .filter((option) => option.selected)
      .map((option) => option.restaurant);
  }

  let startReel;

  function onReelEnd(res: Restaurant) {
    alert(`${res.name} Won!!!`);
  }

  function onCheckboxClick(event: Event, index: number) {
    const checked = restaurantOptions[index].selected;

    const numSelected = restaurantOptions.filter(
      (option) => option.selected
    ).length;

    if (checked && numSelected <= 1) {
      event.preventDefault();
      showToast({
        message: "You must have at least one restaurant selected",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    restaurantOptions[index].selected = !checked;
    restaurantOptions = restaurantOptions;
  }
</script>

<PageBaseline>
  <div class="flex-1 grid grid-rows-2 grid-cols-1 lg:grid-cols-5 gap-4">
    <div
      class="col-span-1 lg:col-span-3 flex flex-col gap-2 row-span-2 lg:row-span-1 min-h-[50vh] lg:min-h-0"
    >
      {#if filteredRestaurants.length > 0}
        {#key filteredRestaurants}
          <Slot
            reelItems={filteredRestaurants}
            reelItemBuilder={(res) => res.name}
            {onReelEnd}
            bind:startReel
          />
        {/key}
        <div class="flex-none">
          <Button color="primary" size="xl" class="w-full" on:click={startReel}>
            Decide!
          </Button>
        </div>
      {:else}
        <div
          class="flex-1 flex-col flex items-center justify-center gap-2 dark:text-white"
        >
          <Megaphone size="64" />
          <P size="xl">Start deciding by adding at least one restaurant</P>
        </div>
      {/if}
    </div>
    <div
      class="col-span-1 lg:col-span-2 h-full relative min-h-[50vh] lg:min-h-0"
    >
      <Listgroup class="absolute top-0 right-0 left-0 bottom-0 overflow-scroll">
        <div
          class="bg-primary-700 text-white font-bold text-center sticky top-0 py-2"
        >
          Selected Restaurants
        </div>
        {#if restaurantOptions.length === 0}
          <div class="pt-8 flex flex-col justify-center items-center text-black dark:text-white">
            <BuildingStorefront size="48" />
            <P size="lg">No restaurants added...</P>
          </div>
        {/if}
        {#each restaurantOptions as option, index}
          <ListgroupItem>
            <Checkbox
              checked={option.selected}
              class="w-100"
              on:click={(event) => onCheckboxClick(event, index)}
            >
              {option.restaurant.name}
            </Checkbox>
          </ListgroupItem>
        {/each}
      </Listgroup>
    </div>
  </div>
</PageBaseline>

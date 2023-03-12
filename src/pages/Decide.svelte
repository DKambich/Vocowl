<script lang="ts">
  import { Button, Checkbox, Listgroup, ListgroupItem } from "flowbite-svelte";
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

  let filteredRestaurants = restaurantOptions
    .filter((option) => option.selected)
    .map((option) => option.restaurant);

  let startReel;
  let updateReelOptions;

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
        message: "You must have at least one restaurant selected to spin",
        type: "warning",
        timeout: 3000,
      });
      return;
    }
  }

  function onCheckboxChange(event: Event, index: number) {
    const checked = (event.target as HTMLInputElement).checked;

    restaurantOptions[index].selected = checked;
    updateReelOptions(
      restaurantOptions
        .filter((option) => option.selected)
        .map((option) => option.restaurant)
    );
  }
</script>

<PageBaseline>
  <div class="flex-1 grid grid-rows-2 grid-cols-1 lg:grid-cols-5 gap-4">
    <div class="col-span-3 flex flex-col gap-2">
      <Slot
        reelItems={filteredRestaurants}
        reelItemBuilder={(res) => res.name}
        {onReelEnd}
        bind:startReel
        bind:updateReelOptions
      />
      <div class="flex-none">
        <Button color="primary" size="xl" class="w-full" on:click={startReel}>
          Spin
        </Button>
      </div>
    </div>
    <div class="col-span-2 h-full relative">
      <Listgroup class="absolute top-0 right-0 left-0 bottom-0 overflow-scroll">
        <div
          class="bg-primary-700 text-white font-bold text-center sticky top-0 py-2"
        >
          Selected Restaurants
        </div>
        {#each restaurantOptions as option, index}
          <ListgroupItem>
            <Checkbox
              checked={option.selected}
              class="w-100"
              on:change={(event) => onCheckboxChange(event, index)}
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

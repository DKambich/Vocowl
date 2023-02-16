<script lang="ts">
  import { Button, Card } from "flowbite-svelte";
  import { MapPin, Trash } from "svelte-heros-v2";
  import { preferences, removeRestaurant } from "../stores/preferencesStore";
  import type { Restaurant } from "../types";

  $: restaurants = $preferences.restaurants;

  function generateGoogleMapsURL(restaurant: Restaurant) {
    let url = "https://www.google.com/maps/search/?api=1";
    let query_place_id = `&query_place_id=${restaurant.id}`;
    let query = `&query=`;
    query += `${restaurant.name}`;
    if (restaurant.location) {
      query += `+${restaurant.location.lat},${restaurant.location.lng}`;
    }
    return encodeURI(`${url}${query}${query_place_id}`);
  }
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#each restaurants as restaurant}
    <Card size="xl">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {restaurant.name}
      </h5>
      <div class="flex justify-end gap-2">
        <Button
          color="primary"
          href={generateGoogleMapsURL(restaurant)}
          target="_blank"
        >
          <MapPin size="20" />
          <span class="ml-2 font-bold">Locate</span>
        </Button>
        <Button color="red" on:click={() => removeRestaurant(restaurant)}
          ><Trash size="20" /><span class="ml-2 font-bold">Remove</span></Button
        >
      </div>
    </Card>
  {/each}
</div>

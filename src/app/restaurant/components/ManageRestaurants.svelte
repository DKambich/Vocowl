<script lang="ts">
  import { Button, Card } from "flowbite-svelte";
  import {
    BuildingStorefront,
    GlobeAlt,
    MapPin,
    Trash,
    UserCircle,
  } from "svelte-heros-v2";
  import {
    localStorage,
    removeRestaurant,
  } from "../../../stores/localStorageStore";
  import type { Restaurant } from "../../../types";
  import { IconMessage } from "../../shared";

  $: restaurants = $localStorage.restaurants;

  function generateGoogleMapsURL(restaurant: Restaurant) {
    const url = "https://www.google.com/maps/search/?api=1";
    let query = `&query=`;
    query += `${restaurant.name}`;
    if (restaurant.location) {
      query += `+${restaurant.location.lat},${restaurant.location.lng}`;
    }
    query += `&query_place_id=${restaurant.id}`;
    return encodeURI(`${url}${query}`);
  }
</script>

{#if restaurants.length === 0}
  <IconMessage class="py-8" icon={BuildingStorefront} size="xl">
    No restaurants added...
  </IconMessage>
{:else}
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each restaurants as restaurant}
      <Card class="flex flex-col justify-around gap-3 " size="xl">
        <div
          class="flex items-center gap-1 md:gap-2 font-bold text-lg tracking-tight"
        >
          <div>
            {#if restaurant.source !== "custom"}
              <GlobeAlt />
            {:else}
              <UserCircle />
            {/if}
          </div>
          {restaurant.name}
        </div>
        <div>
          <a href={generateGoogleMapsURL(restaurant)} target="_blank">
            {restaurant.address}
          </a>
        </div>

        <div class="flex gap-2">
          <Button
            color="primary"
            href={generateGoogleMapsURL(restaurant)}
            target="_blank"
          >
            <MapPin size="20" />
            <span class="ml-2 font-bold">Locate</span>
          </Button>
          <Button
            color="alternative"
            on:click={() => removeRestaurant(restaurant)}
          >
            <Trash size="20" />
            <span class="ml-2 font-bold">Remove</span>
          </Button>
        </div>
      </Card>
    {/each}
  </div>
{/if}

<script lang="ts">
  import { Button, Card } from "flowbite-svelte";
  import {
    BuildingStorefront,
    GlobeAlt,
    MapPin,
    Trash,
    UserCircle,
  } from "svelte-heros-v2";
  import { generateGoogleMapsURL } from "../../../services/GoogleMapsService";
  import {
    preferences,
    removeRestaurant,
  } from "../../../stores/preferencesStore";
  import { IconMessage } from "../../shared";

  $: restaurants = $preferences.restaurants;
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
            {#if restaurant.source === "google"}
              <GlobeAlt />
            {:else if restaurant.source === "custom"}
              <UserCircle />
            {/if}
          </div>
          {restaurant.name}
        </div>
        <div class="gap-2">
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

<script lang="ts">
  import { Button, Card } from "flowbite-svelte";
  import {
    BuildingStorefront,
    GlobeAlt,
    Trash,
    UserCircle,
  } from "svelte-heros-v2";
  import {
    localStorage,
    removeRestaurant,
  } from "../../../stores/localStorageStore";
  import {
    getFormattedAddress,
    getGoogleMapsSearchURL,
  } from "../../../utilities";
  import { IconMessage } from "../../shared";

  $: restaurants = $localStorage.restaurants;
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
          class="flex items-center gap-1 md:gap-2 font-bold text-xl tracking-tight"
        >
          {#if restaurant.source !== "custom"}
            <GlobeAlt size="28" />
          {:else}
            <UserCircle size="28" />
          {/if}
          <span class="grow">{restaurant.name}</span>
          <Button
            pill
            outline
            color="red"
            class="!p-2"
            on:click={() => removeRestaurant(restaurant)}
          >
            <Trash size="20" />
          </Button>
        </div>
        <div>
          {#if restaurant.address}
            <address>
              <a href={getGoogleMapsSearchURL(restaurant)} target="_blank">
                {getFormattedAddress(restaurant.address)}
              </a>
            </address>
          {:else}
            <span>No Address Entered</span>
          {/if}
        </div>
      </Card>
    {/each}
  </div>
{/if}

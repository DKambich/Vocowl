<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Label,
    Listgroup,
    ListgroupItem,
    Range,
  } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { afterUpdate, getContext, onDestroy } from "svelte";
  import {
    HandThumbDown,
    MagnifyingGlass,
    MapPin,
    MinusCircle,
    PlusCircle,
  } from "svelte-heros-v2";
  import { MILES_TO_METERS, POI_SERVICE } from "../../../constants";
  import type { IPOIService } from "../../../services/IPOIService";
  import {
    addRestaurant,
    localStorage,
    removeRestaurant,
  } from "../../../stores/localStorageStore";
  import { showToast } from "../../../stores/toastStore";
  import type { LatLng, Restaurant } from "../../../types";
  import { IconMessage } from "../../shared";

  // Type Definitions
  // External Variables
  export let userLocation: LatLng;

  // Component Variables
  const poiService = getContext<IPOIService>(POI_SERVICE);

  let cachedLocation = userLocation;

  let nearbyMap: Leaflet.Map;
  let searchCircle: Leaflet.Circle;

  let nearbyRestaurants: Restaurant[] = [];
  let nearbyMarkers: Leaflet.Marker[] = [];
  let searchRadius = 5;
  let hasSearched = false;

  // Component Setup
  afterUpdate(() => {
    if (userLocation && !nearbyMap) {
      nearbyMap = Leaflet.map("nearbyMap")
        .setView(userLocation, 12)
        .addLayer(
          Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 6,
            maxZoom: 16,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          })
        );

      searchCircle = Leaflet.circle(userLocation, {
        color: "#5850EC",
        fillOpacity: 0.35,
        radius: searchRadius * MILES_TO_METERS,
      }).addTo(nearbyMap);
    }
  });

  onDestroy(() => {
    nearbyMap.remove();
  });

  // State Subscription
  $: savedRestaurants = $localStorage.restaurants;

  // Update map center and search radius center when location changes
  $: if (userLocation != cachedLocation) {
    nearbyMap?.setView(userLocation);
    nearbyMap?.setZoom(12);
    searchCircle?.setLatLng(userLocation);
    cachedLocation = userLocation;
  }

  // Update map search circle when search radius changes
  $: {
    searchCircle?.setRadius(searchRadius * MILES_TO_METERS);
  }

  // Component Functions
  function centerMapOnRestaurant(restaurant: Restaurant) {
    nearbyMap.flyTo(restaurant.location, 16);
  }

  async function loadNearbyRestaurants() {
    nearbyRestaurants = [];
    nearbyMarkers.forEach((marker) => marker.remove());

    // Get nearby restaurants
    const [restaurants, error] = await poiService.getNearbyRestaurants(
      userLocation,
      { radius: searchRadius * MILES_TO_METERS }
    );

    hasSearched = true;

    if (error) {
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } else {
      nearbyRestaurants = restaurants;
      nearbyMarkers = [
        ...restaurants.map(({ location }) =>
          Leaflet.marker(location).addTo(nearbyMap)
        ),
      ];
    }
  }

  function addMapRestaurant(restaurant: Restaurant) {
    addRestaurant(restaurant);
    showToast({
      message: `Added ${restaurant.name}`,
      type: "success",
    });
  }

  function removeMapRestaurant(restaurant: Restaurant) {
    removeRestaurant(restaurant);
    showToast({
      message: `Removed ${restaurant.name}`,
      type: "success",
    });
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    id="nearbyMap"
    class="col-span-1 lg:col-span-2 rounded-lg flex justify-center h-[50vh] z-0"
  >
    {#if !nearbyMap}
      <IconMessage icon={MapPin} size="xl">
        Update your location to load map
      </IconMessage>
    {/if}
  </div>
  <div class="col-span-1 flex flex-col max-h-[50vh]">
    <Listgroup class="h-fit overflow-auto grow">
      <h3
        class="text-center bg-primary-700 py-2 text-white font-bold rounded-t-lg sticky top-0"
      >
        Nearby Results
      </h3>
      {#each nearbyRestaurants as restaurant}
        <div class="px-2">
          <ListgroupItem class="flex items-center">
            <div class="grow wrap pr-2">
              <div class="font-bold break-all">
                {restaurant.name}
              </div>
            </div>
            <MapPin
              class="min-w-max px-2 cursor-pointer hover:text-primary-600"
              on:click={() => centerMapOnRestaurant(restaurant)}
            />
            {#if savedRestaurants.find((res) => res.id === restaurant.id)}
              <MinusCircle
                class="min-w-max cursor-pointer hover:text-primary-600"
                on:click={() => removeMapRestaurant(restaurant)}
              />
            {:else}
              <PlusCircle
                class="min-w-max cursor-pointer hover:text-primary-600"
                on:click={() => addMapRestaurant(restaurant)}
              />
            {/if}
          </ListgroupItem>
        </div>
      {/each}
      {#if nearbyRestaurants.length === 0}
        {#if !hasSearched}
          <IconMessage class="py-8" icon={MagnifyingGlass} size="md">
            Start Your Search...
          </IconMessage>
        {:else}
          <IconMessage class="py-8" icon={HandThumbDown} size="md">
            No Results Found...
          </IconMessage>{/if}
      {/if}
    </Listgroup>
    <Accordion flush>
      <AccordionItem open>
        <span slot="header">Search Options</span>
        <div class="flex flex-col gap-4 items-stretch">
          <div>
            <Label>Search Radius ({searchRadius} miles)</Label>
            <Range
              disabled={!nearbyMap}
              min="1"
              max="10"
              bind:value={searchRadius}
            />
          </div>
        </div>
      </AccordionItem>
    </Accordion>
    <Button
      color="primary"
      disabled={!nearbyMap}
      on:click={loadNearbyRestaurants}
    >
      <span class="font-bold">Search</span>
    </Button>
  </div>
</div>

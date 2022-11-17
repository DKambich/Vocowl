<script lang="ts">
  import {
    Button,
    Label,
    Listgroup,
    ListgroupItem,
    P,
    Range,
  } from "flowbite-svelte";
  import { afterUpdate } from "svelte";
  import { MapPin, PlusCircle } from "svelte-heros-v2";
  import { getNearbyRestaurants } from "../api/GoogleMapsService";
  import { MILES_TO_METERS } from "../constants";
  import { showToast } from "../stores/toastStore";

  let buttons = Array(20)
    .fill(0)
    .map((x, i) => ({ name: i }));

  // External user location
  export let location: google.maps.LatLngLiteral;
  // Internal state variables
  let nearbyMap: google.maps.Map;
  let nearbyRestaurants: google.maps.places.PlaceResult[] = [];
  let nearbyPagination: google.maps.places.PlaceSearchPagination;
  let nearbyMarkers: google.maps.Marker[] = [];
  let searchCircle: google.maps.Circle;
  let searchRadius = 5;

  // Update map center and search radius center when location changes
  $: {
    // TODO: Run the nearby places search
    nearbyMap?.moveCamera({ center: location });
    searchCircle?.setCenter(location);
  }

  // Update map center and search radius center when location changes
  $: {
    // TODO: Run the nearby places search
    searchCircle?.setRadius(searchRadius * MILES_TO_METERS);
  }

  // After DOM has loaded, load in the the nearby search map and search radius
  afterUpdate(() => {
    if (location && !nearbyMap) {
      nearbyMap = new google.maps.Map(document.getElementById("nearbyMap"), {
        center: location,
        zoom: 11,
      });
      searchCircle = new google.maps.Circle({
        map: nearbyMap,
        center: location,
        radius: searchRadius * MILES_TO_METERS,
        strokeWeight: 0,
        fillColor: "#5850EC",
        fillOpacity: 0.35,
      });
      nearbyRestaurants = [];
      getNearbyRestaurants({
        location,
        radius: searchRadius * MILES_TO_METERS,
        map: nearbyMap,
        callback: (res) => {
          nearbyRestaurants = [...nearbyRestaurants, ...res.results];
          nearbyMarkers = [
            ...nearbyMarkers,
            ...res.results.map((result) => {
              const marker = new google.maps.Marker({
                position: result.geometry.location,
                map: nearbyMap,
                title: result.name,
                clickable: true,
              });

              return marker;
            }),
          ];
          nearbyPagination = res.pagination;
          console.log(nearbyMarkers);
        },
      });
    }
  });

  function updateRadius() {
    // TODO: Set the new locations
    nearbyRestaurants = [];
    getNearbyRestaurants({
      location,
      radius: searchRadius * MILES_TO_METERS,
      map: nearbyMap,
      callback: (res) => {
        nearbyRestaurants = [...nearbyRestaurants, ...res.results];
        nearbyPagination = res.pagination;
      },
    });
  }

  function loadPaginatedResults() {
    if (nearbyPagination) {
      nearbyPagination.nextPage();
    }
  }

  function centerMapOnRestaurant(restaurant: google.maps.places.PlaceResult) {
    nearbyMap?.setCenter(restaurant.geometry.location);
    nearbyMap?.setZoom(14);
  }

  console.log();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    id="nearbyMap"
    class="flex justify-center items-center col-span-1 lg:col-span-2 rounded-lg h-[500px]"
  >
    <P size="xl"
      >Cannot load map until a location has been provided. Please update your
      location.</P
    >
  </div>
  <div class="flex flex-col max-h-[500px] gap-y-4">
    <div>
      <Label>Search Radius: {searchRadius} miles</Label>
      <Range
        min="1"
        max="10"
        bind:value={searchRadius}
        on:change={updateRadius}
        disabled={!nearbyMap}
      />
    </div>
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
              class="min-w-max px-2 cursor-pointer hover:text-indigo-500"
              on:click={() => centerMapOnRestaurant(restaurant)}
            />
            <PlusCircle
              class="min-w-max cursor-pointer hover:text-indigo-500"
            />
          </ListgroupItem>
        </div>
      {/each}
      {#if nearbyPagination?.hasNextPage}
        <Button color="primary" class="w-full" on:click={loadPaginatedResults}
          >Load More Results</Button
        >
      {/if}
      {#if nearbyRestaurants.length === 0}
        <div class="text-center py-4">No Results Found...</div>
      {/if}
    </Listgroup>
  </div>
</div>

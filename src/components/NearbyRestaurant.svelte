<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Checkbox,
    Label,
    Listgroup,
    ListgroupItem,
    P,
    Radio,
    Range,
  } from "flowbite-svelte";
  import { afterUpdate } from "svelte";
  import { ChevronDown, ChevronUp, MapPin, PlusCircle } from "svelte-heros-v2";
  import { getNearbyRestaurants } from "../api/GoogleMapsService";
  import { MILES_TO_METERS } from "../constants";
  import type { NearbyPlacesResponse } from "../types";

  // External user location
  export let location: google.maps.LatLngLiteral;

  // Internal Map state variables
  let nearbyMap: google.maps.Map;
  let nearbyRestaurants: google.maps.places.PlaceResult[] = [];
  let nearbyPagination: google.maps.places.PlaceSearchPagination;
  let nearbyMarkers: google.maps.Marker[] = [];
  let searchCircle: google.maps.Circle;

  // Internal Search Options state variables
  let searchRadius = 5;
  const RANK_DISTANCE = google.maps.places.RankBy.DISTANCE.toString();
  const RANK_PROMINENCE = google.maps.places.RankBy.PROMINENCE.toString();
  let rankBy = RANK_PROMINENCE;
  let openNow = true;

  // Update map center and search radius center when location changes
  $: {
    nearbyMap?.moveCamera({ center: location });
    searchCircle?.setCenter(location);
    if (location && nearbyMap) loadNearbyRestaurants();
  }

  // Update map search circle when search radius changes
  $: {
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
      loadNearbyRestaurants();
    }
  });

  function loadNearbyRestaurants() {
    // Clear nearby restaurants
    nearbyRestaurants = [];
    // Remove existing markers from map and clear markers
    nearbyMarkers.forEach((marker) => marker.setMap(null));
    nearbyMarkers = [];

    // Fetch the nearby restaurants based on current options
    getNearbyRestaurants({
      map: nearbyMap,
      location: location,
      rankBy: parseInt(rankBy),
      openNow: openNow,
      radius: searchRadius * MILES_TO_METERS,
      callback: handleNearbyRestaurants,
    });
  }

  function handleNearbyRestaurants(nearbyResult: NearbyPlacesResponse) {
    const { results, pagination } = nearbyResult;
    // Add new results to the end of the nearby restaurants
    nearbyRestaurants = [...nearbyRestaurants, ...results];
    // Add new markers to the end of the markers
    nearbyMarkers = [
      ...nearbyMarkers,
      ...nearbyResult.results.map(
        (result) =>
          new google.maps.Marker({
            map: nearbyMap,
            position: result.geometry.location,
            title: result.name,
          })
      ),
    ];
    // Update the pagination object
    nearbyPagination = pagination;
  }

  function centerMapOnRestaurant(restaurant: google.maps.places.PlaceResult) {
    // Move the map to center on the restaurant location
    nearbyMap?.setCenter(restaurant.geometry.location);
    // Increase zoom level on restaurant location
    nearbyMap?.setZoom(16);
  }
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
  <div class="flex flex-col max-h-[500px] ">
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
            <PlusCircle
              class="min-w-max cursor-pointer hover:text-primary-600"
            />
          </ListgroupItem>
        </div>
      {/each}
      {#if nearbyPagination?.hasNextPage}
        <Button
          color="primary"
          class="w-full"
          on:click={() => nearbyPagination?.nextPage()}
          >Load More Results</Button
        >
      {/if}
      {#if nearbyRestaurants.length === 0}
        <div class="text-center py-4">No Results Found...</div>
      {/if}
    </Listgroup>
    <Accordion flush>
      <AccordionItem>
        <span slot="header">Search Options</span>
        <Label>Search Radius: {searchRadius} miles</Label>
        <Range
          min="1"
          max="10"
          bind:value={searchRadius}
          on:change={loadNearbyRestaurants}
          disabled={!nearbyMap}
        />
        <Label>Rank Results By</Label>
        <ul class="items-center w-full rounded-lg  sm:flex ">
          <Radio bind:group={rankBy} value={RANK_PROMINENCE} class="w-full">
            Prominence
          </Radio>
          <Radio bind:group={rankBy} value={RANK_DISTANCE} class="w-full">
            Distance
          </Radio>
        </ul>
        <Checkbox checked={openNow} on:click={() => (openNow = !openNow)}>
          Open Now
        </Checkbox>
      </AccordionItem>
    </Accordion>
  </div>
</div>

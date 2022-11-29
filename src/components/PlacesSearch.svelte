<script lang="ts">
  import { Button, Card, Helper, Search, Spinner } from "flowbite-svelte";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";
  import { queryNearbyRestaurants } from "../api/GoogleMapsService";
  import { MILES_TO_METERS } from "../constants";
  import {
    addRestaurant,
    preferences,
    removeRestaurant,
  } from "../stores/preferencesStore";
  import { showToast } from "../stores/toastStore";
  import type { Restaurant, SearchPlacesResponse } from "../types";

  export let location: google.maps.LatLngLiteral;

  // TODO: Remove this variable
  const dummySearchResults: google.maps.places.PlaceResult[] = [
    {
      place_id: "0",
      name: "Lakin Ltd",
      formatted_address: "8858 Bethel Circle, Joseland, MT 07259",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "1",
      name: "Stark and Sons",
      formatted_address:
        "485 Camille Corner Apt. 264, North Christinebury, WY 56920",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "2",
      name: "Feil LLC",
      formatted_address: "2821 Scarlett Shores, Bayerside, WA 84797-5224",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "3",
      name: "Quitzon, Gerhold and Robel",
      formatted_address: "364 O'Connell Unions Apt. 566 Harmonyside, WI 98595",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "4",
      name: "Howe Inc",
      formatted_address:
        "9457 Anissa Mall Suite 331 North Josuechester, WY 40357",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "5",
      name: "Heller Inc",
      formatted_address: "6457 Mariam Flats Apt. 671 Margiefurt, NM 99341",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "6",
      name: "Gutkowski, Romaguera and Doyle",
      formatted_address: "78681 Labadie Fords Lake Nikkiland, CO 26969",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "7",
      name: "Padberg-Reynolds",
      formatted_address: "982 Hauck Track Suite 331 West Arnaldo, DE 35621",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "8",
      name: "Pfannerstill, Jacobi and Auer",
      formatted_address: "37214 Brooklyn Ridge Rigobertomouth, CA 04574",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
    {
      place_id: "9",
      name: "Dooley, Runte and Strosin",
      formatted_address: "399 Arch View South Nicholauschester, DC 12369",
      geometry: { location: new google.maps.LatLng(0, 0) },
    },
  ];

  let searchResults: google.maps.places.PlaceResult[] = [];
  let searchInput = "";
  let searchError = "";
  let isSearchLoading = false;

  $: locationEmpty = !location;
  $: savedRestaurants = $preferences.restaurants;

  // Handle changes to the search
  function onSearchChange(e: Event) {
    const target = e.target as HTMLInputElement;
    searchInput = target.value;
  }

  // Handle submission of the search
  function onSearchSubmit(e: Event) {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      isSearchLoading = true;
      searchError = "";
      queryNearbyRestaurants({
        query: searchInput,
        location: location,
        callback: handleSearchResults,
        radius: MILES_TO_METERS * 10,
      });
      // setTimeout(() => {
      //   searchResults = dummySearchResults;
      // }, 3000);
    } else {
      searchError = "Search cannot be empty.";
    }

    // alert(`You are searching for: ${searchInput}`);
  }

  function handleSearchResults({ results, status }: SearchPlacesResponse) {
    console.log(results, status);
    searchResults = results.filter((result) =>
      result.types.includes("restaurant")
    );
    isSearchLoading = false;
  }

  function addGoogleRestaurant(
    googleRestaurant: google.maps.places.PlaceResult
  ) {
    const {
      name,
      formatted_address,
      place_id,
      geometry: { location },
    } = googleRestaurant;

    const restaurant: Restaurant = {
      id: place_id,
      name: name,
      address: formatted_address,
      location: { lat: location.lat(), lng: location.lng() },
    };

    addRestaurant(restaurant);
    showToast({ message: `Added ${name}`, type: "success", timeout: 2000 });
  }

  function removeGoogleRestaurant(
    googleRestaurant: google.maps.places.PlaceResult
  ) {
    const { name, place_id } = googleRestaurant;

    removeRestaurant(place_id);
    showToast({ message: `Removed ${name}`, type: "success", timeout: 2000 });
  }
</script>

<form class="flex gap-2" on:submit={onSearchSubmit}>
  <Search size="md" on:change={onSearchChange} disabled={locationEmpty} />
  <Button
    color="primary"
    type="submit"
    disabled={locationEmpty || isSearchLoading}
  >
    {#if isSearchLoading}
      <Spinner color="white" size="5" />
    {:else}
      Search
    {/if}
  </Button>
</form>
<Helper color="red" class="my-2">
  {#if locationEmpty}
    <span class="font-semibold" transition:fade={{ duration: 125 }}>
      Cannot search until a location has been provided.
      <a
        href="/"
        class="font-bold underline underline-offset-2 cursor-pointer"
        on:click={(e) => {
          // TODO: Replace this with show zipcode modal
          e.preventDefault();
          alert("Show Location Modal");
        }}
      >
        Please update your location.
      </a>
    </span>
  {:else if searchError}
    <span class="font-semibold" transition:fade={{ duration: 125 }}>
      {searchError}
    </span>
  {/if}
</Helper>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#each searchResults as result}
    <Card size="lg">
      <div class="grow">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {result.name}
        </h5>
        <address
          class="font-normal text-gray-700 dark:text-gray-400 leading-tight"
        >
          {result.formatted_address}
        </address>
      </div>
      {#if !savedRestaurants.find((restaurant) => restaurant.id === result.place_id)}
        <Button
          color="primary"
          size="sm"
          class="w-full mt-2"
          on:click={() => addGoogleRestaurant(result)}
          disabled={isSearchLoading}
        >
          Add Restaurant
        </Button>{:else}
        <Button
          color="red"
          size="sm"
          class="w-full mt-2"
          on:click={() => removeGoogleRestaurant(result)}
          disabled={isSearchLoading}
        >
          Remove Restaurant
        </Button>
      {/if}
    </Card>
  {/each}
</div>

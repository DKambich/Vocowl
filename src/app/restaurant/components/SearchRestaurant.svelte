<script lang="ts">
  import { Button, Card, Helper, Input, Spinner } from "flowbite-svelte";
  import { createForm } from "svelte-forms-lib";
  import { MagnifyingGlass } from "svelte-heros-v2";
  import { MILES_TO_METERS } from "../../../constants";
  import { queryNearbyRestaurants } from "../../../services/GoogleMapsService";
  import {
    addRestaurant,
    preferences,
    removeRestaurant,
  } from "../../../stores/preferencesStore";
  import { showToast } from "../../../stores/toastStore";
  import type {
    PlacesSearchFormErrors,
    PlacesSearchFormValues,
    Restaurant,
    SearchPlacesResponse,
  } from "../../../types";

  export let location: google.maps.LatLngLiteral;

  let searchResults: google.maps.places.PlaceResult[] = [];
  let isSearchLoading = false;
  $: locationEmpty = !location;

  $: savedRestaurants = $preferences.restaurants;

  const formValues: PlacesSearchFormValues = {
    search: "",
  };

  const { errors, handleChange, handleSubmit } = createForm({
    initialValues: formValues,
    validate: validateForm,
    onSubmit: submitForm,
  });

  $: if (locationEmpty) {
    $errors.search =
      "Cannot search until a location has been provided. Please update your location.";
  } else {
    $errors.search = "";
  }

  function validateForm(values: PlacesSearchFormValues) {
    let errors: PlacesSearchFormErrors = {};
    if (values.search.trim() === "") {
      errors.search = "Search cannot be empty";
    }
    return errors;
  }

  function submitForm({ search }: PlacesSearchFormValues) {
    isSearchLoading = true;
    queryNearbyRestaurants({
      query: search,
      location: location,
      callback: handleSearchResults,
      radius: MILES_TO_METERS * 10,
    });
  }

  function handleSearchResults({ results, status }: SearchPlacesResponse) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      searchResults = results.filter((result) =>
        result.types.includes("restaurant")
      );
    } else {
      showToast({
        message: "There was an error. Please try again",
        type: "error",
        timeout: 3000,
      });
    }
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

<form class="flex gap-2" on:submit={handleSubmit}>
  <Input
    name="search"
    placeholder="Search"
    size="md"
    on:change={handleChange}
    disabled={locationEmpty}
    bind:value={formValues.search}
  >
    <MagnifyingGlass slot="left" size="20" />
  </Input>
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
<Helper class="my-2" color="red">
  {$errors.search}
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

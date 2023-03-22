<script lang="ts">
  import { Button, Card, Helper, Input, Spinner } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { MagnifyingGlass } from "svelte-heros-v2";
  import { POI_SERVICE } from "../../../constants";
  import type { IPOIService } from "../../../services/IPOIService";
  import {
    addRestaurant,
    localStorage,
    removeRestaurant,
  } from "../../../stores/localStorageStore";
  import { showToast } from "../../../stores/toastStore";
  import type {
    LatLng,
    PlacesSearchFormErrors,
    PlacesSearchFormValues,
    Restaurant,
  } from "../../../types";

  // External Variables
  export let location: LatLng;

  // Search Related Variables
  const poiService = getContext<IPOIService>(POI_SERVICE);
  let searchResults: Restaurant[] = [];
  let isSearchLoading = false;

  // Form Variables
  const formValues: PlacesSearchFormValues = {
    search: "",
  };

  const { errors, handleChange, handleSubmit } = createForm({
    initialValues: formValues,
    onSubmit: submitForm,
    validate: validateForm,
  });

  // Reactive Variables
  $: locationEmpty = !location;
  $: savedRestaurants = $localStorage.restaurants;

  $: if (locationEmpty) {
    $errors.search =
      "You must provide a location to search for restaurants. Please update your location.";
  } else {
    $errors.search = "";
  }

  async function submitForm({ search }: PlacesSearchFormValues) {
    isSearchLoading = true;
    const [restaurants, error] = await poiService.getQueriedRestaurants(
      search,
      location
    );
    isSearchLoading = false;
    if (error) {
      // TODO: Handle error better
      console.error(error);
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } else {
      searchResults = restaurants;
    }
  }

  function validateForm(values: PlacesSearchFormValues) {
    let errors: PlacesSearchFormErrors = {};
    if (values.search.trim() === "") {
      errors.search = "Search cannot be empty";
    }
    return errors;
  }

  function addQueriedRestaurant(restaurant: Restaurant) {
    addRestaurant(restaurant);
    showToast({
      message: `Added ${restaurant.name}`,
      type: "success",
      timeout: 2000,
    });
  }

  function removeQueriedRestaurant(restaurant: Restaurant) {
    removeRestaurant(restaurant);
    showToast({
      message: `Removed ${restaurant.name}`,
      type: "success",
      timeout: 2000,
    });
  }

  let searchRadius = 5;
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
{#if $errors.search}
  <Helper class="mt-2 mb-4" color="red">
    {$errors.search}
  </Helper>
{/if}

<div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
          {result.address}
        </address>
      </div>
      {#if !savedRestaurants.find((restaurant) => restaurant.id === result.id)}
        <Button
          color="primary"
          size="sm"
          class="w-full mt-2"
          on:click={() => addQueriedRestaurant(result)}
          disabled={isSearchLoading}
        >
          Add Restaurant
        </Button>{:else}
        <Button
          color="red"
          size="sm"
          class="w-full mt-2"
          on:click={() => removeQueriedRestaurant(result)}
          disabled={isSearchLoading}
        >
          Remove Restaurant
        </Button>
      {/if}
    </Card>
  {/each}
</div>

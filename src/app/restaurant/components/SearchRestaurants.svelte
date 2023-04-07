<script lang="ts">
  import { Button, Card, Helper, Input, Spinner } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { HandThumbDown, MagnifyingGlass, Minus, Plus } from "svelte-heros-v2";
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
  import {
    getFormattedAddress,
    getGoogleMapsSearchURL,
  } from "../../../utilities";
  import IconMessage from "../../shared/IconMessage.svelte";

  // External Variables
  export let location: LatLng;

  // Search Related Variables
  const poiService = getContext<IPOIService>(POI_SERVICE);
  let searchResults: Restaurant[] = [];
  let hasSearched = false;
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
    hasSearched = true;
    isSearchLoading = false;
    if (error) {
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
      <span class="font-bold">Search</span>
    {/if}
  </Button>
</form>
<Helper class="mt-2 mb-4" color="red">
  {$errors.search}
</Helper>

{#if searchResults.length === 0}
  <div class="py-8">
    {#if !hasSearched}
      <IconMessage icon={MagnifyingGlass} size="lg">
        Start Yor Search...
      </IconMessage>
    {:else}
      <IconMessage icon={HandThumbDown} size="lg">
        No Results Found. Please Try Another Search...
      </IconMessage>
    {/if}
  </div>
{/if}

<div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
  {#each searchResults as result (result.id)}
    <Card size="lg">
      <div class="flex flex-col gap-2">
        <div class="flex items-center">
          <div class="text-2xl font-bold tracking-tight grow">
            {result.name}
          </div>
          {#if !savedRestaurants.find((restaurant) => restaurant.id === result.id)}
            <Button
              pill
              color="primary"
              class="!p-1"
              on:click={() => addQueriedRestaurant(result)}
            >
              <Plus size="16" />
            </Button>
          {:else}
            <Button
              pill
              color="red"
              class="!p-1"
              on:click={() => removeQueriedRestaurant(result)}
            >
              <Minus size="16" />
            </Button>
          {/if}
        </div>
        <address>
          <a href={getGoogleMapsSearchURL(result)} target="_blank">
            {getFormattedAddress(result.address)}
          </a>
        </address>
      </div>
    </Card>
  {/each}
</div>

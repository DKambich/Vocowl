<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Card,
    Checkbox,
    Helper,
    P,
    Search,
  } from "flowbite-svelte";
  import { fade, fly } from "svelte/transition";

  export let location: google.maps.LatLngLiteral;

  // TODO: Remove this variable
  const dummySearchResults = [
    {
      placeID: 0,
      name: "Lakin Ltd",
      address: "8858 Bethel Circle, Joseland, MT 07259",
    },
    {
      placeID: 1,
      name: "Stark and Sons",
      address: "485 Camille Corner Apt. 264, North Christinebury, WY 56920",
    },
    {
      placeID: 2,
      name: "Feil LLC",
      address: "2821 Scarlett Shores, Bayerside, WA 84797-5224",
    },
    {
      placeID: 3,
      name: "Quitzon, Gerhold and Robel",
      address: "364 O'Connell Unions Apt. 566 Harmonyside, WI 98595",
    },
    {
      placeID: 4,
      name: "Howe Inc",
      address: "9457 Anissa Mall Suite 331 North Josuechester, WY 40357",
    },
    {
      placeID: 5,
      name: "Heller Inc",
      address: "6457 Mariam Flats Apt. 671 Margiefurt, NM 99341",
    },
    {
      placeID: 6,
      name: "Gutkowski, Romaguera and Doyle",
      address: "78681 Labadie Fords Lake Nikkiland, CO 26969",
    },
    {
      placeID: 7,
      name: "Padberg-Reynolds",
      address: "982 Hauck Track Suite 331 West Arnaldo, DE 35621",
    },
    {
      placeID: 8,
      name: "Pfannerstill, Jacobi and Auer",
      address: "37214 Brooklyn Ridge Rigobertomouth, CA 04574",
    },
    {
      placeID: 9,
      name: "Dooley, Runte and Strosin",
      address: "399 Arch View South Nicholauschester, DC 12369",
    },
  ];

  let searchResults = [];
  let searchInput = "";
  let searchError = "";

  $: locationEmpty = !location;

  // Handle changes to the search
  function onSearchChange(e: Event) {
    const target = e.target as HTMLInputElement;
    searchInput = target.value;
  }

  // Handle submission of the search
  function onSearchSubmit(e: Event) {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      searchResults = dummySearchResults;
      searchError = "";
    } else {
      searchError = "Search cannot be empty.";
    }

    // alert(`You are searching for: ${searchInput}`);
  }
</script>

<form class="flex gap-2" on:submit={onSearchSubmit}>
  <Search size="md" on:change={onSearchChange} disabled={locationEmpty} />
  <Button color="primary" type="submit" disabled={locationEmpty}>Search</Button>
</form>
<Helper color="red" class="py-2">
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
          {result.address}
        </address>
      </div>

      <Button color="primary" size="sm" class="w-full mt-2"
        >Add Restaurant</Button
      >
    </Card>
  {/each}
</div>

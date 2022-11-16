<script lang="ts">
  import { Button, ButtonGroup, Helper, Input, Tooltip } from "flowbite-svelte";
  import { MapPin } from "svelte-heros-v2";
  import { get } from "svelte/store";
  import {
    getLatLngFromZipcode,
    getZipcodeFromLatLng,
  } from "../api/GoogleMapsService";
  import { cacheLocation, preferences } from "../stores/preferencesStore";

  // External LatLng of the user's location
  export let userLocation: google.maps.LatLngLiteral =
    get(preferences).location.latlng;

  // Dictionary of geolocation error messages
  const zipcodeErrors = {
    DENIED:
      "Location service permissions were denied. Please re-enable or enter your zipcode manually.",
    UNAVAILABLE:
      "Location service could not retrieve your location. Please try again or enter your zipcode manually.",
    TIMEOUT:
      "Location service timed out retrieving your location. Please try again or enter your zipcode manually.",
    HARDWARE:
      "Location service is not available on this device. Please enter your zipcode manually.",
    UNKNOWN:
      "Location service could not identify your location. Please enter your zipcode manually.",
    INVALID:
      "Location service could not identify your location. Please enter a valid zipcode.",
    ERROR: "Location service encountered an error. Please try again.",
    NONE: "",
  };

  // Internal state variables
  let verifiedZipcode = get(preferences).location.zipcode;
  let userEnteredZipcode = verifiedZipcode;
  let zipcodeError = zipcodeErrors.NONE;

  // Function to geolocate the user's location and zipcode
  function geolocateZipcode() {
    // Check if the device has geolocation available
    if (navigator.geolocation) {
      // Get the user's location
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          try {
            // Geocode the user's zipcode from their location
            const geocodeResults = await (
              await getZipcodeFromLatLng(location)
            ).results;

            // If there geolocation results
            if (geocodeResults.length > 0) {
              // Store the verified zipcode
              for (let component of geocodeResults[0].address_components) {
                if (component.types.includes("postal_code")) {
                  verifiedZipcode = userEnteredZipcode = component.short_name;
                }
              }

              // Store the user's location
              userLocation = {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              };

              // Cache the location
              cacheLocation(userLocation, verifiedZipcode);

              // Clear zipcode errors
              zipcodeError = zipcodeErrors.NONE;
            } else {
              zipcodeError = zipcodeErrors.UNKNOWN;
            }
          } catch (e) {
            switch (e.code) {
              case google.maps.GeocoderStatus.ZERO_RESULTS:
              case google.maps.GeocoderStatus.INVALID_REQUEST:
                zipcodeError = zipcodeErrors.INVALID;
                break;
              case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
              case google.maps.GeocoderStatus.REQUEST_DENIED:
              case google.maps.GeocoderStatus.UNKNOWN_ERROR:
              case google.maps.GeocoderStatus.ERROR:
              default:
                zipcodeError = zipcodeErrors.ERROR;
                break;
            }
          }
        },
        (error) => {
          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              zipcodeError = zipcodeErrors.DENIED;
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              zipcodeError = zipcodeErrors.UNAVAILABLE;
              break;
            case GeolocationPositionError.TIMEOUT:
              zipcodeError = zipcodeErrors.TIMEOUT;
              break;
          }
        },
        { enableHighAccuracy: false }
      );
    } else {
      zipcodeError = zipcodeErrors.HARDWARE;
    }
  }

  // Function to verify the manually entered zipcode and set the location
  async function verifyandSetManualZipcode() {
    // Show an error if nothing is entered
    if (userEnteredZipcode.length === 0) {
      zipcodeError = zipcodeError = zipcodeErrors.INVALID;
      return;
    }
    try {
      // Geocode the user's location  from their zipcode
      const geocodeResults = await (
        await getLatLngFromZipcode(userEnteredZipcode)
      ).results;

      // If there geolocation results
      if (geocodeResults.length > 0) {
        // Store the verified zipcode
        verifiedZipcode = userEnteredZipcode;

        // Store the user's location
        const {
          geometry: { location },
        } = geocodeResults[0];
        userLocation = {
          lat: location.lat(),
          lng: location.lng(),
        };

        // Cache the location
        cacheLocation(userLocation, verifiedZipcode);

        // Clear zipcode errors
        zipcodeError = zipcodeErrors.NONE;
      } else {
        zipcodeError = zipcodeErrors.UNKNOWN;
      }
    } catch (e) {
      switch (e.code) {
        case google.maps.GeocoderStatus.ZERO_RESULTS:
        case google.maps.GeocoderStatus.INVALID_REQUEST:
          zipcodeError = zipcodeErrors.INVALID;
          break;
        case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
        case google.maps.GeocoderStatus.REQUEST_DENIED:
        case google.maps.GeocoderStatus.UNKNOWN_ERROR:
        case google.maps.GeocoderStatus.ERROR:
        default:
          zipcodeError = zipcodeErrors.ERROR;
          break;
      }
    }
  }
</script>

<div class="my-4 mx-2 md:mx-0">
  <ButtonGroup class="w-full">
    <Input
      type="text"
      placeholder="Enter Zipcode..."
      bind:value={userEnteredZipcode}
      color={zipcodeError === zipcodeErrors.NONE ? "base" : "red"}
      on:change={verifyandSetManualZipcode}
    />
    <Button on:click={geolocateZipcode} color="alternative">
      <MapPin />
    </Button>
    <Tooltip placement="bottom">Use My Location</Tooltip>
    <Button on:click={verifyandSetManualZipcode} color="primary">Set</Button>
  </ButtonGroup>
  <!-- Error or Helper Text -->
  <Helper
    class="mt-2"
    color={zipcodeError === zipcodeErrors.NONE ? "gray" : "red"}
  >
    <span class="font-bold">
      {#if zipcodeError !== zipcodeErrors.NONE}
        {zipcodeError}
      {:else if verifiedZipcode}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${verifiedZipcode}`}
          target="_blank"
          rel="noreferrer"
          class="underline"
        >
          Currently using {verifiedZipcode}
        </a>
      {:else}
        No zipcode is selected
      {/if}
    </span>
  </Helper>
</div>

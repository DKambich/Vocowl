import { MILES_TO_METERS } from "../constants";
import { map } from "../stores/googleMapsStore";
import type { NearbyPlacesRequest } from "../types";

let storedMap: google.maps.Map;

map.subscribe((map) => (storedMap = map));

export function getNearbyRestaurants({
  callback,
  location,
  map = storedMap,
  radius = MILES_TO_METERS,
  rankBy = 0,
  openNow = false,
}: NearbyPlacesRequest): void {
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: location,
      radius: radius,
      rankBy: rankBy,
      openNow: openNow,
      type: "restaurant",
    },
    (results, _, pagination) => callback({ results, pagination })
  );
  // return new Promise((resolve, reject) => {
  //   service.nearbySearch(
  //     {
  //       location: location,
  //       radius: radius,
  //       type: "restaurant",
  //     },
  //     (results, _, pagination) => resolve({ results, pagination })
  //   );
  // }
  // );
}

export function getZipcodeFromLatLng(
  location: GeolocationPosition | google.maps.LatLngLiteral | google.maps.LatLng
): Promise<google.maps.GeocoderResponse> {
  const geocoder = new google.maps.Geocoder();
  let castedLocation: google.maps.LatLngLiteral;
  if (location instanceof GeolocationPosition) {
    castedLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  } else if (location instanceof google.maps.LatLng) {
    castedLocation = {
      lat: location.lat(),
      lng: location.lng(),
    };
  } else {
    castedLocation = location;
  }

  return geocoder.geocode({ location: castedLocation });
}

export function getLatLngFromZipcode(
  zipcode: string
): Promise<google.maps.GeocoderResponse> {
  const geocoder = new google.maps.Geocoder();
  return geocoder.geocode({ address: zipcode });
}

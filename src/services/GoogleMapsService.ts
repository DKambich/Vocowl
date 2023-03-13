import { MILES_TO_METERS } from "../constants";
import { map } from "../stores/googleMapsStore";
import type {
  NearbyPlacesRequest,
  Restaurant,
  SearchPlacesRequest,
} from "../types";

let storedMap: google.maps.Map;

map.subscribe((map) => (storedMap = map));

export function queryNearbyRestaurants({
  callback,
  query,
  location,
  radius = 5 * MILES_TO_METERS,
  map = storedMap,
}: SearchPlacesRequest) {
  let service = new google.maps.places.PlacesService(map);
  const searchCircle = new google.maps.Circle();
  searchCircle.setCenter(location);
  searchCircle.setRadius(radius);
  service.findPlaceFromQuery(
    {
      query,
      locationBias: searchCircle,
      fields: ["name", "formatted_address", "geometry", "place_id", "types"],
    },
    (results, status) => callback({ results, status })
  );
}

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

export function generateGoogleMapsURL(restaurant: Restaurant) {
  const url = "https://www.google.com/maps/search/?api=1";
  let query = `&query=`;
  query += `${restaurant.name}`;
  if (restaurant.location) {
    query += `+${restaurant.location.lat},${restaurant.location.lng}`;
  }
  query += `&query_place_id=${restaurant.id}`;
  return encodeURI(`${url}${query}`);
}

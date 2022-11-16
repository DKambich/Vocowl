import { map } from "../stores/googleMapsStore";

let storedMap: google.maps.Map;

map.subscribe((map) => (storedMap = map));

type LocalPlacesRequest = {
  distance?: number;
  location: google.maps.LatLngLiteral;
  map?: google.maps.Map;
};
export function getLocalRestaurants({
  distance = 1000,
  location,
  map = storedMap,
}: LocalPlacesRequest): Promise<google.maps.places.PlaceResult[]> {
  let service = new google.maps.places.PlacesService(map);
  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location: location,
        radius: distance,
        type: "restaurant",
      },
      (placeResults) => resolve(placeResults)
    );
  });
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

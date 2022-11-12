import { map } from "../stores/googleMapsStore";

let storedMap: google.maps.Map;

map.subscribe((map) => (storedMap = map));

type LocalPlacesRequest = {
  distance?: number;
  location: google.maps.LatLngLiteral;
};
export function getLocalRestaurants({
  distance = 1000,
  location,
}: LocalPlacesRequest): Promise<google.maps.places.PlaceResult[]> {
  let service = new google.maps.places.PlacesService(storedMap);
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

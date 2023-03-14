import type { LatLng } from "../types";

const BASE_URL = "https://geocode.maps.co/";

type ReverseGeocodeResult = {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road: string;
    neighbourhood: string;
    town: string;
    county: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: string[];
};

type GeocodeResult = {
  place_id: number;
  licence: string;
  powered_by: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}[];

export function getZipcodeFromLocation(location: LatLng): Promise<string> {
  const REVERSE_GEOCODE_URL = `${BASE_URL}/reverse`;
  const QUERY = new URLSearchParams({
    lat: location.lat.toString(),
    lon: location.lng.toString(),
  }).toString();

  return fetch(`${REVERSE_GEOCODE_URL}?${QUERY}`)
    .then((res) => res.json())
    .then(
      (reverseGeocode: ReverseGeocodeResult) => reverseGeocode?.address.postcode
    );
}

export function getLocationFromZipcode(zipcode: string): Promise<LatLng> {
  const GEOCODE_URL = `${BASE_URL}/search`;
  const QUERY = new URLSearchParams({
    q: `${zipcode},US`,
  }).toString();

  return fetch(`${GEOCODE_URL}?${QUERY}`)
    .then((res) => res.json())
    .then((geocodes: GeocodeResult) => ({
      lat: Number.parseFloat(geocodes[0].lat),
      lng: Number.parseFloat(geocodes[0].lon),
    }));
}

import type { LatLng } from "../types";
import type { IGeocodingService } from "./IGeocodingService";

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

export class GeocodeGeocodingService implements IGeocodingService {
  private BASE_URL = "https://geocode.maps.co/";

  async getZipcodeFromLocation(location: LatLng): Promise<string> {
    const REVERSE_GEOCODE_URL = `${this.BASE_URL}/reverse`;
    const QUERY = new URLSearchParams({
      lat: location.lat.toString(),
      lon: location.lng.toString(),
    }).toString();

    const res = await fetch(`${REVERSE_GEOCODE_URL}?${QUERY}`);
    const reverseGeocode = await res.json();
    return reverseGeocode?.address.postcode;
  }

  async getLocationFromZipcode(
    zipcode: string,
    countryCode: string = "US"
  ): Promise<LatLng> {
    const GEOCODE_URL = `${this.BASE_URL}/search`;
    const QUERY = new URLSearchParams({
      q: `${zipcode},${countryCode}`,
    }).toString();

    const res = await fetch(`${GEOCODE_URL}?${QUERY}`);
    const geocodes = await res.json();
    return {
      lat: Number.parseFloat(geocodes[0].lat),
      lng: Number.parseFloat(geocodes[0].lon),
    };
  }
}

import type { Address, LatLng, ServiceResponse } from "../types";
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

  async getAddressFromLocation(
    location: LatLng
  ): Promise<ServiceResponse<Address>> {
    const REVERSE_GEOCODE_URL = `${this.BASE_URL}/reverse`;
    const QUERY = new URLSearchParams({
      lat: location.lat.toString(),
      lon: location.lng.toString(),
    }).toString();

    try {
      const response = await fetch(`${REVERSE_GEOCODE_URL}?${QUERY}`);
      if (response.ok) {
        const json: ReverseGeocodeResult = await response.json();

        const address = {
          address1: json.address.road,
          address2: "",
          city: json.address.town,
          state: json.address.state,
          zipcode: json.address.postcode,
        };

        return [address, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async getLocationFromAddress(
    address: Address
  ): Promise<ServiceResponse<LatLng>> {
    const GEOCODE_URL = `${this.BASE_URL}/search`;

    const { address1, address2, city, state, zipcode } = address;

    const QUERY = new URLSearchParams({
      q: `${address1},${address2},${city},${state} ${zipcode},US`,
    }).toString();

    try {
      const response = await fetch(`${GEOCODE_URL}?${QUERY}`);
      if (response.ok) {
        const geocodes: GeocodeResult = await response.json();
        if (geocodes.length === 0) {
          return [null, "No results found"];
        }

        const latLng = {
          lat: Number.parseFloat(geocodes[0].lat),
          lng: Number.parseFloat(geocodes[0].lon),
        };

        return [latLng, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async getZipcodeFromLocation(
    location: LatLng
  ): Promise<ServiceResponse<string>> {
    const REVERSE_GEOCODE_URL = `${this.BASE_URL}/reverse`;
    const QUERY = new URLSearchParams({
      lat: location.lat.toString(),
      lon: location.lng.toString(),
    }).toString();

    try {
      const response = await fetch(`${REVERSE_GEOCODE_URL}?${QUERY}`);
      if (response.ok) {
        const json: ReverseGeocodeResult = await response.json();

        const zipcode = json.address?.postcode;
        if (!zipcode) {
          return [null, "No zipcode found"];
        }

        return [zipcode, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async getLocationFromZipcode(
    zipcode: string,
    countryCode: string = "US"
  ): Promise<ServiceResponse<LatLng>> {
    const GEOCODE_URL = `${this.BASE_URL}/search`;
    const QUERY = new URLSearchParams({
      q: `${zipcode},${countryCode}`,
    }).toString();

    try {
      const response = await fetch(`${GEOCODE_URL}?${QUERY}`);
      if (response.ok) {
        const geocodes: GeocodeResult = await response.json();
        if (geocodes.length === 0) {
          return [null, "No results found"];
        }

        const latLng = {
          lat: Number.parseFloat(geocodes[0].lat),
          lng: Number.parseFloat(geocodes[0].lon),
        };

        return [latLng, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }
}

import { HERE_API_KEY } from "../credentials";
import type { LatLng, Restaurant, ServiceResponse } from "../types";
import type { IPOIService } from "./IPOIService";

type HereResponse = {
  items: [
    {
      title: string;
      id: string;
      address: {
        label: string;
        countryCode: string;
        countryName: string;
        stateCode: string;
        state: string;
        city: string;
        street: string;
        postalCode: string;
        houseNumber: string;
      };
      position: {
        lat: number;
        lng: number;
      };
    }
  ];
};

export class HerePOIService implements IPOIService {
  private DISCOVER_URL = "https://discover.search.hereapi.com/v1/discover";
  private BROWSE_URL = "https://browse.search.hereapi.com/v1/browse";

  async getQueriedRestaurants(
    query: string,
    location: LatLng,
    options?: { radius?: number }
  ): Promise<ServiceResponse<Restaurant[]>> {
    const SEARCH_RADIUS_METERS = 8047;
    const QUERY = new URLSearchParams({
      apiKey: HERE_API_KEY,
      q: query,
      in: `circle:${location.lat},${location.lng};r=${SEARCH_RADIUS_METERS}`,
    }).toString();

    try {
      const response = await fetch(`${this.DISCOVER_URL}?${QUERY}`);
      if (response.ok) {
        const json: HereResponse = await response.json();

        const restaurants = json.items.map<Restaurant>((item) => {
          const {
            id,
            title,
            position,
            address: { houseNumber, street, city, stateCode, postalCode },
          } = item;
          return {
            id: id,
            name: title,
            source: "here",
            location: position,
            address: `${houseNumber} ${street}, ${city}, ${stateCode} ${postalCode}`,
          };
        });

        return [restaurants, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }

  async getNearbyRestaurants(
    location: LatLng,
    options?: { radius?: number }
  ): Promise<ServiceResponse<Restaurant[]>> {
    const SEARCH_RADIUS_METERS = Math.round(options.radius ?? 8047);
    const QUERY = new URLSearchParams({
      apiKey: HERE_API_KEY,
      at: `${location.lat},${location.lng}`,
      in: `circle:${location.lat},${location.lng};r=${SEARCH_RADIUS_METERS}`,
      categories: "100",
      limit: "50",
    }).toString();

    try {
      const response = await fetch(`${this.BROWSE_URL}?${QUERY}`);
      if (response.ok) {
        const json: HereResponse = await response.json();

        const restaurants = json.items.map<Restaurant>((item) => {
          const {
            id,
            title,
            position,
            address: { houseNumber, street, city, stateCode, postalCode },
          } = item;
          return {
            id: id,
            name: title,
            source: "here",
            location: position,
            address: `${houseNumber} ${street}, ${city}, ${stateCode} ${postalCode}`,
          };
        });

        return [restaurants, null];
      } else {
        return [null, response.statusText];
      }
    } catch (error) {
      return [null, error];
    }
  }
}

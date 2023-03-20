import type { Restaurant } from "../app/restaurant";
import type { LatLng } from "../types";

type POISearchOptions = {
  radius?: number;
};

export interface IPOIService {
  getQueriedRestaurants: (
    query: string,
    location: LatLng,
    options?: POISearchOptions
  ) => Promise<Restaurant[]>;

  getNearbyRestaurants: (
    location: LatLng,
    options?: POISearchOptions
  ) => Promise<Restaurant[]>;
}

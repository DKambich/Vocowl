import type { LatLng, Restaurant, ServiceResponse } from "../types";

type POISearchOptions = {
  radius?: number;
};

export interface IPOIService {
  getQueriedRestaurants: (
    query: string,
    location: LatLng,
    options?: POISearchOptions
  ) => Promise<ServiceResponse<Restaurant[]>>;

  getNearbyRestaurants: (
    location: LatLng,
    options?: POISearchOptions
  ) => Promise<ServiceResponse<Restaurant[]>>;
}

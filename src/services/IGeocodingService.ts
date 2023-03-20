import type { LatLng } from "../types";

export interface IGeocodingService {
  getZipcodeFromLocation: (location: LatLng) => Promise<string>;
  getLocationFromZipcode: (
    zipcode: string,
    countryCode?: string
  ) => Promise<LatLng>;
}

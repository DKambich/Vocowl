import type { Address, LatLng, ServiceResponse } from "../types";

export interface IGeocodingService {
  getAddressFromLocation: (
    location: LatLng
  ) => Promise<ServiceResponse<Address>>;
  getZipcodeFromLocation: (location: LatLng) => Promise<string>;
  getLocationFromZipcode: (
    zipcode: string,
    countryCode?: string
  ) => Promise<LatLng>;
}

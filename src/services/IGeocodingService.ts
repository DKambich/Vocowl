import type { Address, LatLng, ServiceResponse } from "../types";

export interface IGeocodingService {
  getAddressFromLocation: (
    location: LatLng
  ) => Promise<ServiceResponse<Address>>;

  getLocationFromAddress: (
    address: Address
  ) => Promise<ServiceResponse<LatLng>>;

  getZipcodeFromLocation: (
    location: LatLng
  ) => Promise<ServiceResponse<string>>;

  getLocationFromZipcode: (
    zipcode: string,
    countryCode?: string
  ) => Promise<ServiceResponse<LatLng>>;
}

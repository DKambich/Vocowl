export type Restaurant = {
  id: string;
  name: string;
  address?: string;
  location?: google.maps.LatLngLiteral;
};

export type Preferences = {
  useDarkTheme: boolean;
  restaurants: Restaurant[];
  location: {
    latlng: google.maps.LatLngLiteral;
    zipcode: string;
  };
};

export type ToastOptions = {
  id?: string;
  type: "info" | "warning" | "success" | "error";
  message: string;
  dismissible?: boolean;
  timeout?: number;
};

export type SearchPlacesRequest = {
  callback: (res: SearchPlacesResponse) => void;
  query: string;
  location: google.maps.LatLngLiteral;
  radius?: number;
  map?: google.maps.Map;
};

export type SearchPlacesResponse = {
  results: google.maps.places.PlaceResult[];
  status: google.maps.places.PlacesServiceStatus;
};

export type NearbyPlacesRequest = {
  callback: (res: NearbyPlacesResponse) => void;
  location: google.maps.LatLngLiteral;
  map?: google.maps.Map;
  radius?: number;
  rankBy?: number;
  openNow?: boolean;
};

export type NearbyPlacesResponse = {
  results: google.maps.places.PlaceResult[];
  pagination: google.maps.places.PlaceSearchPagination;
};

export type GeographicState = {
  name: string;
  abbreviation: string;
};

export type PlacesSearchFormValues = {
  search: string;
};

export type PlacesSearchFormErrors = {
  search?: string;
};

export type ManualPlaceFormValues = {
  restaurant: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
};

export type ManualPlaceFormErrors = {
  restaurant?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
};

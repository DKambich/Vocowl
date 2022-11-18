export type Preferences = {
  useDarkTheme: boolean;
  restaurants: [];
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

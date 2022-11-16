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

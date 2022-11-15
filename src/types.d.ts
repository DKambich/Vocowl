export type Preferences = {
  useDarkTheme: boolean;
  restaurants: [];
  location: {
    latlng: google.maps.LatLngLiteral;
    zipcode: string;
  };
};

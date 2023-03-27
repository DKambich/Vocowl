import type { Address, Restaurant } from "./types";

export function GUID() {
  let a, b, c, d;
  a = Math.floor(Math.random() * 0x10000).toString(16);
  b = Math.floor(Math.random() * 0x10000).toString(16);
  c = Math.floor(Math.random() * 0x10000).toString(16);
  d = Math.floor(Math.random() * 0x10000).toString(16);
  return `${a}-${b}-${c}-${d}`;
}

export function getFormattedAddress(address: Address): string {
  const { address1, city, state, zipcode } = address;
  const address2 = address.address2 ? ` ${address.address2}` : "";
  return `${address1}${address2}, ${city}, ${state} ${zipcode}`;
}

export function getGoogleMapsURL(restaurant: Restaurant) {
  const url = "https://www.google.com/maps/search/?api=1";
  const { name, address } = restaurant;
  const urlParams = new URLSearchParams();

  if (address) {
    urlParams.append(
      "query",
      `${name} ${getFormattedAddress(address).replaceAll(",", "")}`
    );
  } else {
    urlParams.append("query", `${name}`);
  }

  return `${url}&${urlParams.toString()}`;
}

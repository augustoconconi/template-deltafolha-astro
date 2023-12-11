import { map } from "nanostores";

export const $latlon = map({
  lat: null,
  lon: null,
  error: null,
});

export const $imageMap = map({
  filename: null,
  format: null,
  binary: null,
});

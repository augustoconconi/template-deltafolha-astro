import { map, atom } from "nanostores";

export const $SliderControl = map({
  startAt: null,
  selected: null,
});

export const $SliderSelected = atom(0);

export const $Massa = atom();
export const $Milei = atom();

export const $SliderContent = map({
  values: null,
  labels: null,
});

export const $SliderMarks = map();

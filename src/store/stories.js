import { map, atom } from "nanostores";

export const $StoryData = map({
  cod_ibge: null,
  sigla_uf: null,
  municipio: null,
  lat: null,
  lon: null,
  zoom: null,
});

export const $Story = atom(0);

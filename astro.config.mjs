import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

const DEV = import.meta.env.DEV;
const DELTAPATH = "/deltafolha/2023/desmatamento-amazonia";
export const DELTAURL = DEV
  ? "http://localhost:3000"
  : `https://arte.folha.uol.com.br${DELTAPATH}`;
const DELTASITE = DEV
  ? "http://localhost:3000"
  : `https://arte.folha.uol.com.br`;

export default defineConfig({
  compressHTML: true,
  base: DEV ? "" : DELTAPATH,
  site: DELTASITE,
  trailingSlash: "never",
  integrations: [react(), svelte(), tailwind()],
  build: {
    assets: "deltacompiler",
    inlineStylesheets: `auto`,
  },
});

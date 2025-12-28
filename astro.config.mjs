// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://ngdio.github.io",
  base: process.env.GITHUB_PAGES === "true" ? "/vernissage-astro" : "",

  image: {
    domains: ["images.unsplash.com"],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});

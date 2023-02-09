// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Outlandnish";
export const SITE_SHORT_TITLE = "OTLNDSH";
export const SITE_DESCRIPTION =
  "Movement is my jam. From hacking micromobility to travel and personal fitness, this blog chronicles the way I explore it.";
export const GITHUB_HANDLE = "@outlandnish";
export const MY_NAME = "Nishanth Samala";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;

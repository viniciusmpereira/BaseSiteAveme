import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://base-site-aveme-r1z4lbu53-aveme.vercel.app/',
  integrations: [mdx(), sitemap(), react(), tailwind()],
  output: "server",
  adapter: vercel()
});
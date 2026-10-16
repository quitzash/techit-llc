// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://techit-llc.com',
  // Static by default (all pages prerendered). The contact API route opts
  // into on-demand rendering with `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
});

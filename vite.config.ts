import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Use relative paths for itch.io compatibility
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});

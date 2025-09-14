import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        qui: resolve(__dirname, "qui-je-suis.html"),
        secretariat: resolve(__dirname, "secretariat.html"),
        portfolio: resolve(__dirname, "portfolio.html"),
        services: resolve(__dirname, "services.html"),
      },
    },
  },
});

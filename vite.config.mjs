// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // CoinGecko – unchanged
      "/api": {
        target: "https://api.coingecko.com/api",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },

      // Pump.fun – **target is pump.fun (NOT client-api)**
      "/pump-api": {
        target: "https://pump.fun",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/pump-api/, ""),
      },
    },
  },
});
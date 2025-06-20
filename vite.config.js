import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request to /api/... will be forwarded to https://api.coingecko.com
      "/api": {
        target: "https://api.coingecko.com/api", 
        changeOrigin: true,
        // strip the leading /api so /api/v3 → /v3
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
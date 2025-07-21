// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: [{ find: 'buffer', replacement: 'buffer/' }],
  },
  define: { 'process.env': {} },
  optimizeDeps: { include: ['buffer'] },
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

      // call  http://localhost:5173/pump/active?page=0&limit=100
      '/pump': {
        target: 'https://client-api.pump.fun/v1/launchpad',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pump/, ''),
      },
    },
  },
});
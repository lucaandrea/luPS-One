import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "vite-plugin-vercel";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    cors: {
      origin: "*",
    },
    proxy: {
      // Proxy API requests to the separate API server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to API Server:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from API Server:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  plugins: [
    react(), 
    tailwindcss(), 
    vercel({
      expiration: 60 * 60 * 24 * 7,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  vercel: {
    defaultSupportsResponseStreaming: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
          ],
          audio: ["tone", "wavesurfer.js", "audio-buffer-utils"],
        },
      },
    },
    sourcemap: false,
    minify: true,
  },
});

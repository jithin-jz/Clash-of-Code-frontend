import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false, // Allow fallback if 5173 is busy
    proxy: {
        '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
        },
        '/media': {
            target: 'http://localhost:8000',
            changeOrigin: true,
        }
    }
  },
});

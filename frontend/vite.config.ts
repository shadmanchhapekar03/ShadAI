import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/chat": {
        target: "https://shadai-69d5.onrender.com/",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
          markdown: ["react-markdown", "remark-gfm"],
          highlight: ["react-syntax-highlighter"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import http from "http";

const LOCAL_URL = "http://localhost:8000";
const RENDER_URL = "https://shadai-69d5.onrender.com/";

function resolveTarget() {
  return new Promise<string>((resolve) => {
    const req = http.get(LOCAL_URL, { timeout: 2000 }, () => {
      req.destroy();
      resolve(LOCAL_URL);
    });
    req.on("error", () => resolve(RENDER_URL));
    req.on("timeout", () => {
      req.destroy();
      resolve(RENDER_URL);
    });
  });
}

export default defineConfig(async () => {
  const target = await resolveTarget();
  return {
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
          target,
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

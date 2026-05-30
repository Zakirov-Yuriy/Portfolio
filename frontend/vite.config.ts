import { defineConfig, loadEnv } from "vite";

// В dev-режиме запросы к /api проксируются на локальный FastAPI (порт 8000),
// чтобы не возиться с CORS. В проде фронт ходит на VITE_API_BASE_URL.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_DEV_API_TARGET || "http://127.0.0.1:8000";

  return {
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});

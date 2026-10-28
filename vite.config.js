import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  server: {
    watch: {
      // Saídas de build e do electron-forge: arquivos travados ali (ex: .nupkg do Squirrel) derrubam o watcher com EBUSY.
      ignored: ["**/out/**", "**/dist/**", "**/electron/**"],
    },
  },
  plugins: [react()],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getOutDir() {
  if (process.env.SAITURI_ENV === "test") {
    return "../../dist-test";
  }
  return "../../dist";
}

export default defineConfig({
  publicDir: "../../public",
  cacheDir: `../../vite-cache/${process.env.SAITURI_ENV ?? "development"}`,
  build: {
    outDir: getOutDir(),
  },
  server: {
    port: 1234,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
      },
    },
  },
  plugins: [react()],
});

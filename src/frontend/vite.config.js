import { defineConfig } from "vite";

function getOutDir() {
  console.log("process.env.SAITURI_ENV", process.env.SAITURI_ENV);
  if (process.env.SAITURI_ENV === "test") {
    console.log("returning test dist");
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
});

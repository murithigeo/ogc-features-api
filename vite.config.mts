/// <reference types="vitest" />
import { defineConfig, } from "vite";

export default defineConfig({
  //TODO: Add tests
  test: {
    disableConsoleIntercept: true,
    setupFiles: ["./src/server.setup.ts"],
    hookTimeout: 20000,
  },
});

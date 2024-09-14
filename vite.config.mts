/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import nodeExternals from "rollup-plugin-node-externals";
import copyPlugin from "rollup-plugin-copy";
import yamlLoadPlugin from "@rollup/plugin-yaml";
export default defineConfig({
  //TODO: Add tests
  test: {
    disableConsoleIntercept: true,
    setupFiles: ["./src/server.setup.ts"],
    hookTimeout: 20000,
  },
  build: {
    emptyOutDir: false,
    outDir: "dist",
    target: "es2022",
    rollupOptions: {
      treeshake: true,
      input: "src/server.ts",
      output: {
        esModule: true,
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
      plugins: [
        //yamlLoadPlugin(),

        copyPlugin({
          hook: "buildStart",
          targets: [
            {
              src: "src/openapi/openapi.yaml",
              dest: "dist",
            },
          ],
          copySync: true,
        }),

        nodeExternals(), //jsonRollup()
      ],
    },
  },
});

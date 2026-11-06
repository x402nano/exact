import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/typescript/index.ts",
    "client/index": "src/typescript/client/index.ts",
    "server/index": "src/typescript/server/index.ts",
    "facilitator/index": "src/typescript/facilitator/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "es2020",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);

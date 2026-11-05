import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    exclude: ["**/node_modules/**", "**/dist/**", "**/test/integration/**"],
  },
  resolve: {tsconfigPaths: true},
}));

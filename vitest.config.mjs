// vitest.config.ts (or vite.config.ts)
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      env: envVars,
      exclude: ["**/node_modules/**", "**/dist/**", "**/test/integration/**"],
    },
  }
})

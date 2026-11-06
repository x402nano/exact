import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      env: envVars,
      include: ["src/typescript/test/integration/**/*.test.ts"],
    },
  }
})

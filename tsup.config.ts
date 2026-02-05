import { defineConfig } from 'tsup'

const baseConfig = {
  compilerOptions: {
    module: 'nodenext', // Or "node16" (equivalent in most cases)
    moduleResolution: 'nodenext', // This is the key change that enables proper ESM export resolution
    target: 'esnext', // Often paired with the above
    esModuleInterop: true, // Helpful for interoperability
    allowSyntheticDefaultImports: true,
  },
  entry: {
    index: 'src/typescript/index.ts',
    'client/index': 'src/typescript/client/index.ts',
    'server/index': 'src/typescript/server/index.ts',
    'facilitator/index': 'src/typescript/facilitator/index.ts',
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: 'es2020',
}

export default defineConfig([
  {
    ...baseConfig,
    format: 'esm',
    outDir: 'dist/esm',
    clean: true,
  },
  {
    ...baseConfig,
    format: 'cjs',
    outDir: 'dist/cjs',
    clean: false,
  },
])

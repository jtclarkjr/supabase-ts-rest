import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    outDir: 'dist',
    dts: true,
    format: ['esm'],
    platform: 'neutral',
    sourcemap: true
  },
  test: {
    include: ['src/**/*.test.ts']
  },
  lint: {
    ignorePatterns: ['node_modules/', 'dist/**'],
    rules: {
      'no-unused-vars': 'deny',
      'no-explicit-any': 'deny'
    },
    options: {
      typeAware: true,
      typeCheck: true
    }
  },
  fmt: {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    printWidth: 80,
    trailingComma: 'none',
    proseWrap: 'always',
    sortPackageJson: false,
    ignorePatterns: ['dist/**', 'node_modules/**']
  }
})

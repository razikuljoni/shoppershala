import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// Resolve subpath imports for Vitest
const alias = {};
for (const [aliasName, aliasPath] of Object.entries(pkg.imports)) {
  const name = aliasName.replace(/\/\*$/, '');
  const resolved = path.resolve(__dirname, aliasPath.replace(/\/\*$/, ''));
  alias[name] = resolved;
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'src/scripts/**'],
    },
  },
  resolve: {
    alias,
  },
});

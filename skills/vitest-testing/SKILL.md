# Vitest Testing

## Setup

- Backend: configured in `apps/backend/vitest.config.js`
- Test runner: Vitest v4
- Coverage: V8 provider (text + lcov)

## Conventions

- Test files: `*.test.js` co-located next to source files
- Import helpers from `vitest`: `describe`, `it`, `expect`, `beforeEach`, `mock`
- Backend tests require MongoDB running for integration tests
- Unit tests should mock external dependencies (DB, network)

## Running Tests

```bash
pnpm test                            # All workspace tests
pnpm --filter ./apps/backend test    # Backend tests only
pnpm --filter ./apps/backend test:watch  # Watch mode
pnpm --filter ./apps/backend test -- --coverage  # With coverage
```

## Writing Tests

```js
import { describe, it, expect } from 'vitest';

describe('Module Name', () => {
  it('should do something specific', async () => {
    const result = await someFunction(input);
    expect(result).toBe(expected);
  });
});
```

## Mocking

For tests needing MongoDB, mock the `#config/db.js` module:

```js
import { vi } from 'vitest';
vi.mock('#config/db.js', () => ({
  getDb: () => ({
    collection: () => ({
      /* mocked methods */
    }),
  }),
}));
```

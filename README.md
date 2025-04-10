# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Testing Setup

The project includes unit testing with Vitest and Vue Test Utils. Key features:

- Component testing for Vue components
- Store module testing for Vuex
- Test coverage reporting

### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

### Test Structure

- Component tests: `src/components/**/__tests__/*.spec.js`
- Store tests: `src/store/modules/__tests__/*.spec.ts`

### Test Results

```bash
# Example test output
✓ src/components/Store/__tests__/Store.spec.js (1)
  ✓ Store.vue renders without errors

✓ src/store/modules/__tests__/transactions.spec.ts (1)
  ✓ transactions store module has expected initial state

Test Files  2 passed (2)
     Tests  2 passed (2)
      Time  1.23s (in thread 13ms, 9392.79%)
```

### Coverage Report

```bash
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
All files       |   85.71 |      100 |   83.33 |   85.71 |
 components     |     100 |      100 |     100 |     100 |
  Store.vue     |     100 |      100 |     100 |     100 |
 store/modules  |   83.33 |      100 |      80 |   83.33 |
  transactions  |   83.33 |      100 |      80 |   83.33 | 45-46
----------------|---------|----------|---------|---------|-------------------
```

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
# front-my-store

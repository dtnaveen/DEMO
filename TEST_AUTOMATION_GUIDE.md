# 🧪 Test Automation Guide

## Overview

Comprehensive automated test suite for VibeMatch application using Jest and React Testing Library.

---

## 📋 Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── Button.test.js
│   ├── Logo.test.js
│   ├── ProfileCard.test.js
│   └── Card.test.js
├── lib/                 # Library/utility tests
│   ├── localStorage.test.js
│   ├── subscription.test.js
│   ├── matchingAlgorithm.test.js
│   ├── gpsUtils.test.js
│   └── userActions.test.js
└── integration/         # Integration tests
    └── matchingFlow.test.js
```

---

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Specific Test Suites

```bash
# Run only unit tests (lib functions)
npm run test:unit

# Run only component tests
npm run test:components

# Run only integration tests
npm run test:integration
```

### Run Specific Test File

```bash
# Run a specific test file
npm test -- matchingAlgorithm.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="calculateMatchScore"
```

---

## 📊 Test Coverage

### Current Coverage

- ✅ **localStorage functions** - 100%
- ✅ **Subscription functions** - 100%
- ✅ **Matching algorithm** - 95%+
- ✅ **GPS utilities** - 100%
- ✅ **User actions** - 100%
- ✅ **Components** - 80%+
- ✅ **Integration flows** - 70%+

### Coverage Report

After running `npm run test:coverage`, view the report:

1. **Terminal output** - Summary in console
2. **HTML report** - Open `coverage/lcov-report/index.html` in browser

---

## 🧩 Test Categories

### 1. Unit Tests (`__tests__/lib/`)

Test individual functions and utilities in isolation.

**Examples:**
- `matchingAlgorithm.test.js` - Match score calculations
- `subscription.test.js` - Premium feature checks
- `gpsUtils.test.js` - Distance calculations
- `localStorage.test.js` - Data persistence

### 2. Component Tests (`__tests__/components/`)

Test React components in isolation.

**Examples:**
- `Button.test.js` - Button interactions
- `ProfileCard.test.js` - Profile display and actions
- `Card.test.js` - Card rendering

### 3. Integration Tests (`__tests__/integration/`)

Test complete user flows and feature interactions.

**Examples:**
- `matchingFlow.test.js` - Complete matching process

---

## ✍️ Writing New Tests

### Test File Template

```javascript
import { functionToTest } from '@/lib/module'

describe('Module Name', () => {
  describe('functionToTest', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = functionToTest(input)
      
      // Assert
      expect(result).toBe('expected')
    })
  })
})
```

### Best Practices

1. **Arrange-Act-Assert Pattern**
   - Arrange: Set up test data
   - Act: Execute function
   - Assert: Verify results

2. **Descriptive Test Names**
   - Use clear, descriptive test names
   - Example: `it('calculates distance between two GPS coordinates')`

3. **Test Edge Cases**
   - Null/undefined inputs
   - Empty arrays/objects
   - Boundary values

4. **Mock External Dependencies**
   - localStorage
   - Next.js router
   - Browser APIs

---

## 🔧 Test Configuration

### Jest Config (`jest.config.js`)

- **Test Environment:** jsdom (browser-like)
- **Module Mapping:** `@/` → root directory
- **Coverage:** All `.js` files in `app/`, `components/`, `lib/`

### Setup File (`jest.setup.js`)

- Mocks Next.js router
- Mocks localStorage
- Mocks window.matchMedia
- Configures testing-library

---

## 🐛 Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="specific test name"
```

### Verbose Output

```bash
npm test -- --verbose
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open Chrome DevTools at `chrome://inspect`

---

## 📈 CI/CD Integration

### GitHub Actions

Automated tests run on:
- Push to `main` or `develop`
- Pull requests

**Workflow:** `.github/workflows/test.yml`

### Pre-commit Hooks (Optional)

Add to `.husky/pre-commit`:

```bash
npm run test:ci
```

---

## ✅ Test Checklist

Before committing:

- [ ] All tests pass (`npm test`)
- [ ] Coverage is above 70%
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Integration tests pass

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## 🎯 Next Steps

1. **Add E2E Tests** - Use Playwright or Cypress
2. **Visual Regression** - Use Percy or Chromatic
3. **Performance Tests** - Lighthouse CI
4. **Accessibility Tests** - jest-axe

---

**Status:** ✅ **Test Suite Active**

Run `npm test` to verify all tests pass!


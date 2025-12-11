# npm Deprecation Warnings

## Current Warnings

When running `npm install`, you may see these deprecation warnings:

```
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. 
Do not use it. Check out lru-cache if you want a good and tested way to coalesce 
async requests by a key value, which is much more comprehensive and powerful.

npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
```

## Cause

These warnings come from **transitive dependencies** (dependencies of dependencies):

1. **Jest** → `@jest/transform` → `babel-plugin-istanbul@7.0.1`
2. `babel-plugin-istanbul@7.0.1` → `test-exclude@6.0.0`
3. `test-exclude@6.0.0` → `glob@7.2.3` → `inflight@1.0.6` ❌

## Impact

✅ **These warnings are harmless** and do not affect functionality:
- They come from Jest's code coverage tooling
- All packages are using the latest available versions
- The deprecated modules are only used internally by test-exclude
- Your application will work normally

## Current Package Versions

- **Jest**: `30.2.0` (latest)
- **babel-plugin-istanbul**: `7.0.1` (latest)
- **test-exclude**: `6.0.0` (used by babel-plugin-istanbul)

## Resolution

These warnings will be resolved when:
1. `test-exclude` updates to use `glob@9+` instead of `glob@7.2.3`
2. `babel-plugin-istanbul` updates its dependency on `test-exclude`
3. Or Jest updates to use newer versions

**No action required** - these are upstream dependency issues that will be fixed by package maintainers.

## If You Want to Suppress Warnings

You can suppress these specific warnings by adding to your `.npmrc` file:

```ini
# Suppress deprecation warnings (not recommended)
audit=false
```

However, it's better to leave them visible so you know when they're fixed.

---

**Last Updated:** December 12, 2024  
**Status:** Known issue, harmless warnings


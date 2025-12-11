# 🔐 Environment Variables Setup

## Security Notice

Test user credentials are now stored in environment variables instead of being hardcoded in source files. This prevents credentials from being committed to version control.

---

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and fill in your test credentials:**
   ```env
   NEXT_PUBLIC_TEST_ADMIN_EMAIL=admin@vibematch.com
   NEXT_PUBLIC_TEST_ADMIN_PASSWORD=YourAdminPasswordHere
   
   NEXT_PUBLIC_TEST_FREE_EMAIL=free@test.com
   NEXT_PUBLIC_TEST_FREE_PASSWORD=YourFreePasswordHere
   
   # ... etc
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## File Structure

- **`.env.example`** - Template file (safe to commit, contains placeholders)
- **`.env.local`** - Your actual credentials (gitignored, never commit this!)

---

## Environment Variables

All test credentials use the `NEXT_PUBLIC_` prefix so they're accessible in client-side code:

- `NEXT_PUBLIC_TEST_ADMIN_EMAIL` - Admin user email
- `NEXT_PUBLIC_TEST_ADMIN_PASSWORD` - Admin user password
- `NEXT_PUBLIC_TEST_FREE_EMAIL` - Free user email
- `NEXT_PUBLIC_TEST_FREE_PASSWORD` - Free user password
- `NEXT_PUBLIC_TEST_BASIC_EMAIL` - Basic user email
- `NEXT_PUBLIC_TEST_BASIC_PASSWORD` - Basic user password
- `NEXT_PUBLIC_TEST_PLUS_EMAIL` - Plus user email
- `NEXT_PUBLIC_TEST_PLUS_PASSWORD` - Plus user password
- `NEXT_PUBLIC_TEST_PREMIUM_EMAIL` - Premium user email
- `NEXT_PUBLIC_TEST_PREMIUM_PASSWORD` - Premium user password
- `NEXT_PUBLIC_TEST_REGULAR_EMAIL` - Regular user email
- `NEXT_PUBLIC_TEST_REGULAR_PASSWORD` - Regular user password

---

## Security Notes

⚠️ **Important:**
- `.env.local` is gitignored and will NOT be committed
- Never commit `.env.local` to version control
- Use `.env.example` as a template for other developers
- Rotate credentials if they're ever exposed

---

## Troubleshooting

If test users aren't being created:

1. **Check that `.env.local` exists:**
   ```bash
   ls -la .env.local
   ```

2. **Verify environment variables are set:**
   ```bash
   # In your code, you can check:
   console.log(process.env.NEXT_PUBLIC_TEST_ADMIN_EMAIL);
   ```

3. **Restart the dev server** after creating/updating `.env.local`

4. **Check for typos** in variable names (must match exactly)

---

## Migration from Hardcoded Credentials

If you're migrating from hardcoded credentials:

1. Create `.env.local` with your current credentials
2. The code will automatically use environment variables
3. Old hardcoded values in source files are now removed
4. Credentials are no longer visible in source code

---

**Last Updated:** December 11, 2024


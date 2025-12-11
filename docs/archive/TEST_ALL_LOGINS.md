# 🔐 Complete Login Testing Guide

## Test Accounts Created

### 1. Admin User
- **Email:** admin@vibematch.com
- **Password:** admin123
- **Role:** admin
- **Tier:** VIP
- **Redirects to:** /admin

### 2. Free User
- **Email:** free@test.com
- **Password:** free123
- **Tier:** free
- **Redirects to:** /discover

### 3. Basic Tier User
- **Email:** basic@test.com
- **Password:** basic123
- **Tier:** basic
- **Redirects to:** /discover

### 4. Plus Tier User
- **Email:** plus@test.com
- **Password:** plus123
- **Tier:** plus
- **Redirects to:** /discover

### 5. Premium (VIP) User
- **Email:** premium@test.com
- **Password:** premium123
- **Tier:** vip
- **Redirects to:** /discover

### 6. Regular User
- **Email:** ranjith@example.com
- **Name:** ranjith
- **Password:** 1234567890
- **Tier:** free
- **Redirects to:** /discover

## Testing Steps

1. Start server: `npm run dev`
2. Navigate to: http://localhost:3000/login
3. Test each account above
4. Verify redirects work correctly
5. Check subscription features are properly gated


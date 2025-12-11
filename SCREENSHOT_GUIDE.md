# Screenshot Testing Guide - Premium Features

## 🎯 Objective
Capture screenshots showing the differences between Free and Premium accounts to validate the premium features implementation.

## 📋 Pre-Testing Setup

### Ensure Test Users Exist
Test users are auto-created when you visit `/login` page. If they don't exist:
1. Navigate to `http://localhost:3000/login`
2. The page will automatically create test users
3. You can verify in browser console: `JSON.parse(localStorage.getItem('allUsers')).filter(u => u.email.includes('test.com'))`

## 🧪 Testing Method

### Quick Login (Browser Console)
1. Open `http://localhost:3000` in browser
2. Press F12 to open Developer Console
3. Copy and paste this code:

```javascript
// Login as Free User
function loginFree() {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const freeUser = allUsers.find(u => u.email === 'free@test.com');
  if (freeUser) {
    const { password, ...userWithoutPassword } = freeUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ Logged in as Free User');
    window.location.href = '/discover';
  }
}

// Login as Premium User
function loginPremium() {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const premiumUser = allUsers.find(u => u.email === 'premium@test.com');
  if (premiumUser) {
    const { password, ...userWithoutPassword } = premiumUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ Logged in as Premium User');
    window.location.href = '/discover';
  }
}

// Now run:
loginFree();    // or loginPremium();
```

## 📸 Screenshot Checklist

### FREE ACCOUNT SCREENSHOTS

#### 1. Free Account - Discover Page
**Steps:**
1. Login as free user (`free@test.com` / `free123`)
2. Navigate to `/discover`
3. **Capture:** Full page screenshot

**What to Verify:**
- ✅ Yellow banner: "10 likes remaining today" (or similar)
- ✅ "⭐ Upgrade to Premium" button in header (gradient purple-pink)
- ✅ Navigation bar shows "⭐ Premium" button (gradient)
- ✅ Profile cards visible

**Filename:** `01-free-discover-page.png`

#### 2. Free Account - Like Limit Warning
**Steps:**
1. On discover page as free user
2. Like 10 profiles (click heart icon 10 times)
3. Try to like 11th profile
4. **Capture:** Screenshot showing error toast

**What to Verify:**
- ✅ Error toast appears: "Daily like limit reached! Upgrade to Premium for unlimited likes."
- ✅ Like button disabled or shows warning

**Filename:** `02-free-like-limit-warning.png`

#### 3. Free Account - Subscription Page
**Steps:**
1. As free user, navigate to `/subscription`
2. **Capture:** Full page screenshot

**What to Verify:**
- ✅ Side-by-side plan comparison
- ✅ Free plan on left showing limitations (❌)
- ✅ Premium plan on right showing all features (✅)
- ✅ "Upgrade to Premium" button (gradient)
- ✅ Feature list with icons

**Filename:** `03-free-subscription-page.png`

#### 4. Free Account - Messages (Read Receipts)
**Steps:**
1. As free user, navigate to `/messages`
2. Send a message (if no conversations, go to matches first)
3. **Capture:** Screenshot of message with single checkmark

**What to Verify:**
- ✅ Single checkmark (✓) on sent messages
- ✅ No double checkmarks visible

**Filename:** `04-free-messages-read-receipts.png`

#### 5. Free Account - Filters Panel
**Steps:**
1. As free user, go to `/discover`
2. Open filters panel (click "Show" if collapsed)
3. **Capture:** Screenshot of filters with premium prompt

**What to Verify:**
- ✅ Premium upgrade prompt/banner visible
- ✅ Basic filters available
- ✅ Advanced filters locked or showing upgrade prompt

**Filename:** `05-free-filters-panel.png`

#### 6. Free Account - Navigation Bar
**Steps:**
1. As free user, any page with navigation
2. **Capture:** Screenshot of navigation bar

**What to Verify:**
- ✅ "⭐ Premium" button visible (gradient purple-pink)
- ✅ Links to `/subscription`

**Filename:** `06-free-navigation-bar.png`

### PREMIUM ACCOUNT SCREENSHOTS

#### 7. Premium Account - Discover Page
**Steps:**
1. Logout and login as premium user (`premium@test.com` / `premium123`)
2. Navigate to `/discover`
3. **Capture:** Full page screenshot

**What to Verify:**
- ✅ Purple gradient badge: "⭐ Premium Member"
- ✅ Text: "Unlimited likes, advanced filters, and more!"
- ✅ NO yellow like limit banner
- ✅ Navigation shows "⭐ Premium" badge (purple background, not gradient)

**Filename:** `07-premium-discover-page.png`

#### 8. Premium Account - Unlimited Likes
**Steps:**
1. On discover page as premium user
2. Like 20+ profiles
3. **Capture:** Screenshot showing no restrictions

**What to Verify:**
- ✅ No limit warnings
- ✅ Can like unlimited profiles
- ✅ No restrictions visible

**Filename:** `08-premium-unlimited-likes.png`

#### 9. Premium Account - Subscription Page
**Steps:**
1. As premium user, navigate to `/subscription`
2. **Capture:** Full page screenshot

**What to Verify:**
- ✅ "⭐ You're a Premium Member!" heading
- ✅ "Premium Active" status card
- ✅ Purple gradient background
- ✅ All premium features listed

**Filename:** `09-premium-subscription-page.png`

#### 10. Premium Account - Messages (Read Receipts)
**Steps:**
1. As premium user, navigate to `/messages`
2. Send messages
3. **Capture:** Screenshot showing double checkmarks

**What to Verify:**
- ✅ Double checkmarks (✓✓) on sent messages
- ✅ Blue color for read receipts

**Filename:** `10-premium-messages-read-receipts.png`

#### 11. Premium Account - Advanced Filters
**Steps:**
1. As premium user, go to `/discover`
2. Open filters panel
3. **Capture:** Screenshot of all filters available

**What to Verify:**
- ✅ All filters available
- ✅ No upgrade prompts
- ✅ Advanced filters accessible

**Filename:** `11-premium-filters-panel.png`

#### 12. Premium Account - Navigation Bar
**Steps:**
1. As premium user, any page
2. **Capture:** Screenshot of navigation bar

**What to Verify:**
- ✅ "⭐ Premium" badge (purple background)
- ✅ Shows premium status

**Filename:** `12-premium-navigation-bar.png`

### UPGRADE FLOW SCREENSHOTS

#### 13. Upgrade Flow - Before
**Steps:**
1. Login as free user
2. Navigate to `/subscription`
3. **Capture:** Screenshot before upgrade

**Filename:** `13-upgrade-before.png`

#### 14. Upgrade Flow - After
**Steps:**
1. On subscription page as free user
2. Click "Upgrade to Premium" button
3. Wait for redirect to discover
4. **Capture:** Screenshot after upgrade

**What to Verify:**
- ✅ Success toast appeared (may need to capture before redirect)
- ✅ Premium badge now visible
- ✅ All premium features active

**Filename:** `14-upgrade-after.png`

## 🔍 Key Differences to Capture

### Visual Differences

| Element | Free Account | Premium Account |
|---------|-------------|----------------|
| **Like Limit Banner** | Yellow banner visible | None |
| **Upgrade Button** | Gradient purple-pink | None (has badge) |
| **Navigation Badge** | Gradient button | Purple solid badge |
| **Read Receipts** | Single ✓ | Double ✓✓ |
| **Filters** | Upgrade prompts | All unlocked |
| **Subscription Page** | Upgrade options | "Premium Active" |

## 📝 Screenshot Tips

1. **Full Page Screenshots:** Use browser's full-page screenshot feature
2. **Highlight Key Elements:** Use annotations if needed
3. **Consistent Browser:** Use same browser for all screenshots
4. **Window Size:** Use consistent window size (1920x1080 recommended)
5. **Clear State:** Clear localStorage between tests if needed

## ✅ Validation Checklist

After capturing screenshots, verify:

- [ ] All free account limitations visible
- [ ] All premium account features visible
- [ ] Clear visual differences between tiers
- [ ] Upgrade flow works correctly
- [ ] All UI elements render properly
- [ ] No broken features
- [ ] Consistent styling

## 🎯 Success Criteria

✅ Screenshots clearly show free vs premium differences
✅ All features visible and working
✅ UI elements properly styled
✅ Upgrade flow functional
✅ Ready for documentation/presentation

## 📁 Screenshot Organization

Organize screenshots in folders:
```
screenshots/
  ├── free-account/
  │   ├── 01-discover.png
  │   ├── 02-like-limit.png
  │   ├── 03-subscription.png
  │   ├── 04-messages.png
  │   ├── 05-filters.png
  │   └── 06-navigation.png
  ├── premium-account/
  │   ├── 07-discover.png
  │   ├── 08-unlimited-likes.png
  │   ├── 09-subscription.png
  │   ├── 10-messages.png
  │   ├── 11-filters.png
  │   └── 12-navigation.png
  └── upgrade-flow/
      ├── 13-before.png
      └── 14-after.png
```

## 🚀 Ready to Test!

All implementation is complete. Follow the steps above to capture screenshots and validate the premium features implementation.


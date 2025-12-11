/**
 * PREMIUM FEATURES TEST SCRIPT
 * 
 * Instructions:
 * 1. Open browser console (F12)
 * 2. Navigate to http://localhost:3000
 * 3. Paste this entire script and press Enter
 * 4. Follow the prompts to test Free and Premium accounts
 * 
 * This script will help you test both accounts and see the differences
 */

(function() {
  console.log('%c🧪 PREMIUM FEATURES TEST SCRIPT', 'color: purple; font-size: 16px; font-weight: bold;');
  console.log('%c================================', 'color: purple;');
  
  // Helper functions
  function getAllUsers() {
    try {
      const users = localStorage.getItem('allUsers');
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  }
  
  function setCurrentUser(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
  
  function setupTestUsers() {
    const allUsers = getAllUsers();
    
    // Free user
    let freeUser = allUsers.find(u => u.email === 'free@test.com');
    if (!freeUser) {
      console.log('⚠️ Free test user not found. Please ensure test users are initialized.');
      return false;
    }
    
    // Premium user
    let premiumUser = allUsers.find(u => u.email === 'premium@test.com');
    if (!premiumUser) {
      console.log('⚠️ Premium test user not found. Please ensure test users are initialized.');
      return false;
    }
    
    return { freeUser, premiumUser };
  }
  
  // Test menu
  console.log('\n📋 Available Test Commands:');
  console.log('1. testFreeAccount() - Login as Free User and show features');
  console.log('2. testPremiumAccount() - Login as Premium User and show features');
  console.log('3. showCurrentAccount() - Show current logged-in account details');
  console.log('4. compareFeatures() - Show feature comparison');
  console.log('5. logout() - Logout current user');
  
  // Make functions available globally
  window.testFreeAccount = function() {
    const users = setupTestUsers();
    if (!users) return;
    
    const { password, ...freeUserWithoutPassword } = users.freeUser;
    setCurrentUser(freeUserWithoutPassword);
    
    console.log('%c✅ Logged in as FREE USER', 'color: green; font-weight: bold;');
    console.log('📧 Email:', freeUserWithoutPassword.email);
    console.log('👤 Name:', freeUserWithoutPassword.name);
    console.log('💳 Subscription:', freeUserWithoutPassword.subscriptionTier);
    console.log('\n🔍 Now navigate to:');
    console.log('  - /discover - See like limit banner (10 likes/day)');
    console.log('  - /subscription - See upgrade options');
    console.log('  - /messages - See single checkmark (✓)');
    console.log('\n⏭️ Redirecting to /discover...');
    
    window.location.href = '/discover';
  };
  
  window.testPremiumAccount = function() {
    const users = setupTestUsers();
    if (!users) return;
    
    const { password, ...premiumUserWithoutPassword } = users.premiumUser;
    setCurrentUser(premiumUserWithoutPassword);
    
    console.log('%c✅ Logged in as PREMIUM USER', 'color: purple; font-weight: bold;');
    console.log('📧 Email:', premiumUserWithoutPassword.email);
    console.log('👤 Name:', premiumUserWithoutPassword.name);
    console.log('💳 Subscription:', premiumUserWithoutPassword.subscriptionTier);
    console.log('⭐ Premium Since:', premiumUserWithoutPassword.premiumSince || 'N/A');
    console.log('\n🔍 Now navigate to:');
    console.log('  - /discover - See premium badge, unlimited likes');
    console.log('  - /subscription - See "Premium Active" status');
    console.log('  - /messages - See double checkmarks (✓✓)');
    console.log('\n⏭️ Redirecting to /discover...');
    
    window.location.href = '/discover';
  };
  
  window.showCurrentAccount = function() {
    const user = getCurrentUser();
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('%c👤 CURRENT ACCOUNT', 'color: blue; font-weight: bold;');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('💳 Subscription:', user.subscriptionTier || 'free');
    console.log('⭐ Premium:', user.subscriptionTier === 'premium' ? 'Yes' : 'No');
    
    if (user.subscriptionTier === 'premium') {
      console.log('%c✨ Premium Features Active!', 'color: purple; font-weight: bold;');
    } else {
      console.log('%c🔒 Free Account - Limited Features', 'color: orange; font-weight: bold;');
    }
  };
  
  window.compareFeatures = function() {
    console.log('%c📊 FEATURE COMPARISON', 'color: blue; font-size: 14px; font-weight: bold;');
    console.log('\n┌─────────────────────┬──────────┬──────────┐');
    console.log('│ Feature             │ Free     │ Premium  │');
    console.log('├─────────────────────┼──────────┼──────────┤');
    console.log('│ Daily Likes         │ 10/day   │ Unlimited│');
    console.log('│ See Who Liked You   │ ❌ No    │ ✅ Yes   │');
    console.log('│ Advanced Filters    │ ❌ No    │ ✅ Yes   │');
    console.log('│ Read Receipts       │ ❌ No    │ ✅ Yes   │');
    console.log('│ Rewinds             │ 0        │ Unlimited│');
    console.log('│ Profile Boost       │ ❌ No    │ ✅ Yes   │');
    console.log('│ Priority Matching   │ ❌ No    │ ✅ Yes   │');
    console.log('│ Ad-Free             │ ❌ No    │ ✅ Yes   │');
    console.log('│ Match Breakdown     │ Basic    │ Detailed │');
    console.log('└─────────────────────┴──────────┴──────────┘');
  };
  
  window.logout = function() {
    localStorage.removeItem('currentUser');
    console.log('%c👋 Logged out', 'color: gray;');
    window.location.href = '/login';
  };
  
  // Show current account if logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('\n%cℹ️ Currently logged in:', 'color: blue;');
    window.showCurrentAccount();
  } else {
    console.log('\n%cℹ️ No user logged in. Use testFreeAccount() or testPremiumAccount()', 'color: blue;');
  }
  
  console.log('\n%c✨ Ready to test! Use the commands above.', 'color: green; font-weight: bold;');
})();


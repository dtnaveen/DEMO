/**
 * Complete Test Validation Script
 * Paste this entire script in browser console to test both accounts
 */

(function() {
  console.log('%c🧪 PREMIUM FEATURES VALIDATION TEST', 'color: purple; font-size: 18px; font-weight: bold;');
  console.log('%c=====================================', 'color: purple;');
  
  // Helper functions
  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('allUsers') || '[]');
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
  
  function getDailyLikesRemaining(user) {
    if (user.subscriptionTier === 'premium') return 'unlimited';
    
    try {
      const today = new Date().toDateString();
      const likesData = JSON.parse(localStorage.getItem('dailyLikes') || '{}');
      if (likesData.date !== today) return 10;
      return Math.max(0, 10 - (likesData.count || 0));
    } catch (e) {
      return 10;
    }
  }
  
  // Test Free Account
  window.testFreeAccount = function() {
    console.log('\n%c📋 TESTING FREE ACCOUNT', 'color: orange; font-size: 14px; font-weight: bold;');
    
    const allUsers = getAllUsers();
    const freeUser = allUsers.find(u => u.email === 'free@test.com');
    
    if (!freeUser) {
      console.error('❌ Free user not found!');
      return false;
    }
    
    const { password, ...userWithoutPassword } = freeUser;
    setCurrentUser(userWithoutPassword);
    
    console.log('✅ Logged in as Free User');
    console.log('📧 Email:', userWithoutPassword.email);
    console.log('💳 Subscription:', userWithoutPassword.subscriptionTier || 'free');
    
    const likesRemaining = getDailyLikesRemaining(userWithoutPassword);
    console.log('❤️ Likes Remaining:', likesRemaining);
    
    console.log('\n%c🔍 VALIDATION CHECKLIST:', 'color: blue; font-weight: bold;');
    console.log('  [ ] Discover page shows like limit banner');
    console.log('  [ ] "Upgrade to Premium" button visible');
    console.log('  [ ] Like limit enforced (10/day)');
    console.log('  [ ] Single checkmark (✓) in messages');
    console.log('  [ ] Premium prompts in filters');
    console.log('  [ ] Subscription page shows upgrade options');
    
    console.log('\n⏭️ Redirecting to /discover...');
    window.location.href = '/discover';
    
    return true;
  };
  
  // Test Premium Account
  window.testPremiumAccount = function() {
    console.log('\n%c📋 TESTING PREMIUM ACCOUNT', 'color: purple; font-size: 14px; font-weight: bold;');
    
    const allUsers = getAllUsers();
    const premiumUser = allUsers.find(u => u.email === 'premium@test.com');
    
    if (!premiumUser) {
      console.error('❌ Premium user not found!');
      return false;
    }
    
    const { password, ...userWithoutPassword } = premiumUser;
    setCurrentUser(userWithoutPassword);
    
    console.log('✅ Logged in as Premium User');
    console.log('📧 Email:', userWithoutPassword.email);
    console.log('💳 Subscription:', userWithoutPassword.subscriptionTier);
    console.log('⭐ Premium Since:', userWithoutPassword.premiumSince || 'N/A');
    
    const likesRemaining = getDailyLikesRemaining(userWithoutPassword);
    console.log('❤️ Likes Remaining:', likesRemaining);
    
    console.log('\n%c🔍 VALIDATION CHECKLIST:', 'color: blue; font-weight: bold;');
    console.log('  [ ] Premium badge visible on discover page');
    console.log('  [ ] NO like limit banner');
    console.log('  [ ] Unlimited likes working');
    console.log('  [ ] Double checkmarks (✓✓) in messages');
    console.log('  [ ] All filters available');
    console.log('  [ ] Subscription page shows "Premium Active"');
    
    console.log('\n⏭️ Redirecting to /discover...');
    window.location.href = '/discover';
    
    return true;
  };
  
  // Validate Current Account
  window.validateCurrentAccount = function() {
    const user = getCurrentUser();
    
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }
    
    console.log('\n%c👤 CURRENT ACCOUNT VALIDATION', 'color: green; font-size: 14px; font-weight: bold;');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('💳 Subscription:', user.subscriptionTier || 'free');
    
    const isPremium = user.subscriptionTier === 'premium';
    const likesRemaining = getDailyLikesRemaining(user);
    
    console.log('\n%c📊 FEATURE STATUS:', 'color: blue; font-weight: bold;');
    console.log('  Subscription Tier:', isPremium ? '⭐ Premium' : '🔒 Free');
    console.log('  Daily Likes:', likesRemaining === 'unlimited' ? '✅ Unlimited' : `🔒 ${likesRemaining}/10`);
    console.log('  See Who Liked:', isPremium ? '✅ Available' : '❌ Premium Only');
    console.log('  Advanced Filters:', isPremium ? '✅ Available' : '❌ Premium Only');
    console.log('  Read Receipts:', isPremium ? '✅ Double ✓✓' : '❌ Single ✓');
    console.log('  Rewinds:', isPremium ? '✅ Unlimited' : '❌ 0');
    console.log('  Profile Boost:', isPremium ? '✅ Active' : '❌ Premium Only');
    console.log('  Priority Matching:', isPremium ? '✅ Active' : '❌ Premium Only');
    console.log('  Ad-Free:', isPremium ? '✅ Yes' : '❌ No');
    
    // Check UI elements
    console.log('\n%c🎨 UI ELEMENTS TO VERIFY:', 'color: purple; font-weight: bold;');
    if (isPremium) {
      console.log('  [ ] Purple "Premium Member" badge on discover page');
      console.log('  [ ] Purple "Premium" badge in navigation');
      console.log('  [ ] NO like limit banner');
      console.log('  [ ] Double checkmarks in messages');
    } else {
      console.log('  [ ] Yellow like limit banner on discover page');
      console.log('  [ ] Gradient "Upgrade to Premium" button');
      console.log('  [ ] Single checkmark in messages');
      console.log('  [ ] Premium prompts in filters');
    }
  };
  
  // Run validation on current account
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('\n%cℹ️ Currently logged in:', 'color: blue;');
    window.validateCurrentAccount();
  } else {
    console.log('\n%cℹ️ No user logged in. Use testFreeAccount() or testPremiumAccount()', 'color: blue;');
  }
  
  console.log('\n%c✨ TEST FUNCTIONS READY:', 'color: green; font-weight: bold;');
  console.log('  testFreeAccount() - Login and test free account');
  console.log('  testPremiumAccount() - Login and test premium account');
  console.log('  validateCurrentAccount() - Validate current logged-in account');
  
})();


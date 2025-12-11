/**
 * Browser console script to programmatically login
 * Paste this in browser console to login users for testing
 */

// Login as Free User
function loginFree() {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const freeUser = allUsers.find(u => u.email === 'free@test.com');
  if (freeUser) {
    const { password, ...userWithoutPassword } = freeUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ Logged in as Free User');
    window.location.href = '/discover';
  } else {
    console.log('❌ Free user not found. Please ensure test users are initialized.');
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
  } else {
    console.log('❌ Premium user not found. Please ensure test users are initialized.');
  }
}

// Show current user
function showUser() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user) {
    console.log('Current User:', user.name, '- Subscription:', user.subscriptionTier || 'free');
  } else {
    console.log('No user logged in');
  }
}

console.log('Login functions ready:');
console.log('  loginFree() - Login as free user');
console.log('  loginPremium() - Login as premium user');
console.log('  showUser() - Show current user');


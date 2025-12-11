// Auto-login as Premium User - execute in browser console
(function() {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const premiumUser = allUsers.find(u => u.email === 'premium@test.com');
  if (premiumUser) {
    const { password, ...userWithoutPassword } = premiumUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ Logged in as Premium User:', userWithoutPassword.name);
    return true;
  }
  return false;
})();


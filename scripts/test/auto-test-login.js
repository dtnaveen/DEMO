// Auto-login script - execute in browser console
(function() {
  // Login as Free User
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const freeUser = allUsers.find(u => u.email === 'free@test.com');
  if (freeUser) {
    const { password, ...userWithoutPassword } = freeUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ Logged in as Free User:', userWithoutPassword.name);
    return true;
  }
  return false;
})();


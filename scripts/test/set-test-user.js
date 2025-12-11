/**
 * Set Test User for GPS Testing
 * Run this in browser console to set ranjith as current user
 */

(async function setTestUser() {
  try {
    const { getAllUsers, setCurrentUser } = await import('/lib/localStorage.js');
    const allUsers = getAllUsers();
    const testUser = allUsers.find(u => 
      u.name?.toLowerCase() === 'ranjith' || 
      u.email?.includes('ranjith')
    );
    
    if (testUser) {
      const { password, ...userWithoutPassword } = testUser;
      setCurrentUser(userWithoutPassword);
      console.log('✅ Test user set:', userWithoutPassword.name);
      console.log('📍 Location:', userWithoutPassword.location);
      if (userWithoutPassword.latitude && userWithoutPassword.longitude) {
        console.log('✅ GPS:', userWithoutPassword.latitude, userWithoutPassword.longitude);
      }
      window.location.href = '/discover';
    } else {
      console.log('❌ Test user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();


// Inject this into browser console to set test user
(function() {
  const allUsersStr = localStorage.getItem('allUsers');
  if (!allUsersStr) {
    console.error('No users found');
    return;
  }
  
  const allUsers = JSON.parse(allUsersStr);
  const ranjith = allUsers.find(u => 
    u.name?.toLowerCase() === 'ranjith' || 
    u.email?.toLowerCase().includes('ranjith')
  );
  
  if (ranjith) {
    const { password, ...userWithoutPassword } = ranjith;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    console.log('✅ User set:', userWithoutPassword.name);
    console.log('📍 GPS:', userWithoutPassword.latitude, userWithoutPassword.longitude);
    window.location.href = '/discover';
  } else {
    console.error('Ranjith not found');
  }
})();


/**
 * Browser Console Script for GPS Testing
 * Copy and paste this entire script into browser console
 */

(async function testGPSFiltering() {
  console.log('🧪 Starting GPS Filtering Test...\n');
  
  // Step 1: Import localStorage functions (if available) or use direct localStorage
  function setTestUser() {
    try {
      // Get all users from localStorage
      const allUsersStr = localStorage.getItem('allUsers');
      if (!allUsersStr) {
        console.error('❌ No users found in localStorage');
        return false;
      }
      
      const allUsers = JSON.parse(allUsersStr);
      
      // Find ranjith user
      const ranjith = allUsers.find(u => 
        u.name?.toLowerCase() === 'ranjith' || 
        u.email?.toLowerCase().includes('ranjith')
      );
      
      if (!ranjith) {
        console.error('❌ Ranjith user not found');
        return false;
      }
      
      // Set as current user (without password)
      const { password, ...userWithoutPassword } = ranjith;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      console.log('✅ Test user set:', userWithoutPassword.name);
      console.log('📍 Location:', userWithoutPassword.location);
      if (userWithoutPassword.latitude && userWithoutPassword.longitude) {
        console.log('✅ GPS:', userWithoutPassword.latitude, userWithoutPassword.longitude);
      } else {
        console.warn('⚠️ No GPS coordinates found for user');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error setting test user:', error);
      return false;
    }
  }
  
  // Step 2: Check discover page
  function checkDiscoverPage() {
    console.log('\n🔍 Checking Discover Page...');
    
    // Wait for page to load
    setTimeout(() => {
      // Check for profile cards
      const profileCards = document.querySelectorAll('[data-testid="profile-card"], .profile-card, [class*="ProfileCard"]');
      console.log(`📊 Found ${profileCards.length} profile cards`);
      
      // Check for distance display
      let distanceCount = 0;
      profileCards.forEach((card, index) => {
        const text = card.textContent || '';
        if (text.includes('mi away') || text.includes('miles away')) {
          distanceCount++;
          console.log(`✅ Card ${index + 1}: Distance displayed`);
        }
      });
      
      console.log(`📍 Distance displayed on ${distanceCount} cards`);
      
      // Check for filter panel
      const filterPanel = document.querySelector('[data-testid="filter-panel"], [class*="FilterPanel"], [class*="filter"]');
      if (filterPanel) {
        console.log('✅ Filter panel found');
      } else {
        console.warn('⚠️ Filter panel not found');
      }
      
      // Check for distance filter
      const distanceInput = document.querySelector('input[type="range"][name*="distance"], input[type="number"][name*="distance"]');
      if (distanceInput) {
        console.log('✅ Distance filter found');
        console.log('📍 Current distance value:', distanceInput.value);
      } else {
        console.warn('⚠️ Distance filter input not found');
      }
    }, 2000);
  }
  
  // Step 3: Test distance filter
  function testDistanceFilter() {
    console.log('\n🧪 Testing Distance Filter...');
    
    setTimeout(() => {
      const distanceInput = document.querySelector('input[type="range"][name*="distance"], input[type="number"][name*="distance"]');
      
      if (distanceInput) {
        // Set distance to 10 miles
        distanceInput.value = 10;
        distanceInput.dispatchEvent(new Event('input', { bubbles: true }));
        distanceInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('✅ Distance filter set to 10 miles');
        console.log('⏳ Waiting for filter to apply...');
        
        setTimeout(() => {
          const profileCards = document.querySelectorAll('[data-testid="profile-card"], .profile-card, [class*="ProfileCard"]');
          console.log(`📊 After filter: ${profileCards.length} profiles visible`);
        }, 1000);
      } else {
        console.warn('⚠️ Could not find distance filter');
      }
    }, 3000);
  }
  
  // Execute tests
  if (setTestUser()) {
    console.log('\n🔄 Navigating to discover page...');
    window.location.href = '/discover';
    
    // Wait for navigation
    setTimeout(() => {
      checkDiscoverPage();
      testDistanceFilter();
    }, 3000);
  }
})();


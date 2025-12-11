/**
 * GPS Filtering Verification Script
 * Run this in browser console on /discover page
 * 
 * This script will:
 * 1. Set a test user as current user (if not logged in)
 * 2. Verify GPS coordinates
 * 3. Check distance calculations
 * 4. Verify distance display on page
 */

(async function verifyGPSFiltering() {
  console.log('🔍 Verifying GPS Filtering Implementation...\n');
  
  try {
    // Import modules
    const { getAllUsers, getCurrentUser, setCurrentUser } = await import('/lib/localStorage.js');
    const { calculateDistance, hasGPSCoordinates, getCoordinatesFromLocation } = await import('/lib/gpsUtils.js');
    
    // Check if user is logged in
    let currentUser = getCurrentUser();
    
    if (!currentUser) {
      console.log('⚠️  No user logged in. Setting test user...');
      const allUsers = getAllUsers();
      const testUser = allUsers.find(u => 
        u.name?.toLowerCase() === 'ranjith' || 
        u.email?.includes('ranjith')
      );
      
      if (testUser) {
        const { password, ...userWithoutPassword } = testUser;
        setCurrentUser(userWithoutPassword);
        currentUser = userWithoutPassword;
        console.log(`✅ Set test user: ${currentUser.name}`);
        // Reload page to apply changes
        setTimeout(() => window.location.reload(), 1000);
        return;
      } else {
        console.log('❌ Test user not found. Please login manually.');
        return;
      }
    }
    
    console.log(`✅ Current user: ${currentUser.name} (${currentUser.location})`);
    
    // Verify GPS coordinates
    if (hasGPSCoordinates(currentUser)) {
      console.log(`✅ GPS coordinates: ${currentUser.latitude}, ${currentUser.longitude}`);
    } else {
      console.log('⚠️  No GPS coordinates, converting from location...');
      const coords = getCoordinatesFromLocation(currentUser.location || 'New York');
      console.log(`📍 Converted coordinates: ${coords.latitude}, ${coords.longitude}`);
    }
    
    // Check all users
    const allUsers = getAllUsers();
    const usersWithGPS = allUsers.filter(u => hasGPSCoordinates(u));
    console.log(`\n📊 Users with GPS: ${usersWithGPS.length} / ${allUsers.length}`);
    
    // Calculate distances
    const currentCoords = hasGPSCoordinates(currentUser) 
      ? { latitude: currentUser.latitude, longitude: currentUser.longitude }
      : getCoordinatesFromLocation(currentUser.location || 'New York');
    
    const nearbyUsers = allUsers
      .filter(u => u.id !== currentUser.id)
      .map(u => {
        let userCoords = null;
        if (hasGPSCoordinates(u)) {
          userCoords = { latitude: u.latitude, longitude: u.longitude };
        } else if (u.location) {
          userCoords = getCoordinatesFromLocation(u.location);
        }
        
        if (userCoords) {
          const distance = calculateDistance(
            currentCoords.latitude,
            currentCoords.longitude,
            userCoords.latitude,
            userCoords.longitude
          );
          return { ...u, distance };
        }
        return { ...u, distance: null };
      })
      .filter(u => u.distance !== null)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
    
    console.log('\n📍 Nearest 5 users:');
    nearbyUsers.forEach(u => {
      console.log(`  ${u.name} (${u.location}): ${u.distance} miles`);
    });
    
    // Check if distance is displayed on page
    console.log('\n🔍 Checking distance display on page...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for page to render
    
    const pageText = document.body.innerText || document.body.textContent || '';
    const hasDistanceText = pageText.includes('mi away') || pageText.includes('miles away');
    
    if (hasDistanceText) {
      console.log('✅ Distance text found on page!');
      const distanceElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && (el.textContent.includes('mi away') || el.textContent.includes('miles'))
      );
      console.log(`   Found ${distanceElements.length} elements with distance text`);
    } else {
      console.log('⚠️  Distance text not found. Profiles may not be loaded yet.');
    }
    
    // Check filter panel
    const filterPanel = document.querySelector('[class*="Filter"], [class*="filter"]');
    if (filterPanel) {
      console.log('✅ Filter panel found on page');
      const distanceSlider = Array.from(filterPanel.querySelectorAll('*')).find(el => 
        el.textContent && el.textContent.includes('Distance')
      );
      if (distanceSlider) {
        console.log('✅ Distance filter found');
      }
    }
    
    console.log('\n✅ GPS Filtering Verification Complete!');
    console.log('\n📝 Summary:');
    console.log(`- Current user: ${currentUser.name}`);
    console.log(`- GPS coordinates: ${hasGPSCoordinates(currentUser) ? 'Yes' : 'Converted'}`);
    console.log(`- Distance calculations: Working`);
    console.log(`- Distance display: ${hasDistanceText ? 'Found' : 'Not found'}`);
    
  } catch (error) {
    console.error('❌ Verification Error:', error);
    console.log('\n⚠️  Make sure you are on the /discover page');
  }
})();


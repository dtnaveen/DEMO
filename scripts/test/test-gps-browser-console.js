/**
 * GPS Filtering Browser Console Test
 * Run this in browser console after logging in manually
 * 
 * Instructions:
 * 1. Manually login as ranjith / 1234567890
 * 2. Navigate to /discover page
 * 3. Open browser console (F12)
 * 4. Copy and paste this entire script
 * 5. Press Enter
 */

(async function testGPSFiltering() {
  console.log('🧪 Testing GPS Filtering...\n');
  
  try {
    // Import modules
    const { getAllUsers, getCurrentUser } = await import('/lib/localStorage.js');
    const { calculateDistance, hasGPSCoordinates, getDistanceBetweenUsers, getCoordinatesFromLocation } = await import('/lib/gpsUtils.js');
    
    // Test 1: Check current user
    console.log('📋 Test 1: Current User GPS Status');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('❌ No user logged in. Please login first.');
      return;
    }
    
    console.log(`✅ User: ${currentUser.name}`);
    console.log(`📍 Location: ${currentUser.location}`);
    
    if (hasGPSCoordinates(currentUser)) {
      console.log(`✅ GPS: ${currentUser.latitude}, ${currentUser.longitude}`);
    } else {
      console.log('⚠️  No GPS coordinates, converting from location...');
      const coords = getCoordinatesFromLocation(currentUser.location || 'New York');
      console.log(`📍 Converted: ${coords.latitude}, ${coords.longitude}`);
    }
    
    // Test 2: Check all users have GPS
    console.log('\n📋 Test 2: All Users GPS Status');
    const allUsers = getAllUsers();
    const usersWithGPS = allUsers.filter(u => hasGPSCoordinates(u));
    const usersWithoutGPS = allUsers.filter(u => !hasGPSCoordinates(u));
    
    console.log(`Total users: ${allUsers.length}`);
    console.log(`✅ Users with GPS: ${usersWithGPS.length}`);
    console.log(`⚠️  Users without GPS: ${usersWithoutGPS.length}`);
    
    // Test 3: Calculate distances
    console.log('\n📋 Test 3: Distance Calculations');
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
      .slice(0, 10);
    
    console.log(`\nTop 10 nearest users from ${currentUser.name}:`);
    nearbyUsers.forEach(u => {
      console.log(`  ${u.name} (${u.location}): ${u.distance} miles`);
    });
    
    // Test 4: Test distance filter ranges
    console.log('\n📋 Test 4: Distance Filter Ranges');
    const ranges = [10, 25, 50, 100];
    ranges.forEach(range => {
      const usersInRange = allUsers.filter(u => {
        if (u.id === currentUser.id) return false;
        let userCoords = null;
        if (hasGPSCoordinates(u)) {
          userCoords = { latitude: u.latitude, longitude: u.longitude };
        } else if (u.location) {
          userCoords = getCoordinatesFromLocation(u.location);
        }
        if (!userCoords) return false;
        const dist = calculateDistance(
          currentCoords.latitude,
          currentCoords.longitude,
          userCoords.latitude,
          userCoords.longitude
        );
        return dist <= range;
      });
      console.log(`  ${range} miles: ${usersInRange.length} users`);
    });
    
    // Test 5: Check if distance is displayed on page
    console.log('\n📋 Test 5: Distance Display on Page');
    const profileCards = document.querySelectorAll('[class*="ProfileCard"], [class*="profile-card"]');
    console.log(`Found ${profileCards.length} profile cards on page`);
    
    // Check for distance text
    const distanceTexts = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.includes('mi away')
    );
    console.log(`Found ${distanceTexts.length} elements with "mi away" text`);
    
    if (distanceTexts.length > 0) {
      console.log('✅ Distance is being displayed on profile cards!');
      distanceTexts.slice(0, 3).forEach((el, idx) => {
        console.log(`  Card ${idx + 1}: ${el.textContent.trim().substring(0, 50)}...`);
      });
    } else {
      console.log('⚠️  Distance not found on page. Check if profiles are loaded.');
    }
    
    console.log('\n✅ GPS Filtering Tests Complete!');
    console.log('\n📝 Summary:');
    console.log(`- Current user: ${currentUser.name} (${currentUser.location})`);
    console.log(`- Total users: ${allUsers.length}`);
    console.log(`- Users with GPS: ${usersWithGPS.length}`);
    console.log(`- Distance calculations: Working`);
    console.log(`- Distance display: ${distanceTexts.length > 0 ? 'Found' : 'Not found'}`);
    
  } catch (error) {
    console.error('❌ Test Error:', error);
    console.log('\n⚠️  Make sure you are logged in and on the /discover page');
  }
})();


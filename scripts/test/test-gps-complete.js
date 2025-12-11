/**
 * Complete GPS Filtering Test Script
 * Run this in the browser console after logging in
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 */

(async function testGPSFiltering() {
  console.log('🧪 Starting GPS Filtering Tests...\n');
  
  try {
    // Import utilities
    const { getAllUsers, getCurrentUser } = await import('/lib/localStorage.js');
    const { calculateDistance, getDistanceBetweenUsers, hasGPSCoordinates, getCoordinatesFromLocation } = await import('/lib/gpsUtils.js');
    
    // Test 1: Check current user GPS
    console.log('📋 Test 1: Current User GPS Coordinates');
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log(`User: ${currentUser.name}`);
      console.log(`Location: ${currentUser.location}`);
      if (hasGPSCoordinates(currentUser)) {
        console.log(`✅ GPS: ${currentUser.latitude}, ${currentUser.longitude}`);
      } else {
        console.log('⚠️  No GPS coordinates, attempting conversion...');
        const coords = getCoordinatesFromLocation(currentUser.location);
        console.log(`📍 Converted: ${coords.latitude}, ${coords.longitude}`);
      }
    } else {
      console.log('❌ No user logged in');
      return;
    }
    
    // Test 2: Check all users have GPS
    console.log('\n📋 Test 2: All Users GPS Status');
    const allUsers = getAllUsers();
    const usersWithGPS = allUsers.filter(u => hasGPSCoordinates(u));
    const usersWithoutGPS = allUsers.filter(u => !hasGPSCoordinates(u));
    
    console.log(`Total users: ${allUsers.length}`);
    console.log(`✅ Users with GPS: ${usersWithGPS.length}`);
    console.log(`⚠️  Users without GPS: ${usersWithoutGPS.length}`);
    
    if (usersWithoutGPS.length > 0) {
      console.log('\nUsers missing GPS:');
      usersWithoutGPS.forEach(u => {
        const coords = getCoordinatesFromLocation(u.location || 'New York');
        console.log(`  - ${u.name} (${u.location}) → ${coords.latitude}, ${coords.longitude}`);
      });
    }
    
    // Test 3: Calculate distances
    console.log('\n📋 Test 3: Distance Calculations');
    if (currentUser && hasGPSCoordinates(currentUser)) {
      const nearbyUsers = allUsers
        .filter(u => u.id !== currentUser.id && hasGPSCoordinates(u))
        .map(u => {
          const distance = getDistanceBetweenUsers(currentUser, u);
          return { ...u, distance };
        })
        .filter(u => u.distance !== null)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
      
      console.log(`\nTop 10 nearest users from ${currentUser.name}:`);
      nearbyUsers.forEach(u => {
        console.log(`  ${u.name} (${u.location}): ${u.distance} miles`);
      });
    } else {
      console.log('⚠️  Current user needs GPS coordinates for distance calculation');
    }
    
    // Test 4: Test distance filter ranges
    console.log('\n📋 Test 4: Distance Filter Ranges');
    if (currentUser && hasGPSCoordinates(currentUser)) {
      const ranges = [10, 25, 50, 100];
      ranges.forEach(range => {
        const usersInRange = allUsers.filter(u => {
          if (u.id === currentUser.id || !hasGPSCoordinates(u)) return false;
          const dist = getDistanceBetweenUsers(currentUser, u);
          return dist !== null && dist <= range;
        });
        console.log(`  ${range} miles: ${usersInRange.length} users`);
      });
    }
    
    // Test 5: Verify test users
    console.log('\n📋 Test 5: Test Users GPS Status');
    const testUsers = allUsers.filter(u => 
      u.email?.includes('test.com') || 
      u.name?.toLowerCase() === 'ranjith' ||
      u.name?.toLowerCase().includes('free') ||
      u.name?.toLowerCase().includes('premium')
    );
    
    testUsers.forEach(u => {
      if (hasGPSCoordinates(u)) {
        console.log(`✅ ${u.name} (${u.location}): ${u.latitude}, ${u.longitude}`);
      } else {
        console.log(`⚠️  ${u.name} (${u.location}): Missing GPS`);
      }
    });
    
    // Summary
    console.log('\n✅ GPS Filtering Tests Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Go to /discover page');
    console.log('2. Check profile cards show distance');
    console.log('3. Adjust distance filter slider');
    console.log('4. Verify profiles filter correctly');
    
  } catch (error) {
    console.error('❌ Test Error:', error);
    console.log('\n⚠️  Make sure you are logged in and on a page that has access to the modules');
  }
})();


/**
 * Test GPS-Based Filtering
 * Run this in the browser console to test GPS filtering functionality
 */

// Test GPS utilities
async function testGPSFiltering() {
  console.log('🧪 Testing GPS-Based Filtering...\n');
  
  // Import GPS utilities (if available in global scope)
  // In browser, these should be available from the app
  
  // Test 1: Check if test users have GPS coordinates
  console.log('📋 Test 1: Checking test users for GPS coordinates');
  const { getAllUsers } = await import('/lib/localStorage.js');
  const allUsers = getAllUsers();
  
  const usersWithGPS = allUsers.filter(u => u.latitude && u.longitude);
  const usersWithoutGPS = allUsers.filter(u => !u.latitude || !u.longitude);
  
  console.log(`✅ Users with GPS: ${usersWithGPS.length}`);
  console.log(`⚠️  Users without GPS: ${usersWithoutGPS.length}`);
  
  if (usersWithoutGPS.length > 0) {
    console.log('Users missing GPS coordinates:');
    usersWithoutGPS.forEach(u => {
      console.log(`  - ${u.name} (${u.location})`);
    });
  }
  
  // Test 2: Calculate distances between test users
  console.log('\n📋 Test 2: Calculating distances between test users');
  const { calculateDistance } = await import('/lib/gpsUtils.js');
  
  const testUsers = allUsers.filter(u => 
    u.email?.includes('test.com') || 
    u.name?.toLowerCase().includes('free') || 
    u.name?.toLowerCase().includes('premium') ||
    u.name?.toLowerCase() === 'ranjith'
  );
  
  if (testUsers.length >= 2) {
    const user1 = testUsers[0];
    const user2 = testUsers[1];
    
    if (user1.latitude && user1.longitude && user2.latitude && user2.longitude) {
      const distance = calculateDistance(
        user1.latitude,
        user1.longitude,
        user2.latitude,
        user2.longitude
      );
      console.log(`Distance between ${user1.name} (${user1.location}) and ${user2.name} (${user2.location}): ${distance} miles`);
    }
  }
  
  // Test 3: Test distance filtering
  console.log('\n📋 Test 3: Testing distance filtering');
  const { getCurrentUser } = await import('/lib/localStorage.js');
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    console.log(`Current user: ${currentUser.name} (${currentUser.location})`);
    
    if (currentUser.latitude && currentUser.longitude) {
      console.log(`GPS coordinates: ${currentUser.latitude}, ${currentUser.longitude}`);
      
      // Filter users within 50 miles
      const nearbyUsers = allUsers
        .filter(u => {
          if (u.id === currentUser.id || !u.latitude || !u.longitude) return false;
          const dist = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            u.latitude,
            u.longitude
          );
          return dist <= 50;
        })
        .map(u => {
          const dist = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            u.latitude,
            u.longitude
          );
          return { name: u.name, location: u.location, distance: dist };
        })
        .sort((a, b) => a.distance - b.distance);
      
      console.log(`\nUsers within 50 miles:`);
      nearbyUsers.forEach(u => {
        console.log(`  - ${u.name} (${u.location}): ${u.distance} miles`);
      });
    } else {
      console.log('⚠️  Current user does not have GPS coordinates');
    }
  } else {
    console.log('⚠️  No user logged in');
  }
  
  // Test 4: Test GPS location button
  console.log('\n📋 Test 4: Testing GPS location capture');
  console.log('To test GPS location button:');
  console.log('1. Go to /onboard page');
  console.log('2. Click "📍 Use My Current Location" button');
  console.log('3. Allow location access when prompted');
  console.log('4. Verify location field is filled');
  
  console.log('\n✅ GPS Filtering Tests Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Navigate to /discover page');
  console.log('2. Adjust distance filter slider');
  console.log('3. Verify profiles are filtered by distance');
  console.log('4. Check profile cards show distance');
}

// Run tests
if (typeof window !== 'undefined') {
  testGPSFiltering().catch(console.error);
} else {
  console.log('This script must be run in the browser console');
}


# 🧪 GPS Filtering Testing Guide

## ✅ Test Users Updated

All test users now include GPS coordinates:
- **Free User**: San Francisco (37.7749, -122.4194)
- **Premium User**: Los Angeles (34.0522, -118.2437)
- **ranjith**: New York (40.7128, -74.0060)
- **Mock Users**: All include GPS coordinates based on their city

---

## 🧪 Testing Steps

### 1. Test GPS Location Button in Onboarding

**Steps:**
1. Navigate to `http://localhost:3000/onboard`
2. Fill in the form (email, password, name, age, gender)
3. **Click "📍 Use My Current Location" button**
4. Allow location access when browser prompts
5. Verify:
   - Location field is automatically filled
   - GPS coordinates are stored
   - Success message appears

**Expected Result:**
- Location field shows your current city or coordinates
- GPS coordinates (latitude/longitude) are saved with profile

---

### 2. Browse Profiles on Discover Page

**Steps:**
1. Login with any test user:
   - `ranjith` / `1234567890`
   - `free@test.com` / `free123`
   - `premium@test.com` / `premium123`
2. Navigate to `/discover` page
3. Verify:
   - Profiles are displayed
   - Distance is shown on each profile card (e.g., "• 12.5 mi away")
   - Profiles have GPS coordinates

**Expected Result:**
- All profile cards show distance from current user
- Distance is calculated using GPS coordinates
- Format: "Age • Location • X.X mi away"

---

### 3. Test Distance Filter

**Steps:**
1. On Discover page, open the Filters panel
2. Find the "Distance" slider
3. Adjust the distance filter:
   - Set to 10 miles
   - Set to 25 miles
   - Set to 50 miles
   - Set to 100 miles
4. Observe:
   - Number of profiles changes
   - Only profiles within distance are shown
   - Distance on cards updates accordingly

**Expected Result:**
- Filtering works in real-time
- Profiles beyond distance are hidden
- Distance calculation is accurate

---

### 4. Verify Distance Display

**Steps:**
1. On Discover page, check profile cards
2. Look for distance indicator
3. Verify:
   - Distance is shown next to location
   - Format: "• X.X mi away"
   - Distance is accurate (can verify manually)

**Expected Result:**
- All profile cards show distance
- Distance is calculated correctly
- Visual integration looks good

---

## 📊 Test Scenarios

### Scenario 1: New User with GPS
1. Create new profile via onboarding
2. Use GPS location button
3. Complete onboarding
4. Go to Discover page
5. Verify distance filtering works

### Scenario 2: Existing User (No GPS)
1. Login with existing user (ranjith)
2. Go to Discover page
3. System should:
   - Convert location name to coordinates
   - Calculate distances
   - Filter profiles correctly

### Scenario 3: Multiple Cities
1. Login as user in New York
2. Set distance filter to 50 miles
3. Should see:
   - Users in nearby cities (within 50 miles)
   - Users in distant cities filtered out
   - Accurate distance calculations

---

## 🔍 Verification Checklist

- [ ] GPS location button works in onboarding
- [ ] Location field auto-fills with GPS
- [ ] GPS coordinates are saved to profile
- [ ] Distance is displayed on profile cards
- [ ] Distance filter works correctly
- [ ] Profiles filter by actual GPS distance
- [ ] Distance calculations are accurate
- [ ] Existing users get GPS coordinates automatically
- [ ] Mock users have GPS coordinates
- [ ] Test users have GPS coordinates

---

## 📝 Test Users

### Free User
- **Email**: `free@test.com`
- **Password**: `free123`
- **Location**: San Francisco
- **GPS**: 37.7749, -122.4194

### Premium User
- **Email**: `premium@test.com`
- **Password**: `premium123`
- **Location**: Los Angeles
- **GPS**: 34.0522, -118.2437

### Ranjith User
- **Email**: `ranjith@example.com` or name: `ranjith`
- **Password**: `1234567890`
- **Location**: New York
- **GPS**: 40.7128, -74.0060

---

## 🎯 Expected Distances

### From New York (ranjith):
- To San Francisco: ~2,900 miles
- To Los Angeles: ~2,800 miles
- To Chicago: ~800 miles
- To Philadelphia: ~100 miles

### From San Francisco (Free User):
- To Los Angeles: ~380 miles
- To New York: ~2,900 miles
- To Seattle: ~810 miles

### From Los Angeles (Premium User):
- To San Francisco: ~380 miles
- To New York: ~2,800 miles
- To San Diego: ~120 miles

---

## 🐛 Troubleshooting

### GPS Button Not Working
- Check browser permissions for location
- Try in incognito mode
- Verify HTTPS (required for geolocation API)

### Distance Not Showing
- Check if user has GPS coordinates
- Verify location name can be converted
- Check browser console for errors

### Filter Not Working
- Verify current user has GPS coordinates
- Check distance filter value
- Verify profiles have GPS coordinates

---

## ✅ Success Criteria

GPS filtering is working correctly if:
1. ✅ GPS location button captures coordinates
2. ✅ Distance is displayed on all profile cards
3. ✅ Distance filter filters profiles correctly
4. ✅ Distance calculations are accurate
5. ✅ Existing users get GPS coordinates automatically

---

**Status:** ✅ Ready for Testing


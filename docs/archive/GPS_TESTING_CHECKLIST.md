# ✅ GPS Filtering Testing Checklist

## 🎯 Quick Test Checklist

Use this checklist to verify GPS filtering is working correctly:

---

### ✅ Test 1: GPS Location Button (Onboarding)

**Location:** `/onboard` page

- [ ] Navigate to onboarding page
- [ ] Fill in basic info (email, password, name, age, gender)
- [ ] See "📍 Use My Current Location" button
- [ ] Click the button
- [ ] Browser prompts for location permission
- [ ] Allow location access
- [ ] Location field auto-fills
- [ ] Success message appears
- [ ] Complete onboarding
- [ ] Verify profile has GPS coordinates

**Expected:** Location detected and saved with GPS coordinates

---

### ✅ Test 2: Distance Display (Discover Page)

**Location:** `/discover` page

- [ ] Login with test user (ranjith, free@test.com, or premium@test.com)
- [ ] Navigate to Discover page
- [ ] See profile cards displayed
- [ ] Each card shows distance (e.g., "• 12.5 mi away")
- [ ] Distance appears next to location
- [ ] Format: "Age • Location • X.X mi away"

**Expected:** All profile cards show accurate distance

---

### ✅ Test 3: Distance Filtering

**Location:** `/discover` page - Filters panel

- [ ] Open Filters panel
- [ ] Find "Distance" slider
- [ ] Current value shows (e.g., "Distance: 25 miles")
- [ ] Set distance to 10 miles
- [ ] Verify fewer profiles shown
- [ ] Set distance to 50 miles
- [ ] Verify more profiles shown
- [ ] Set distance to 100 miles
- [ ] Verify all nearby profiles shown
- [ ] Profiles beyond distance are hidden

**Expected:** Real-time filtering by GPS distance

---

### ✅ Test 4: Test User GPS Coordinates

**Location:** Browser Console

Run in console:
```javascript
const { getAllUsers } = await import('/lib/localStorage.js');
const users = getAllUsers();
const testUsers = users.filter(u => 
  u.email?.includes('test.com') || 
  u.name?.toLowerCase() === 'ranjith'
);
testUsers.forEach(u => {
  console.log(`${u.name}: ${u.location} - GPS: ${u.latitude}, ${u.longitude}`);
});
```

**Expected:** All test users have GPS coordinates

---

### ✅ Test 5: Distance Calculations

**Location:** Browser Console

Run in console:
```javascript
const { calculateDistance } = await import('/lib/gpsUtils.js');
// New York to San Francisco
const dist = calculateDistance(40.7128, -74.0060, 37.7749, -122.4194);
console.log(`NY to SF: ${dist} miles (expected ~2900)`);
```

**Expected:** Accurate distance calculations

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test 1: GPS Location Button
[ ] Pass [ ] Fail
Notes: _________________________________

Test 2: Distance Display
[ ] Pass [ ] Fail
Notes: _________________________________

Test 3: Distance Filtering
[ ] Pass [ ] Fail
Notes: _________________________________

Test 4: Test User GPS
[ ] Pass [ ] Fail
Notes: _________________________________

Test 5: Distance Calculations
[ ] Pass [ ] Fail
Notes: _________________________________

Overall Status: [ ] All Pass [ ] Some Fail
```

---

## 🐛 Common Issues & Solutions

### Issue: GPS Button Not Working
**Solution:**
- Check browser location permissions
- Try in incognito mode
- Verify HTTPS (required for geolocation)

### Issue: Distance Not Showing
**Solution:**
- Check if user has GPS coordinates
- Verify location name can be converted
- Check browser console for errors

### Issue: Filter Not Working
**Solution:**
- Verify current user has GPS coordinates
- Check distance filter value
- Ensure profiles have GPS coordinates

---

## ✅ Success Criteria

All tests pass if:
1. ✅ GPS location button captures coordinates
2. ✅ Distance displayed on all profile cards
3. ✅ Distance filter works correctly
4. ✅ Distance calculations are accurate
5. ✅ Test users have GPS coordinates

---

**Status:** Ready for Testing ✅


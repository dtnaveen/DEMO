# 🧪 GPS Filtering - Step-by-Step Testing Instructions

## 🚀 Quick Start

### Step 1: Start the Development Server

```bash
npm run dev
```

Wait for: `Ready - started server on 0.0.0.0:3000`

---

## 📍 Test 1: GPS Location Button (Onboarding)

### Objective
Test the "Use My Current Location" button during profile creation.

### Steps

1. **Navigate to Onboarding**
   - Open: `http://localhost:3000/onboard`
   - Or click "Get Started" on homepage

2. **Fill Basic Information**
   - Email: `test@example.com`
   - Password: `test123456`
   - Confirm Password: `test123456`
   - Name: `Test User`
   - Age: `25`
   - Gender: Select any

3. **Test GPS Button**
   - Find the "📍 Use My Current Location" button below Location field
   - Click the button
   - Browser will prompt: "Allow location access?"
   - Click "Allow" or "Yes"

4. **Verify Results**
   - ✅ Location field should auto-fill
   - ✅ Should show your city name or coordinates
   - ✅ Success message should appear
   - ✅ GPS coordinates are saved

5. **Complete Onboarding**
   - Continue through remaining steps
   - Complete profile creation
   - You'll be redirected to Discover page

### Expected Result
- Location field filled automatically
- GPS coordinates saved to profile
- No errors in console

---

## 🔍 Test 2: Browse Profiles & See Distance

### Objective
Verify distance is displayed on profile cards.

### Steps

1. **Login with Test User**
   - Go to: `http://localhost:3000/login`
   - Login as: `ranjith` / `1234567890`
   - Or: `free@test.com` / `free123`

2. **Navigate to Discover**
   - Should auto-redirect after login
   - Or go to: `http://localhost:3000/discover`

3. **Check Profile Cards**
   - Look at each profile card
   - Find the location line
   - Format should be: `Age • Location • X.X mi away`

4. **Verify Distance Display**
   - ✅ All cards show distance
   - ✅ Distance format is correct
   - ✅ Distances are reasonable numbers

### Expected Result
- Every profile card shows distance
- Format: "25 • New York • 12.5 mi away"
- Distances are accurate

---

## 🎚️ Test 3: Distance Filter

### Objective
Test GPS-based distance filtering.

### Steps

1. **Open Filters Panel**
   - On Discover page
   - Find "Filters" section
   - Click "Show" to expand

2. **Find Distance Slider**
   - Look for "Distance: X miles"
   - Should have a slider control

3. **Test Filter at 10 Miles**
   - Move slider to 10 miles
   - Observe profile count
   - Note how many profiles shown

4. **Test Filter at 25 Miles**
   - Move slider to 25 miles
   - More profiles should appear
   - Verify count increased

5. **Test Filter at 50 Miles**
   - Move slider to 50 miles
   - Even more profiles
   - Verify filtering works

6. **Test Filter at 100 Miles**
   - Move slider to 100 miles
   - Maximum profiles shown
   - All nearby users visible

### Expected Result
- Filter updates in real-time
- Profile count changes with distance
- Only profiles within distance shown
- Profiles beyond distance hidden

---

## 🧮 Test 4: Run Console Test Script

### Objective
Run automated tests in browser console.

### Steps

1. **Open Browser Console**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to "Console" tab

2. **Run Test Script**
   - Open file: `test-gps-complete.js`
   - Copy entire contents
   - Paste into console
   - Press Enter

3. **Review Results**
   - Check test output
   - Verify all tests pass
   - Note any warnings

### Expected Output
```
🧪 Starting GPS Filtering Tests...

📋 Test 1: Current User GPS Coordinates
User: ranjith
Location: New York
✅ GPS: 40.7128, -74.0060

📋 Test 2: All Users GPS Status
Total users: 15
✅ Users with GPS: 15
⚠️  Users without GPS: 0

📋 Test 3: Distance Calculations
Top 10 nearest users from ranjith:
  User1 (Chicago): 789.2 miles
  User2 (Philadelphia): 95.3 miles
  ...

✅ GPS Filtering Tests Complete!
```

---

## ✅ Verification Checklist

After completing all tests, verify:

- [ ] GPS location button works
- [ ] Location auto-fills correctly
- [ ] GPS coordinates saved
- [ ] Distance shown on all cards
- [ ] Distance format correct
- [ ] Filter works at different ranges
- [ ] Profiles filter correctly
- [ ] No console errors
- [ ] All test users have GPS
- [ ] Calculations are accurate

---

## 🐛 Troubleshooting

### GPS Button Not Working
- **Check:** Browser location permissions
- **Try:** Incognito mode
- **Verify:** HTTPS connection (required for geolocation)

### Distance Not Showing
- **Check:** User has GPS coordinates
- **Verify:** Location name can be converted
- **Look:** Browser console for errors

### Filter Not Working
- **Check:** Current user has GPS
- **Verify:** Filter value is set
- **Ensure:** Profiles have GPS coordinates

### Console Errors
- **Check:** All imports are correct
- **Verify:** Server is running
- **Look:** For specific error messages

---

## 📊 Expected Test Results

### From New York (ranjith):
- San Francisco users: ~2,900 miles
- Los Angeles users: ~2,800 miles
- Chicago users: ~800 miles
- Philadelphia users: ~100 miles

### Filter Results:
- 10 miles: Very few profiles (local area)
- 25 miles: Some nearby profiles
- 50 miles: More regional profiles
- 100 miles: Many profiles in region

---

## 🎯 Success Criteria

All tests pass if:
1. ✅ GPS button captures location
2. ✅ Distance displayed on cards
3. ✅ Filter works correctly
4. ✅ Calculations accurate
5. ✅ No errors in console

---

**Ready to test! Follow the steps above to verify GPS filtering is working correctly.**

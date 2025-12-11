# 📋 Step-by-Step Guide to Run Your App

## 🎯 Goal
Get your VibeMatch app running at `http://localhost:3000` without errors.

---

## Step 1: Check Current Status

### 1.1 Open Your Terminal
- Press `Windows Key + X`
- Select "Windows PowerShell" or "Terminal"
- Navigate to your project:
  ```powershell
  cd "C:\Users\Admin\OneDrive\Desktop\DEMO"
  ```

### 1.2 Check if Server is Running
```powershell
netstat -ano | findstr :3000
```

**What to look for:**
- ✅ If you see `LISTENING` → Server is running (skip to Step 3)
- ❌ If you see nothing or `SYN_SENT` → Server is not running (go to Step 2)

---

## Step 2: Start the Dev Server

### 2.1 Make Sure You're in the Right Directory
```powershell
cd "C:\Users\Admin\OneDrive\Desktop\DEMO"
```

### 2.2 Start the Server
```powershell
npm run dev
```

### 2.3 Wait for "Ready" Message
You should see output like:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

**⏱️ Wait Time:** Usually 5-15 seconds

**✅ Success Indicators:**
- ✅ "Ready" message appears
- ✅ "Local: http://localhost:3000" shown
- ✅ No error messages

**❌ If You See Errors:**
- Copy the error message
- Share it with me and I'll fix it

---

## Step 3: Open the App in Browser

### 3.1 Open Your Browser
- Open **Google Chrome** (or any browser)

### 3.2 Navigate to the App
- Type in address bar: `http://localhost:3000`
- Press `Enter`

### 3.3 Hard Refresh (Important!)
- Press `Ctrl + Shift + R` (Windows)
- Or `Ctrl + F5`
- This clears cache and ensures latest code loads

---

## Step 4: Test the Application

### 4.1 Landing Page Test
**What you should see:**
- ✅ Beautiful landing page with gradient background
- ✅ "Find Your Perfect Vibe" heading
- ✅ "Get Started Free" button
- ✅ No error messages in browser console

**If you see errors:**
- Press `F12` to open Developer Tools
- Click "Console" tab
- Share any red error messages

### 4.2 Test Onboarding Flow
1. Click "Get Started Free" button
2. Complete all 6 onboarding steps:
   - Step 1: Create Your Profile
   - Step 2: Age Group Detection
   - Step 3: Your Values (10 questions)
   - Step 4: Content Preferences (5 questions)
   - Step 5: Preferences & Filters
   - Step 6: Additional Info

### 4.3 Test Main Features
After onboarding, test:
- ✅ Discover page (swipe through profiles)
- ✅ Matches page (see your matches)
- ✅ Messages page (chat with matches)
- ✅ Events page (view events)
- ✅ Profile page (edit your profile)

---

## Step 5: Verify No Errors

### 5.1 Check Browser Console
1. Press `F12` (opens Developer Tools)
2. Click "Console" tab
3. Look for:
   - ✅ No red error messages
   - ✅ No "Hydration failed" errors
   - ✅ No "ERR_FAILED" errors

### 5.2 Check Network Tab
1. In Developer Tools, click "Network" tab
2. Refresh page (`F5`)
3. Look for:
   - ✅ All requests return status 200 (green)
   - ✅ No failed requests (red)

---

## Step 6: Common Issues & Solutions

### Issue 1: "ERR_FAILED" Error
**Cause:** Server not running

**Solution:**
```powershell
# Stop any existing server (Ctrl+C)
# Then restart:
npm run dev
```

### Issue 2: "Hydration failed" Error
**Cause:** Server/client mismatch

**Solution:**
- ✅ Already fixed! Just hard refresh: `Ctrl + Shift + R`

### Issue 3: Port 3000 Already in Use
**Error:** "Port 3000 is already in use"

**Solution:**
```powershell
# Option 1: Kill the process using port 3000
netstat -ano | findstr :3000
# Note the PID (last number)
taskkill /PID <PID_NUMBER> /F

# Option 2: Use a different port
npm run dev -- -p 3001
# Then access: http://localhost:3001
```

### Issue 4: "Module not found" Error
**Cause:** Missing dependencies

**Solution:**
```powershell
npm install
npm run dev
```

### Issue 5: Server Keeps Crashing
**Cause:** Code errors

**Solution:**
- Check terminal for error messages
- Share the error with me
- I'll fix it immediately

---

## Step 7: Success Checklist

✅ Server running (`npm run dev` shows "Ready")
✅ Browser opens `http://localhost:3000`
✅ Landing page loads without errors
✅ No console errors (F12 → Console)
✅ Can complete onboarding
✅ Can navigate between pages
✅ All features working

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check Terminal Output**
   - Copy any error messages
   - Share them with me

2. **Check Browser Console**
   - Press F12
   - Click Console tab
   - Copy red error messages
   - Share them with me

3. **Check Network Tab**
   - Press F12
   - Click Network tab
   - Look for failed requests
   - Share details with me

---

## 📝 Quick Reference Commands

```powershell
# Navigate to project
cd "C:\Users\Admin\OneDrive\Desktop\DEMO"

# Start server
npm run dev

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 3000
taskkill /PID <PID> /F

# Install dependencies
npm install

# Run tests
npm test
```

---

## ✅ You're All Set!

Follow these steps and your app should be running perfectly!

**Remember:**
- Keep the terminal open (server needs to run)
- Use `Ctrl + Shift + R` to hard refresh browser
- Check console (F12) if you see any issues

Good luck! 🚀


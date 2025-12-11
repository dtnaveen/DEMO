# 🚀 How to Start the Server

## Error -102 Fix: Start the Development Server

The error means the server isn't running. Follow these steps:

---

## ✅ Method 1: Manual Start (Recommended)

### Step 1: Open PowerShell/Terminal
Open a new PowerShell or Command Prompt window.

### Step 2: Navigate to Project
```powershell
cd C:\Users\Admin\OneDrive\Desktop\DEMO
```

### Step 3: Start Server
```powershell
npm run dev
```

**If you get execution policy error, run this first:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm run dev
```

### Step 4: Wait for "Ready" Message
You should see:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in X.Xs
```

### Step 5: Open Browser
Once you see "Ready", open:
**http://localhost:3000**

---

## ✅ Method 2: Check if Server is Already Running

### Check Terminal Output
Look at the terminal where you ran `npm run dev`. You should see:
- ✅ "Ready" message = Server is running
- ❌ Error messages = Server failed to start

### Check Browser
Try refreshing: **http://localhost:3000**

---

## 🔍 Troubleshooting

### If Server Won't Start:

1. **Check for Errors in Terminal**
   - Look for red error messages
   - Share the error if you see one

2. **Verify Dependencies**
   ```powershell
   npm install
   ```

3. **Check Port 3000**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000
   ```
   If something is using it, kill it:
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
   ```

4. **Try Different Port**
   ```powershell
   npm run dev -- -p 3001
   ```
   Then access: **http://localhost:3001**

---

## ✅ Quick Checklist

- [ ] Opened PowerShell/Terminal
- [ ] Navigated to project folder
- [ ] Ran `npm run dev`
- [ ] Saw "Ready" message
- [ ] Opened http://localhost:3000 in browser
- [ ] Page loaded successfully

---

## 📝 Expected Behavior

**When Server Starts:**
- Terminal shows "Ready" message
- Browser can access http://localhost:3000
- Landing page displays with modern design

**If It Doesn't Work:**
- Check terminal for error messages
- Verify Node.js is installed: `node --version`
- Make sure you're in the correct directory

---

**Next Steps:** Start the server manually using Method 1 above, then test the application!


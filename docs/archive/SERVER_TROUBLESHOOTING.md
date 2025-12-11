# 🔧 Server Troubleshooting Guide

## Error Code -102 (ERR_CONNECTION_REFUSED)

This error means the server is not running or not accessible on port 3000.

---

## ✅ Quick Fix Steps

### Step 1: Check if Server is Running
```bash
# Check for Node processes
Get-Process -Name node

# Check if port 3000 is in use
Get-NetTCPConnection -LocalPort 3000
```

### Step 2: Start the Server
```bash
cd C:\Users\Admin\OneDrive\Desktop\DEMO
npm run dev
```

**Wait for:** "Ready" message (usually 10-30 seconds)

### Step 3: Verify Server Started
Look for this output in the terminal:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in X.Xs
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Port 3000 Already in Use
**Solution:**
```bash
# Kill processes on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force

# Or use a different port
npm run dev -- -p 3001
```

### Issue 2: Missing Dependencies
**Solution:**
```bash
npm install
```

### Issue 3: Node.js Not Installed
**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart terminal
4. Verify: `node --version`

### Issue 4: Compilation Errors
**Check terminal output for:**
- Syntax errors
- Missing imports
- Type errors

**Fix:** Address any errors shown in terminal

### Issue 5: Firewall Blocking
**Solution:**
- Allow Node.js through Windows Firewall
- Or temporarily disable firewall for testing

---

## 🚀 Manual Server Start

1. **Open PowerShell/Terminal**
2. **Navigate to project:**
   ```bash
   cd C:\Users\Admin\OneDrive\Desktop\DEMO
   ```
3. **Start server:**
   ```bash
   npm run dev
   ```
4. **Wait for "Ready" message**
5. **Open browser:** http://localhost:3000

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] No port conflicts (port 3000 available)
- [ ] No compilation errors in terminal
- [ ] Server shows "Ready" message
- [ ] Browser can access http://localhost:3000

---

## 📝 Expected Terminal Output

When server starts successfully, you should see:
```
> dating-app-mvp@1.0.0 dev
> next dev

▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in 2.5s
```

If you see errors instead, share the error message for help.

---

## 🆘 Still Not Working?

1. **Check terminal output** - Look for error messages
2. **Verify Node.js version** - Should be 18.x or higher
3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. **Try different port:**
   ```bash
   npm run dev -- -p 3001
   ```
   Then access: http://localhost:3001

---

**Status:** Server should be starting now. Check the terminal for output!


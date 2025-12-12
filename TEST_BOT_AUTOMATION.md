# 🤖 Automated Bot Testing Guide

## Quick Test Steps

### Option 1: Manual Testing (Recommended)

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Wait for the server to start (usually on `http://localhost:3000`)

2. **Open Browser**:
   - Navigate to `http://localhost:3000/ai-chat-settings`

3. **Apply Optimal Settings**:
   - Look for the green card with "🚀 Quick Setup: Optimal Settings"
   - Click the **"🚀 Apply & Test (Auto-Save)"** button
   - Wait for the success message and auto-navigation

4. **Run the Test**:
   - You should be automatically navigated to `/test-ai-bot`
   - Click **"Start Test (100 Messages)"** button
   - Wait for the test to complete (takes 2-5 minutes)

5. **Review Results**:
   - Check the **Human-Like Score** (should be 8.5+)
   - Review detailed statistics
   - Check tone distribution
   - Look at sample interactions

### Option 2: Browser Console Automation

If you want to automate via browser console:

1. **Open Browser Console** (F12)
2. **Navigate to** `/ai-chat-settings`
3. **Paste and run** this code:

```javascript
// Auto-apply optimal settings and navigate to test
(async function() {
  console.log('🚀 Starting automated test setup...');
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Find and click "Apply & Test" button
  const buttons = Array.from(document.querySelectorAll('button'));
  const applyButton = buttons.find(btn => 
    btn.textContent.includes('Apply') || 
    btn.textContent.includes('Test') ||
    btn.textContent.includes('🚀')
  );
  
  if (applyButton) {
    console.log('✅ Found apply button, clicking...');
    applyButton.click();
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on test page
    if (window.location.pathname.includes('test-ai-bot')) {
      console.log('✅ Navigated to test page');
      
      // Wait a bit more for page to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find and click "Start Test" button
      const startButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.includes('Start Test') || btn.textContent.includes('100'));
      
      if (startButton) {
        console.log('✅ Found start test button, clicking...');
        startButton.click();
        console.log('✅ Test started! Monitor the progress...');
      } else {
        console.log('⚠️ Start Test button not found. Please click manually.');
      }
    } else {
      console.log('⚠️ Navigation may have failed. Current path:', window.location.pathname);
    }
  } else {
    console.log('⚠️ Apply button not found. Please click manually.');
  }
})();
```

### Option 3: Direct Navigation

1. **Navigate directly to test page**: `http://localhost:3000/test-ai-bot`
2. **Click "Start Test (100 Messages)"**
3. **Note**: Make sure optimal settings are already applied (go to `/ai-chat-settings` first if needed)

## Expected Results

After running the test, you should see:

### Score Metrics:
- **Human-Like Score**: **8.5-9.0/10** ⬆️ (up from 7.33)
- **Avg Response Length**: 45-60 characters
- **Questions Asked**: 65-75 out of 100 messages
- **Avg Response Time**: ~2ms (very fast)

### Tone Distribution:
- **Neutral**: ~40-50 messages
- **Thoughtful**: ~30-40 messages
- **Positive**: **15-25 messages** ⬆️ (up from 1)
- **Enthusiastic**: ~5-10 messages
- **Empathetic**: ~5-10 messages

### Improvements to Look For:
- ✅ More varied sentence starts
- ✅ Better capitalization
- ✅ Bot references user's message words more often
- ✅ More context-appropriate responses
- ✅ Better age-appropriate language

## Troubleshooting

### If the app isn't running:
```bash
npm run dev
```

### If settings don't apply:
1. Go to `/ai-chat-settings` manually
2. Check that all toggles are ON:
   - ✅ Ask Questions
   - ✅ Use Emojis
   - Response Length: Medium
3. Click "Save Settings"
4. Then go to `/test-ai-bot`

### If test doesn't start:
1. Refresh the page
2. Make sure you're logged in
3. Check browser console for errors

### If score is still low:
1. Check bot profile settings are saved
2. Verify "Ask Questions" is enabled
3. Make sure "Response Length" is set to "Medium"
4. Re-run the test

## Success Indicators

You'll know it's working when:
- ✅ Human-Like Score is **8.5 or higher**
- ✅ More **positive** and **enthusiastic** responses
- ✅ Bot **asks more questions** (65%+ of messages)
- ✅ Bot **references your messages** more often
- ✅ Better **sentence variety** (no repetitive starts)
- ✅ Proper **capitalization** throughout

---

**Ready to test?** Start the dev server and follow the steps above! 🚀

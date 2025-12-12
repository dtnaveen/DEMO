/**
 * Quick Test Script - Run in browser console
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Navigate to http://localhost:3000/ai-chat-settings
 * 3. Paste and run this script
 */

(function quickTest() {
  console.log('🚀 Starting Quick Test Automation...');
  
  // Step 1: Apply optimal settings
  function applySettings() {
    return new Promise((resolve) => {
      console.log('📍 Step 1: Looking for Apply & Test button...');
      
      // Wait for page to load
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const applyButton = buttons.find(btn => 
          btn.textContent.includes('Apply') && 
          (btn.textContent.includes('Test') || btn.textContent.includes('🚀'))
        );
        
        if (applyButton) {
          console.log('✅ Found Apply & Test button');
          applyButton.click();
          console.log('✅ Clicked Apply & Test button');
          resolve(true);
        } else {
          console.log('⚠️ Apply button not found. Please click manually.');
          console.log('Available buttons:', buttons.map(b => b.textContent).slice(0, 5));
          resolve(false);
        }
      }, 2000);
    });
  }
  
  // Step 2: Wait for navigation and start test
  function startTest() {
    return new Promise((resolve) => {
      console.log('📍 Step 2: Waiting for navigation to test page...');
      
      // Check if already on test page
      if (window.location.pathname.includes('test-ai-bot')) {
        console.log('✅ Already on test page');
        findAndClickStartButton().then(resolve);
        return;
      }
      
      // Wait for navigation
      let attempts = 0;
      const checkNavigation = setInterval(() => {
        attempts++;
        if (window.location.pathname.includes('test-ai-bot')) {
          clearInterval(checkNavigation);
          console.log('✅ Navigated to test page');
          setTimeout(() => {
            findAndClickStartButton().then(resolve);
          }, 2000);
        } else if (attempts > 10) {
          clearInterval(checkNavigation);
          console.log('⚠️ Navigation timeout. Current path:', window.location.pathname);
          console.log('💡 Please navigate manually to /test-ai-bot');
          resolve(false);
        }
      }, 500);
    });
  }
  
  // Step 3: Find and click Start Test button
  function findAndClickStartButton() {
    return new Promise((resolve) => {
      console.log('📍 Step 3: Looking for Start Test button...');
      
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startButton = buttons.find(btn => 
          btn.textContent.includes('Start Test') || 
          btn.textContent.includes('100 Messages') ||
          (btn.textContent.includes('Start') && btn.textContent.includes('100'))
        );
        
        if (startButton) {
          console.log('✅ Found Start Test button');
          startButton.click();
          console.log('✅ Test started! Monitor the progress bar...');
          console.log('📊 Expected score: 8.5-9.0/10');
          resolve(true);
        } else {
          console.log('⚠️ Start Test button not found');
          console.log('Available buttons:', buttons.map(b => b.textContent).slice(0, 10));
          console.log('💡 Please click "Start Test (100 Messages)" manually');
          resolve(false);
        }
      }, 2000);
    });
  }
  
  // Run the automation
  applySettings()
    .then((applied) => {
      if (applied) {
        return startTest();
      } else {
        console.log('💡 Please apply settings manually, then run: startTest()');
        return Promise.resolve(false);
      }
    })
    .then((started) => {
      if (started) {
        console.log('🎉 Automation complete! Test is running...');
        console.log('⏱️ Test will take 2-5 minutes to complete');
        console.log('📊 Check the progress bar and results when done');
      } else {
        console.log('💡 Some steps need manual intervention');
      }
    });
  
  // Export functions for manual use
  window.quickTest = {
    applySettings,
    startTest,
    findAndClickStartButton
  };
  
  console.log('💡 Functions available: quickTest.applySettings(), quickTest.startTest()');
})();

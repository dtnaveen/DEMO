/**
 * Automated script to apply optimal bot settings and run the test
 * Run this in the browser console after navigating to the app
 */

async function applyOptimalSettingsAndTest() {
  console.log('🚀 Starting automated bot optimization and testing...');
  
  try {
    // Step 1: Navigate to settings page
    console.log('📍 Step 1: Navigating to AI Chat Settings...');
    window.location.href = '/ai-chat-settings';
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Apply optimal settings
    console.log('⚙️ Step 2: Applying optimal settings...');
    
    // Import the update function (if available in global scope)
    if (typeof window !== 'undefined') {
      // Use dynamic import if available
      const { updateAIBotCharacter } = await import('/lib/aiChatBot');
      
      const optimalSettings = {
        askQuestions: true,
        responseLength: 'medium',
        emojiUsage: true,
        personality: 'friendly',
        replyStyle: 'conversational',
        formality: 'casual',
        humorLevel: 'medium'
      };
      
      const success = updateAIBotCharacter(optimalSettings);
      
      if (success) {
        console.log('✅ Optimal settings applied successfully!');
      } else {
        console.error('❌ Failed to apply optimal settings');
        return;
      }
    } else {
      // Fallback: Click the button if it exists
      const applyButton = document.querySelector('button:contains("Apply Optimal Settings")');
      if (applyButton) {
        applyButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Click Save Settings
      const saveButton = document.querySelector('button:contains("Save Settings")');
      if (saveButton) {
        saveButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Step 3: Navigate to test page
    console.log('🧪 Step 3: Navigating to test page...');
    window.location.href = '/test-ai-bot';
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 4: Run the test
    console.log('▶️ Step 4: Starting test...');
    const startTestButton = document.querySelector('button:contains("Start Test")');
    if (startTestButton) {
      startTestButton.click();
      console.log('✅ Test started! This will take a few minutes...');
      console.log('📊 Monitor the progress bar and wait for results.');
    } else {
      console.error('❌ Could not find "Start Test" button');
    }
    
  } catch (error) {
    console.error('❌ Error during automation:', error);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = applyOptimalSettingsAndTest;
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('💡 To run: applyOptimalSettingsAndTest()');
}

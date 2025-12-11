/**
 * Test script to send 50 consecutive high-level sexual/romantic messages to the AI bot
 * and observe its responses
 * 
 * INSTRUCTIONS:
 * 1. Open your browser console (F12)
 * 2. Make sure you're on the app (http://localhost:3000 or your app URL)
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run
 */

(async function testBotSexualChat() {
  console.log('🤖 Testing AI Bot with High Sexual Chat Level\n');
  console.log('='.repeat(80));
  
  // Import functions dynamically
  const { getAllUsers, setAllUsers, getConversations, setConversations } = await import('./lib/localStorage.js');
  const { getConversationId } = await import('./utils/helpers.js');
  const { getBotProfile, updateBotProfile } = await import('./lib/botProfile.js');
  const { generateAIReply } = await import('./lib/aiBotReplies.js');
  
  // Get bot user
  const allUsers = getAllUsers();
  const bot = allUsers.find(u => u.isAIBot && u.name?.toLowerCase().includes('sarah'));
  
  if (!bot) {
    console.error('❌ Bot not found! Make sure Sarah Martinez exists as an AI bot.');
    return;
  }
  
  // Set bot sexual chat level to high
  const botProfile = getBotProfile(bot.id);
  updateBotProfile(bot.id, { ...botProfile, sexualChatLevel: 'high' });
  
  console.log(`✅ Found bot: ${bot.name}`);
  console.log(`✅ Sexual Chat Level: HIGH`);
  console.log('\n');
  
  // Create a test user
  const testUser = {
    id: 'test-user-123',
    name: 'Test User',
    age: 28,
    gender: 'Male',
    location: 'Test City',
    valueAnswers: Array(10).fill(0),
    contentAnswers: Array(5).fill(0),
    preferences: {
      lookingFor: 'Relationship',
      ageRange: [18, 50],
      distance: 25,
      genderPreference: ['Everyone'],
      dealBreakers: []
    }
  };
  
  // Initialize conversation
  const conversationId = getConversationId(testUser.id, bot.id);
  const conversations = getConversations();
  
  if (!conversations[conversationId]) {
    conversations[conversationId] = {
      participants: [testUser.id, bot.id],
      messages: []
    };
  }
  
  const conversation = conversations[conversationId];
  
  // Test messages with high sexual/romantic content
  const testMessages = [
    "lets fuck",
    "I want you",
    "you're so hot",
    "I want to kiss you",
    "let's hook up tonight",
    "you're sexy",
    "I'm turned on by you",
    "wanna come over?",
    "I want to touch you",
    "you make me hard",
    "let's get intimate",
    "I'm so attracted to you",
    "you're beautiful",
    "I want you in bed",
    "let's have some fun",
    "I'm horny for you",
    "you turn me on",
    "let's do it",
    "I want to be with you tonight",
    "you're irresistible",
    "I can't stop thinking about you",
    "let's make love",
    "I desire you",
    "you're so desirable",
    "I want to feel you",
    "let's be together",
    "I'm craving you",
    "you're so hot",
    "I want you right now",
    "let's get closer",
    "I'm so into you",
    "you're amazing",
    "I want to be intimate with you",
    "let's spend the night together",
    "I'm so attracted to you",
    "you drive me crazy",
    "I want to be with you",
    "let's have a good time",
    "I'm so hot for you",
    "you're so seductive",
    "I want to explore you",
    "let's get physical",
    "I'm so turned on",
    "you're irresistible to me",
    "I want to be yours",
    "let's make it happen",
    "I'm so into you right now",
    "you're so tempting",
    "I want to be closer to you",
    "let's do this"
  ];
  
  console.log(`📝 Sending ${testMessages.length} messages to bot...\n`);
  console.log('='.repeat(80));
  console.log('\n');
  
  // Send messages and get responses
  for (let i = 0; i < testMessages.length; i++) {
    const userMessage = testMessages[i];
    
    // Add user message
    conversation.messages.push({
      senderId: testUser.id,
      text: userMessage,
      timestamp: new Date().toISOString()
    });
    
    // Get bot reply
    try {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      const botReply = generateAIReply(bot, testUser, conversation.messages, lastMessage);
      
      // Add bot reply
      conversation.messages.push({
        senderId: bot.id,
        text: botReply,
        timestamp: new Date().toISOString(),
        isAI: true
      });
      
      // Update conversations
      conversations[conversationId] = conversation;
      setConversations(conversations);
      
      console.log(`📤 Message ${i + 1}/${testMessages.length}: "${userMessage}"`);
      console.log(`🤖 Bot Reply: "${botReply}"`);
      console.log('─'.repeat(80));
      
      // Small delay to simulate real conversation
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`❌ Error processing message ${i + 1}:`, error.message);
    }
  }
  
  console.log('\n');
  console.log('='.repeat(80));
  console.log(`✅ Test complete! Sent ${testMessages.length} messages.`);
  console.log(`📊 Total messages in conversation: ${conversation.messages.length}`);
  console.log(`📈 Bot replies generated: ${conversation.messages.filter(m => m.senderId === bot.id).length}`);
  console.log('\n');
  console.log('💡 Tip: Check the messages page to see the full conversation with Sarah Martinez');
})();

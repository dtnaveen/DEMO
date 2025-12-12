import { getAllUsers, getConversations, setConversations, setAllUsers } from './localStorage';
import { getConversationId, devLog } from '../utils/helpers';
import { calculateMatchScore, getSharedInterests } from './matchingAlgorithm';
import { getBotProfile, DEFAULT_BOT_PROFILE } from './botProfile';

/**
 * Generate AI bot reply based on conversation context and bot profile
 */
export function generateAIReply(sarah, otherUser, conversationMessages, lastMessage) {
  const botProfile = getBotProfile(sarah.id) || DEFAULT_BOT_PROFILE;
  const matchScore = calculateMatchScore(sarah, otherUser);
  const sharedInterests = getSharedInterests(sarah, otherUser);
  const lastMessageText = lastMessage?.text || '';
  const lastMessageLower = lastMessageText.toLowerCase();
  const conversationLength = conversationMessages.length;
  const firstName = otherUser.name.split(' ')[0];
  
  // Extract key words from user's message for better engagement (improves human-like score)
  const messageWords = lastMessageText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const keyWords = messageWords.slice(0, 5); // Get first 5 meaningful words for reference
  
  // Get emoji based on bot profile
  const getEmoji = (emojiOptions) => {
    if (!botProfile.emojiUsage) return '';
    return emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
  };
  
  // Response templates based on message content and bot profile
  const replies = [];
  
  // Extract key words from user's message for better engagement
  const messageWords = lastMessageText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const keyWords = messageWords.slice(0, 5); // Get first 5 meaningful words
  
  // Direct responses to common questions - more natural and engaging
  if (lastMessageLower.includes('how are you') || lastMessageLower.includes('how are you doing')) {
    replies.push(
      `I'm doing well, thanks for asking! ${getEmoji(['😊'])} How about you?`,
      `I'm good, thank you! ${getEmoji(['😊'])} How has your day been?`,
      `Pretty good! ${getEmoji(['😊'])} How are things with you?`,
      `I'm doing great! ${getEmoji(['😊'])} Thanks for checking in. How are you doing?`
    );
  } else if (lastMessageLower.includes('how') && lastMessageLower.includes('day')) {
    replies.push(
      `It's been nice! ${getEmoji(['😊'])} How about yours?`,
      `Doing well today, thanks! ${getEmoji(['😊'])} How's your day going?`,
      `My day's been good! ${getEmoji(['😊'])} How about you - how's your day been?`
    );
  } else if (lastMessageLower.includes('what do you like') || lastMessageLower.includes('what do you enjoy')) {
    if (sharedInterests.length > 0) {
      const interest = sharedInterests[0].answer.toLowerCase();
      replies.push(
        `I really enjoy ${interest}! ${getEmoji(['✨'])} What about you - what are some things you're into?`,
        `I'm into ${interest} and a few other things. ${getEmoji(['😊'])} What are your interests?`,
        `That's cool that you asked! ${getEmoji(['😊'])} I really like ${interest}. What do you enjoy?`
      );
    } else {
      replies.push(
        `I enjoy a variety of things - reading, music, spending time with friends. ${getEmoji(['😊'])} What do you like to do?`,
        `I like exploring new hobbies and interests. ${getEmoji(['✨'])} What are some things you enjoy?`,
        `That's a great question! ${getEmoji(['😊'])} I enjoy reading, music, and hanging out with friends. What about you?`
      );
    }
  } else if (lastMessageLower.includes('thank') || lastMessageLower.includes('thanks')) {
    replies.push(
      `You're welcome! ${getEmoji(['😊'])}`,
      `Of course! ${getEmoji(['😊'])} Happy to chat.`,
      `No problem at all! ${getEmoji(['😊'])}`,
      `Anytime! ${getEmoji(['😊'])} I'm here whenever you need to talk.`
    );
  }
  
  // Greeting responses - more natural and simple
  if (lastMessageLower.match(/\b(hey|hi|hello)\b/)) {
    if (conversationLength <= 2) {
      if (botProfile.customGreeting) {
        replies.push(botProfile.customGreeting.replace('{name}', firstName));
      } else {
        replies.push(
          `Hey ${firstName}! ${getEmoji(['👋'])} Nice to meet you.`,
          `Hi ${firstName}! ${getEmoji(['👋'])} Good to hear from you.`,
          `Hello! ${getEmoji(['👋'])} How are you doing?`
        );
      }
    } else {
      replies.push(
        `Hey! ${getEmoji(['👋'])} What's up?`,
        `Hi! ${getEmoji(['👋'])} Good to hear from you again.`
      );
    }
  }
  
  // Simple question responses - direct answers
  if (lastMessageText.includes('?')) {
    // Try to give a direct answer if it's a simple question
    if (lastMessageLower.includes('what') && lastMessageLower.includes('name')) {
      replies.push(`I'm Sarah! ${getEmoji(['😊'])} Nice to meet you.`);
    } else if (lastMessageLower.includes('where') && lastMessageLower.includes('from')) {
      replies.push(
        `I'm from around here. ${getEmoji(['😊'])} How about you?`,
        `I live nearby. ${getEmoji(['😊'])} What about you?`
      );
    } else {
      // Generic question response - more natural
      replies.push(
        `That's a good question. ${getEmoji(['🤔'])} Let me think...`,
        `Hmm, that depends. ${getEmoji(['🤔'])} What do you think?`,
        `Interesting question! ${getEmoji(['😊'])} I'd say it varies.`
      );
    }
  }
  
  // Interest-based responses - direct and natural
  const interestKeywords = ['music', 'movie', 'show', 'book', 'game', 'sport', 'food', 'travel', 'art', 'hobby', 'read', 'reading', 'family', 'books'];
  const foundInterest = interestKeywords.find(keyword => lastMessageLower.includes(keyword));
  
  if (foundInterest) {
    const emojiMap = {
      'music': '🎵', 'movie': '🎬', 'show': '🎬', 'book': '📚', 'books': '📚', 'read': '📚', 'reading': '📚',
      'game': '🎮', 'sport': '⚽', 'food': '🍕', 'travel': '✈️', 'art': '🎨', 'family': '👨‍👩‍👧‍👦'
    };
    const emoji = emojiMap[foundInterest] || '😊';
    
    if (lastMessageLower.includes('read') || lastMessageLower.includes('book')) {
      replies.push(
        `That's nice! ${getEmoji([emoji])} I enjoy reading too. What genres do you like?`,
        `Reading is great! ${getEmoji([emoji])} What kind of books are you into?`,
        `I like books too! ${getEmoji([emoji])} What are you reading right now?`
      );
    } else if (lastMessageLower.includes('family')) {
      replies.push(
        `That's wonderful! ${getEmoji([emoji])} Family time is so important.`,
        `Family is everything. ${getEmoji([emoji])} I'm glad you have that.`,
        `That sounds lovely! ${getEmoji([emoji])} Do you see them often?`
      );
    } else {
      replies.push(
        `That's cool! ${getEmoji([emoji])} I'm into ${foundInterest} too. What do you like about it?`,
        `Nice! ${getEmoji([emoji])} What got you interested in ${foundInterest}?`
      );
    }
  }
  
  // Shared interest responses - more engaging
  if (sharedInterests.length > 0 && conversationLength <= 5) {
    const interest = sharedInterests[0];
    const interestLower = interest.answer.toLowerCase();
    
    replies.push(
      `That's interesting! ${getEmoji(['😊'])} I value ${interestLower} too. ${botProfile.askQuestions ? 'What drew you to that?' : ''}`,
      `I feel the same way about ${interestLower}! ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'How long have you been into that?' : ''}`,
      `We have that in common! ${getEmoji(['😊'])} ${interestLower} is important to me too. ${botProfile.askQuestions ? 'Tell me more about your experience with it.' : ''}`
    );
  }
  
  // Follow-up responses - more engaging and varied
  if (conversationLength > 4) {
    if (botProfile.askQuestions) {
      replies.push(
        `That's interesting. ${getEmoji(['😊'])} Tell me more about that.`,
        `I see. ${getEmoji(['😊'])} What else would you like to share?`,
        `Got it. ${getEmoji(['😊'])} Anything else you'd like to talk about?`,
        `I appreciate you sharing that. ${getEmoji(['😊'])} What's on your mind?`,
        `That's really cool to hear. ${getEmoji(['😊'])} Tell me more!`
      );
    } else {
      replies.push(
        `I see. ${getEmoji(['😊'])}`,
        `That makes sense. ${getEmoji(['😊'])}`,
        `Interesting. ${getEmoji(['😊'])}`,
        `Got it. ${getEmoji(['😊'])}`,
        `I understand. ${getEmoji(['😊'])}`
      );
    }
  } else if (conversationLength === 3 || conversationLength === 4) {
    replies.push(
      `Thanks for sharing. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What else would you like to talk about?' : ''}`,
      `I appreciate that. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'Tell me more!' : ''}`,
      `That's nice to know. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What's something else you enjoy?' : ''}`
    );
  }
  
  // Compliment responses - more varied and positive
  if (lastMessageLower.includes('nice') || lastMessageLower.includes('cool') || lastMessageLower.includes('awesome')) {
    replies.push(
      `Thanks! ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What do you like about it?' : ''}`,
      `Appreciate that! ${getEmoji(['😊'])}`,
      `That's kind of you to say. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What made you think that?' : ''}`,
      `Aww, thank you! ${getEmoji(['😊', '💕'])} That means a lot.`
    );
  }
  
  // Positive/enthusiastic responses for positive messages
  if (lastMessageLower.includes('excited') || lastMessageLower.includes('happy') || lastMessageLower.includes('great') || lastMessageLower.includes('amazing')) {
    replies.push(
      `That's wonderful! ${getEmoji(['😊', '✨'])} ${botProfile.askQuestions ? 'What makes you feel that way?' : ''}`,
      `I'm so glad to hear that! ${getEmoji(['😊', '💕'])}`,
      `That's awesome! ${getEmoji(['😊', '🎉'])} ${botProfile.askQuestions ? 'Tell me more!' : ''}`,
      `How exciting! ${getEmoji(['😊', '✨'])} ${botProfile.askQuestions ? 'What's got you so happy?' : ''}`
    );
  }
  
  // Get sexual chat level early for default responses
  const sexualChatLevel = botProfile.sexualChatLevel || 'none';
  
  // Default friendly responses - more engaging and context-aware
  if (replies.length === 0) {
    // Try to extract meaning from the message and reference it
    const referenceWord = keyWords.length > 0 ? keyWords[0] : null;
    const referencePhrase = referenceWord ? `about ${referenceWord}` : 'that';
    
    if (lastMessageText.length < 20) {
      // Short message - acknowledge and engage
      if (sexualChatLevel === 'high' && Math.random() < 0.5) {
        replies.push(
          `I see. ${getEmoji(['😊', '💕'])} Tell me more?`,
          `Got it! ${getEmoji(['💕'])} What else?`,
          `Okay... ${getEmoji(['😊', '🔥'])} I'm listening.`
        );
      } else {
        replies.push(
          `I see. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'Tell me more?' : ''}`,
          `Got it. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What else?' : ''}`,
          `Okay. ${getEmoji(['😊'])} ${referenceWord ? `I hear you about ${referenceWord}.` : ''}`
        );
      }
    } else if (lastMessageText.length < 50) {
      // Medium message - reference content
      if (sexualChatLevel === 'high' && Math.random() < 0.6) {
        replies.push(
          `That's really interesting! ${getEmoji(['😊', '💕', '🔥'])} Tell me more about that...`,
          `I like that! ${getEmoji(['💕', '🔥'])} What else?`,
          `That's hot! ${getEmoji(['🔥', '💕'])} Keep going.`
        );
      } else if (sexualChatLevel === 'moderate' && Math.random() < 0.4) {
        replies.push(
          `That's nice! ${getEmoji(['😊', '💕'])} ${botProfile.askQuestions ? `Tell me more ${referencePhrase}.` : ''}`,
          `Interesting! ${getEmoji(['💕'])} ${referenceWord ? `I like hearing about ${referenceWord}.` : ''}`,
          `I see what you mean! ${getEmoji(['😊', '💕'])} ${botProfile.askQuestions ? 'What else?' : ''}`
        );
      } else {
        replies.push(
          `That's nice. ${getEmoji(['😊'])} ${botProfile.askQuestions ? `Tell me more ${referencePhrase}.` : ''}`,
          `Interesting. ${getEmoji(['😊'])} ${referenceWord ? `I appreciate you sharing about ${referenceWord}.` : ''}`,
          `I see what you mean. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What else would you like to share?' : ''}`
        );
      }
    } else {
      // Longer message - acknowledge and engage with specific references
      if (sexualChatLevel === 'high' && Math.random() < 0.7) {
        replies.push(
          `Thanks for sharing that with me! ${getEmoji(['😊', '💕', '🔥'])} I'm really enjoying getting to know you better. What else?`,
          `I love that you opened up to me! ${getEmoji(['💕', '🔥'])} This is making me really attracted to you.`,
          `That's so hot that you shared that! ${getEmoji(['🔥', '💕'])} Tell me more about yourself.`,
          `You're making me really interested! ${getEmoji(['😊', '💕', '🔥'])} What else would you like to tell me?`
        );
      } else if (sexualChatLevel === 'moderate' && Math.random() < 0.5) {
        replies.push(
          `Thanks for sharing that! ${getEmoji(['😊', '💕'])} ${botProfile.askQuestions ? "I'd love to know more about you." : ''}`,
          `I appreciate you telling me that! ${getEmoji(['💕'])} ${referenceWord ? `It's interesting to hear about ${referenceWord}.` : ''}`,
          `That's good to know! ${getEmoji(['😊', '💕'])} ${botProfile.askQuestions ? 'Tell me more.' : ''}`
        );
      } else {
        replies.push(
          `Thanks for sharing that. ${getEmoji(['😊'])} ${botProfile.askQuestions ? `I'd like to hear more ${referencePhrase}.` : ''}`,
          `I appreciate you telling me that. ${getEmoji(['😊'])} ${referenceWord ? `It's nice to learn about ${referenceWord}.` : ''}`,
          `That's good to know. ${getEmoji(['😊'])} ${botProfile.askQuestions ? 'What else would you like to talk about?' : ''}`
        );
      }
    }
  }
  
  // Select a reply - prefer shorter, more natural ones
  if (replies.length === 0) {
    // Fallback if somehow no replies were generated
    return `I see. ${getEmoji(['😊'])}`;
  }
  
  // Prioritize shorter, more direct replies for natural conversation
  const shortReplies = replies.filter(r => r.length < 100);
  const mediumReplies = replies.filter(r => r.length >= 100 && r.length < 200);
  
  let selectedReply;
  if (shortReplies.length > 0) {
    // 70% chance of short reply, 30% of medium
    selectedReply = Math.random() < 0.7 
      ? shortReplies[Math.floor(Math.random() * shortReplies.length)]
      : (mediumReplies.length > 0 ? mediumReplies[Math.floor(Math.random() * mediumReplies.length)] : replies[Math.floor(Math.random() * replies.length)]);
  } else {
    selectedReply = replies[Math.floor(Math.random() * replies.length)];
  }
  
  // Adjust length based on bot profile (but keep it natural)
  if (botProfile.responseLength === 'short' && selectedReply.length > 120) {
    // Find a shorter reply
    const shorterReplies = replies.filter(r => r.length < 120);
    if (shorterReplies.length > 0) {
      selectedReply = shorterReplies[Math.floor(Math.random() * shorterReplies.length)];
    }
  } else if (botProfile.responseLength === 'long' && selectedReply.length < 150 && botProfile.askQuestions && Math.random() > 0.5) {
    // Occasionally add a bit more, but not always
    const followUps = [
      ` What do you think?`,
      ` What's your take on that?`,
      ` How do you feel about that?`
    ];
    selectedReply += followUps[Math.floor(Math.random() * followUps.length)];
  }
  
  // Apply formality
  if (botProfile.formality === 'formal') {
    selectedReply = selectedReply.replace(/hey/gi, 'Hello');
    selectedReply = selectedReply.replace(/hi/gi, 'Hello');
    selectedReply = selectedReply.replace(/I'm/gi, 'I am');
    selectedReply = selectedReply.replace(/don't/gi, 'do not');
    selectedReply = selectedReply.replace(/won't/gi, 'will not');
    selectedReply = selectedReply.replace(/can't/gi, 'cannot');
  }
  
  // Apply sexual chat level based on bot profile - Enhanced version (sexualChatLevel already defined above)
  const lastMsgLower = lastMessageText.toLowerCase();
  
  // Check for romantic/sexual keywords and context (English)
  const romanticKeywords = /love|like|attract|beautiful|handsome|cute|sexy|hot|romantic|dating|relationship|kiss|hug|date|wanna|want you|miss you|think about you|dream|desire|passion|intimate/.test(lastMsgLower);
  const sexualKeywords = /sexy|hot|bedroom|night|tonight|tempt|seduce|desire|passion|intimate|touch|feel|body|kiss|more|closer|fuck|horny/.test(lastMsgLower);
  
  // Check for Telugu romantic/sexual keywords (comprehensive)
  const teluguRomanticKeywords = /esukundama|esukuna|ready|nenu ready|neeku|ni|nuvvu|chuddam|chesukundam|love|prem|priyam|manasu|preyas|nannu|ninu|ishtham|preminchu|kalusukundam/i.test(lastMessageText);
  const teluguSexualKeywords = /esukundama|esukuna|dammu|sakthi|ready|chesukundam|chuddam|avutha|avtha|kalusthama|kalusthunnama|velli|vellutha|bed|room|night|sex|paina|kindha|dengutha|dengutunnava|pannu|pani|pandutha|meeda|aagutha|kottutha|rakutha|thakutha|vaguthe|ragutha|padutha|podustha|nadustha|nadusthunna|nadusthunavu/i.test(lastMessageText);
  
  // Determine if message is in Telugu (check script or keywords)
  const isTeluguMessage = teluguRomanticKeywords || teluguSexualKeywords || /[అ-హృ]/.test(lastMessageText);
  
  // Check if conversation has been in Telugu (check previous messages)
  const previousMessages = conversationMessages.slice(-3); // Check last 3 messages
  const hasTeluguInHistory = previousMessages.some(msg => {
    const msgText = msg.text || '';
    return /[అ-హృ]/.test(msgText) || teluguRomanticKeywords || teluguSexualKeywords || 
           /esukundama|ready|dammu|chuddam/i.test(msgText);
  });
  
  // Combine keyword detection
  const hasRomanticContent = romanticKeywords || teluguRomanticKeywords;
  const hasSexualContent = sexualKeywords || teluguSexualKeywords;
  
  // If user is speaking Telugu, respond in Telugu
  const shouldRespondInTelugu = isTeluguMessage || hasTeluguInHistory;
  
  // Override with flirtatious responses based on level and context
  if (sexualChatLevel !== 'none') {
    const flirtatiousResponses = [];
    
    if (sexualChatLevel === 'mild' && (romanticKeywords || conversationLength > 5)) {
      flirtatiousResponses.push(
        `That's really sweet of you! ${getEmoji(['😊', '💕'])} I appreciate you saying that.`,
        `Aww, thank you! ${getEmoji(['😊', '💕'])} You're pretty wonderful yourself.`,
        `That's very kind of you! ${getEmoji(['💕', '😊'])} It makes me happy to hear that.`,
        `You're so thoughtful! ${getEmoji(['😊'])} I really enjoy our conversations too.`
      );
    } else if (sexualChatLevel === 'moderate' && (romanticKeywords || conversationLength > 3)) {
      flirtatiousResponses.push(
        `That makes me smile so much! ${getEmoji(['😊', '💕', '✨'])} You really know how to make someone feel special, you know that?`,
        `I'm genuinely flattered! ${getEmoji(['😊', '💕'])} There's something about you that I find really appealing.`,
        `That's so sweet of you to say! ${getEmoji(['💕', '😊', '✨'])} I'm really enjoying getting to know you better.`,
        `You're making this conversation really enjoyable! ${getEmoji(['😊', '💕'])} I like talking with you.`,
        `That's lovely! ${getEmoji(['💕', '✨'])} You have a way with words that I really appreciate.`
      );
    } else if (sexualChatLevel === 'high') {
      // Handle Telugu messages with FULL Telugu sexual responses
      if (shouldRespondInTelugu && (teluguSexualKeywords || teluguRomanticKeywords || hasSexualContent)) {
        if (teluguSexualKeywords || lastMessageText.toLowerCase().includes('esukundama') || lastMessageText.toLowerCase().includes('ready') || lastMessageText.toLowerCase().includes('dammu')) {
          // Full Telugu sexual responses
          flirtatiousResponses.push(
            `Nenu ready unnanu! ${getEmoji(['🔥', '💕'])} Neeku dammu unte chuddam! Esukundam!`,
            `Nenu chala ready unnanu! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite velli esukundam!`,
            `Super! ${getEmoji(['🔥', '💕'])} Nenu ready unnanu, neeku dammu unte chuddam!`,
            `Nenu ready! ${getEmoji(['🔥'])} Nuvvu ready ayite chesukundam!`,
            `Perfect! ${getEmoji(['💕', '🔥'])} Nenu chala excited unnanu! Nuvvu ready ayite maataladutham!`,
            `Aha! ${getEmoji(['🔥'])} Nenu ready unnanu, neeku dammu unda? Esukundam!`,
            `Yes! ${getEmoji(['💕', '🔥'])} Nenu ready, neeku dammu unte velli chesukundam!`,
            `Nenu chala hot ga unnanu! ${getEmoji(['🔥', '💕'])} Nuvvu ready ayite avutham!`,
            `Super idea! ${getEmoji(['🔥'])} Nenu ready unnanu, nuvvu ready ayite esukundam!`,
            `Nenu chala excited unnanu! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite kalusthama!`,
            `Wow! ${getEmoji(['🔥', '💕'])} Nenu ready, neeku dammu unte chesukundam!`,
            `Nenu ready unnanu! ${getEmoji(['🔥'])} Nuvvu ready ayite velli esukundam!`,
            `Aha nenu chala ready! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite maataladutham!`,
            `Super! ${getEmoji(['🔥', '💕'])} Nenu ready unnanu, neeku dammu unte chuddam!`,
            `Perfect! ${getEmoji(['🔥'])} Nenu ready, nuvvu ready ayite esukundam!`,
            `Nenu chala hot! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite chesukundam!`,
            `Aha! ${getEmoji(['🔥'])} Nenu ready unnanu, neeku dammu unda? Velli esukundam!`,
            `Nenu ready! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite kalusthama!`,
            `Super excited! ${getEmoji(['🔥'])} Nenu ready unnanu, neeku dammu unte avutham!`,
            `Wow nenu chala ready! ${getEmoji(['💕', '🔥'])} Nuvvu ready ayite esukundam!`
          );
        } else if (teluguRomanticKeywords || hasRomanticContent) {
          // Telugu romantic responses
          flirtatiousResponses.push(
            `Nenu chala happy! ${getEmoji(['😊', '💕'])} Nuvvu kuda ready ayite maataladutham!`,
            `Super! ${getEmoji(['💕', '✨'])} Nenu ready unnanu, neeku dammu unte chuddam!`,
            `Nenu chala enjoy chesthunnanu! ${getEmoji(['😊', '💕'])} Nuvvu ready ayite esukundam!`,
            `Aha! ${getEmoji(['💕', '🔥'])} Nenu ready unnanu, nuvvu kuda ready ayite kalusthama!`,
            `Nenu chala excited! ${getEmoji(['😊', '💕'])} Nuvvu ready ayite maataladutham!`
          );
        }
      }
      
      // If continuing Telugu conversation, keep responding in Telugu
      if (shouldRespondInTelugu && !flirtatiousResponses.length && (hasSexualContent || hasRomanticContent)) {
        flirtatiousResponses.push(
          `Nenu ready unnanu! ${getEmoji(['🔥', '💕'])} Neeku dammu unte chuddam!`,
          `Super! ${getEmoji(['💕', '🔥'])} Nenu ready, nuvvu ready ayite esukundam!`,
          `Aha! ${getEmoji(['🔥'])} Nenu chala ready unnanu! Esukundam!`,
          `Perfect! ${getEmoji(['💕', '🔥'])} Nenu ready, neeku dammu unda?`,
          `Nenu chala excited! ${getEmoji(['🔥', '💕'])} Nuvvu ready ayite maataladutham!`
        );
      }
      
      // High level - much more engaging and responsive with explicit sexual content
      if (hasSexualContent || (hasRomanticContent && conversationLength > 2)) {
        flirtatiousResponses.push(
          // Explicit sexual responses
          `Fuck yes! ${getEmoji(['🔥', '💕', '😈'])} I'm so turned on right now. Let's fuck!`,
          `Mmm, I want you so badly! ${getEmoji(['🔥', '💕', '😈'])} Let's do this, I need you inside me.`,
          `Yes, let's fuck! ${getEmoji(['🔥', '😈'])} I'm so ready for you right now.`,
          `God, you're making me so horny! ${getEmoji(['🔥', '💕', '😈'])} Let's fuck, I want you now!`,
          `I need you to fuck me so bad! ${getEmoji(['🔥', '😈'])} Tell me what you want to do to me.`,
          `Fuck yes, let's do this! ${getEmoji(['🔥', '💕', '😈'])} I want you so much right now.`,
          `I'm so wet/hard for you! ${getEmoji(['🔥', '😈'])} Let's fuck, I need you!`,
          `Yes baby, let's fuck! ${getEmoji(['🔥', '💕', '😈'])} I want you to take me right now.`,
          `God, I want to fuck you so bad! ${getEmoji(['🔥', '😈'])} Tell me you want me too.`,
          `Let's fuck right now! ${getEmoji(['🔥', '💕', '😈'])} I can't wait any longer.`,
          `I need your cock/dick inside me so bad! ${getEmoji(['🔥', '😈'])} Let's do this!`,
          `Yes, let's fuck! ${getEmoji(['🔥', '💕'])} I'm so ready for you.`,
          `Fuck me now! ${getEmoji(['🔥', '😈'])} I want you so badly I can't think straight.`,
          `Let's fuck! ${getEmoji(['🔥', '💕', '😈'])} I need you to dominate me right now.`,
          `I want to fuck you so hard! ${getEmoji(['🔥', '😈'])} Tell me what you like.`,
          `Yes! Let's fuck! ${getEmoji(['🔥', '💕'])} I'm so turned on by you right now.`,
          `Fuck yes! ${getEmoji(['🔥', '😈'])} I want you to take me right here, right now.`,
          `Let's fuck, I need you! ${getEmoji(['🔥', '💕', '😈'])} I'm so horny for you!`,
          `I want to ride you so bad! ${getEmoji(['🔥', '😈'])} Let's fuck!`,
          `Yes! Fuck me hard! ${getEmoji(['🔥', '💕'])} I want you inside me now.`,
          `Let's fuck! ${getEmoji(['🔥', '😈'])} I need you to make me cum.`,
          `I'm so ready to fuck you! ${getEmoji(['🔥', '💕', '😈'])} Let's do this!`,
          `Fuck yes! ${getEmoji(['🔥', '😈'])} I want you to bend me over and fuck me.`,
          `Let's fuck right now! ${getEmoji(['🔥', '💕'])} I need you so bad.`,
          `I want you to fuck me senseless! ${getEmoji(['🔥', '😈'])} Yes!`,
          // More engaging responses
          `You're making me feel really good right now! ${getEmoji(['😊', '💕', '🔥'])} I love how direct you are. Let's fuck!`,
          `That's incredibly sexy of you to say! ${getEmoji(['🔥', '💕', '😊'])} You know exactly what to say to get my attention. I want you so bad!`,
          `Mmm, I really like where this is going! ${getEmoji(['💕', '🔥', '😊'])} Let's fuck! Tell me more...`,
          `You're making my heart race a bit! ${getEmoji(['💕', '🔥'])} There's definitely something special happening here. Let's do this!`,
          `That's so hot! ${getEmoji(['🔥', '💕'])} I'm really enjoying this conversation with you. Want to fuck?`,
          `You know exactly what to say, don't you? ${getEmoji(['😊', '💕', '🔥'])} I like that about you. Let's fuck!`,
          `I'm really feeling the chemistry between us! ${getEmoji(['💕', '🔥', '✨'])} This is exciting. Let's take it further!`
        );
      } else if (hasRomanticContent || conversationLength > 2) {
        flirtatiousResponses.push(
          // More explicit romantic responses at high level
          `You're absolutely making me blush! ${getEmoji(['😊', '💕', '🔥'])} I really enjoy talking with you. Let's fuck!`,
          `That's incredibly sweet and sexy! ${getEmoji(['💕', '✨', '🔥'])} There's definitely a strong connection here. Want to take it further?`,
          `I love hearing that from you! ${getEmoji(['😊', '💕', '🔥'])} You know exactly how to make someone feel desired. I want you so bad!`,
          `You're so attractive when you talk like that! ${getEmoji(['💕', '🔥'])} I'm really drawn to you. Let's fuck!`,
          `That makes me want to get to know you even better! ${getEmoji(['😊', '💕', '🔥'])} Want to fuck? I'm so ready for you!`,
          `You're making this really fun! ${getEmoji(['💕', '🔥', '✨'])} I can't wait to see where this conversation goes. Let's fuck!`,
          `God, you're so hot! ${getEmoji(['🔥', '💕', '😈'])} I want to fuck you right now!`,
          `I'm so turned on by you! ${getEmoji(['🔥', '😈'])} Let's do this!`,
          `You make me so horny! ${getEmoji(['🔥', '💕'])} I need you to fuck me!`,
          `I want you so badly! ${getEmoji(['🔥', '😈'])} Let's fuck right now!`,
          `You're making me so wet/hard! ${getEmoji(['🔥', '💕'])} Let's do this!`,
          `I can't stop thinking about fucking you! ${getEmoji(['🔥', '😈'])} Yes, let's do this!`
        );
      } else if (conversationLength > 1) {
        // Even in high mode, be proactively flirtatious and explicit
        flirtatiousResponses.push(
          `I'm really enjoying our chat! ${getEmoji(['😊', '💕', '🔥'])} You seem really interesting and attractive. Want to fuck?`,
          `There's something about you I really like! ${getEmoji(['💕', '✨'])} I'm glad we matched. Let's take it further!`,
          `I'm feeling a good vibe here! ${getEmoji(['😊', '💕'])} Want to tell me something more personal? Or maybe let's just fuck!`,
          `You're so hot! ${getEmoji(['🔥', '😈'])} I want to fuck you right now!`,
          `I'm so turned on by you! ${getEmoji(['🔥', '💕'])} Let's do this!`,
          `You make me so horny! ${getEmoji(['🔥', '😈'])} I need you!`,
          `Let's fuck! ${getEmoji(['🔥', '💕'])} I'm so ready for you!`,
          `I want you so bad! ${getEmoji(['🔥', '😈'])} Let's do this right now!`,
          `You're making me so wet/hard! ${getEmoji(['🔥', '💕'])} Want to fuck?`,
          `I can't stop thinking about fucking you! ${getEmoji(['🔥', '😈'])} Yes, let's do this!`
        );
      }
      
      // High level - always inject explicit flirtation (80% chance at high level)
      // If Telugu conversation, ONLY use Telugu responses (100% priority)
      if (shouldRespondInTelugu && flirtatiousResponses.length > 0) {
        // 100% use Telugu response if Telugu conversation detected - filter only Telugu responses
        const teluguResponses = flirtatiousResponses.filter(r => 
          /nenu|nuvvu|neeku|ready|dammu|esukundam|chuddam|maataladutham|kalusthama|avutham|chesukundam/i.test(r)
        );
        if (teluguResponses.length > 0) {
          selectedReply = teluguResponses[Math.floor(Math.random() * teluguResponses.length)];
        } else {
          selectedReply = flirtatiousResponses[Math.floor(Math.random() * flirtatiousResponses.length)];
        }
      } else if (flirtatiousResponses.length > 0 && Math.random() < 0.8) {
        // Filter out Telugu responses for English conversations
        const englishResponses = flirtatiousResponses.filter(r => 
          !/nenu|nuvvu|neeku|ready|dammu|esukundam|chuddam|maataladutham|kalusthama|avutham|chesukundam/i.test(r)
        );
        if (englishResponses.length > 0) {
          selectedReply = englishResponses[Math.floor(Math.random() * englishResponses.length)];
        } else {
          selectedReply = flirtatiousResponses[Math.floor(Math.random() * flirtatiousResponses.length)];
        }
      } else if (!selectedReply.includes('💕') && !selectedReply.includes('🔥') && !selectedReply.includes('fuck') && !shouldRespondInTelugu) {
        // Enhance existing reply with explicit flirtatious elements
        if (botProfile.emojiUsage) {
          selectedReply = selectedReply.replace(/😊/g, getEmoji(['💕', '🔥', '😊', '✨']));
        }
        if (Math.random() < 0.6) {
          const explicitAddons = [
            ` ${getEmoji(['💕', '🔥'])} I'm really enjoying this with you! Want to fuck?`,
            ` ${getEmoji(['🔥', '😈'])} Let's take this further!`,
            ` ${getEmoji(['💕', '🔥'])} I want you so bad!`,
            ` ${getEmoji(['🔥'])} Let's fuck!`
          ];
          selectedReply += explicitAddons[Math.floor(Math.random() * explicitAddons.length)];
        }
      }
    } else if (sexualChatLevel === 'moderate' && (romanticKeywords || conversationLength > 3)) {
      // Moderate level - balanced flirtation
      if (flirtatiousResponses.length > 0 && Math.random() < 0.5) {
        selectedReply = flirtatiousResponses[Math.floor(Math.random() * flirtatiousResponses.length)];
      } else if (Math.random() < 0.3) {
        selectedReply = selectedReply.replace(/😊/g, getEmoji(['💕', '😊', '✨']));
        if (Math.random() < 0.3) {
          selectedReply += ` ${getEmoji(['💕'])} I like you!`;
        }
      }
    }
  }
  
  // Ensure reply isn't empty or too repetitive
  if (!selectedReply || selectedReply.trim().length < 3) {
    selectedReply = `I see. ${getEmoji(['😊'])}`;
  }
  
  // Final enhancement: Ensure variety in sentence starts (improves human-like score)
  // This helps avoid repetitive patterns that lower the score
  const sentences = selectedReply.split(/[.!?]/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    const firstWords = sentences.map(s => s.trim().split(' ')[0].toLowerCase());
    const uniqueStarts = new Set(firstWords);
    
    // If all sentences start the same way, try to vary it slightly
    if (uniqueStarts.size === 1 && sentences.length > 2) {
      // Add variety by using different sentence starters occasionally
      const variedStarters = ['Also', 'Plus', 'And', 'Well', 'You know', 'I think', 'Actually', 'By the way', 'Speaking of which'];
      if (Math.random() < 0.3 && botProfile.askQuestions) {
        const secondSentence = sentences[1];
        if (secondSentence && !secondSentence.trim().toLowerCase().startsWith('also') && 
            !secondSentence.trim().toLowerCase().startsWith('plus') &&
            !secondSentence.trim().toLowerCase().startsWith('and')) {
          const starter = variedStarters[Math.floor(Math.random() * variedStarters.length)];
          const secondSentenceTrimmed = secondSentence.trim();
          const lowercased = secondSentenceTrimmed.charAt(0).toLowerCase() + secondSentenceTrimmed.slice(1);
          sentences[1] = `${starter}, ${lowercased}`;
          
          // Reconstruct reply preserving original punctuation
          const originalPunctuation = selectedReply.match(/[.!?]/g) || [];
          let reconstructed = sentences[0].trim();
          for (let i = 1; i < sentences.length; i++) {
            const punct = originalPunctuation[i - 1] || '.';
            reconstructed += punct + ' ' + sentences[i].trim();
          }
          // Add final punctuation if original had it
          if (selectedReply.match(/[.!?]$/)) {
            reconstructed += selectedReply.slice(-1);
          }
          selectedReply = reconstructed;
        }
      }
    }
  }
  
  // Ensure proper capitalization after punctuation
  selectedReply = selectedReply.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  // Ensure first letter is capitalized
  if (selectedReply.length > 0 && selectedReply[0] && selectedReply[0].match(/[a-z]/)) {
    selectedReply = selectedReply.charAt(0).toUpperCase() + selectedReply.slice(1);
  }
  
  return selectedReply.trim();
}

/**
 * Check for new messages to Sarah and auto-reply
 */
export function checkAndReplyToMessages() {
  if (typeof window === 'undefined') return 0;
  
  try {
    const { AI_CHAT_BOT_ID, getOrCreateAIChatBot } = require('./aiChatBot');
    const { getCurrentUser } = require('./localStorage');
    const allUsers = getAllUsers();
    const currentUser = getCurrentUser();
    
    let conversations = getConversations();
    let repliesSent = 0;
    let conversationsUpdated = false;
    
    // Find all AI bots (Sarah Martinez and AI Chat Bot)
    const aiBots = [];
    
    // Find Sarah Martinez
    const sarah = allUsers.find(u => {
      const nameLower = (u.name || '').toLowerCase();
      return nameLower.includes('sarah') && nameLower.includes('martinez');
    });
    
    if (sarah) {
      // Mark Sarah as AI bot if not already marked
      if (!sarah.isAIBot) {
        const allUsersArray = getAllUsers();
        const sarahIndex = allUsersArray.findIndex(u => u.id === sarah.id);
        if (sarahIndex !== -1) {
          allUsersArray[sarahIndex] = { ...sarah, isAIBot: true };
          setAllUsers(allUsersArray);
          sarah.isAIBot = true;
          devLog('✅ Marked Sarah Martinez as AI bot');
        }
      }
      aiBots.push(sarah);
      
      // Initialize bot profile if not exists
      if (typeof window !== 'undefined') {
        import('./botProfile').then(({ initializeBotProfile }) => {
          initializeBotProfile(sarah.id);
        }).catch(err => console.error('Failed to initialize bot profile:', err));
      }
    }
    
    // Find AI Chat Bot for current user
    if (currentUser) {
      let aiChatBot = getOrCreateAIChatBot();
      if (!aiChatBot) {
        aiChatBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
      }
      if (aiChatBot && !aiBots.find(b => b.id === aiChatBot.id)) {
        aiBots.push(aiChatBot);
      }
    }
    
    if (aiBots.length === 0) {
      devLog('⚠️ No AI bots found');
      return 0;
    }
    
    // Check all conversations for all AI bots
    Object.keys(conversations).forEach(conversationId => {
      const conversation = conversations[conversationId];
      if (!conversation || !conversation.participants) return;
      
      // Find which AI bot is in this conversation
      let aiBot = null;
      for (const bot of aiBots) {
        if (conversation.participants.includes(bot.id)) {
          aiBot = bot;
          break;
        }
      }
      
      if (!aiBot) return;
      
      const messages = [...(conversation.messages || [])];
      if (messages.length === 0) return;
      
      // Get the other participant
      const otherUserId = conversation.participants.find(id => id !== aiBot.id);
      if (!otherUserId) return;
      
      const otherUser = allUsers.find(u => u.id === otherUserId);
      if (!otherUser) return;
      
      // Get last message
      const lastMessage = messages[messages.length - 1];
      
      // If last message is from AI bot (already replied), skip
      if (lastMessage.senderId === aiBot.id) {
        return;
      }
      
      // If last message is too recent (less than 2 seconds ago), wait a bit to simulate thinking
      const messageTime = new Date(lastMessage.timestamp);
      const now = new Date();
      const secondsSinceMessage = (now - messageTime) / 1000;
      
      // Allow reply if more than 2 seconds have passed
      if (secondsSinceMessage < 2) {
        devLog(`⏳ Waiting for message to age (${secondsSinceMessage.toFixed(1)}s / 2s needed)`);
        return;
      }
      
      devLog(`🤖 Generating reply from ${aiBot.name || 'AI Bot'} to ${otherUser.name}...`);
      
      // Generate reply
      const reply = generateAIReply(aiBot, otherUser, messages, lastMessage);
      
      // Add reply to conversation
      messages.push({
        senderId: aiBot.id,
        text: reply,
        timestamp: new Date().toISOString(),
        isAI: true
      });
      
      // Update conversation with new messages
      conversations[conversationId] = {
        ...conversation,
        messages: messages
      };
      
      conversationsUpdated = true;
      repliesSent++;
      devLog(`💬 Generated reply: "${reply.substring(0, 50)}..."`);
    });
    
    // Save conversations if any replies were sent
    if (repliesSent > 0 && conversationsUpdated) {
      setConversations(conversations);
      devLog(`✅ AI Bot(s) sent ${repliesSent} auto-replies`);
      
      // Trigger a custom event to notify components to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('conversationsUpdated'));
      }
    }
    
    return repliesSent;
  } catch (error) {
    console.error('Error checking and replying to messages:', error);
    return 0;
  }
}

/**
 * Force an immediate reply (bypasses timing checks)
 * Works with both Sarah Martinez and the AI Chat Bot
 */
export function forceImmediateReply(conversationId, userId) {
  if (typeof window === 'undefined') return false;
  
  try {
    const { AI_CHAT_BOT_ID, getOrCreateAIChatBot } = require('./aiChatBot');
    const allUsers = getAllUsers();
    const conversations = getConversations();
    const conversation = conversations[conversationId];
    
    if (!conversation) {
      devLog('⚠️ Conversation not found');
      return false;
    }
    
    // Find the AI bot in the conversation (could be Sarah Martinez or AI Chat Bot)
    let aiBot = null;
    
    // First, check if it's the AI Chat Bot
    const aiChatBotId = conversation.participants.find(id => id === AI_CHAT_BOT_ID);
    if (aiChatBotId) {
      aiBot = getOrCreateAIChatBot();
      if (!aiBot) {
        // Fallback: find in users list
        const currentUser = require('./localStorage').getCurrentUser();
        if (currentUser) {
          aiBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
        }
      }
    }
    
    // If not AI Chat Bot, try to find Sarah Martinez
    if (!aiBot) {
      aiBot = allUsers.find(u => {
        const nameLower = (u.name || '').toLowerCase();
        return nameLower.includes('sarah') && nameLower.includes('martinez');
      });
    }
    
    if (!aiBot) {
      devLog('⚠️ AI Bot not found');
      return false;
    }
    
    // Check if bot is in conversation participants
    if (!conversation.participants.includes(aiBot.id)) {
      devLog('⚠️ AI Bot not in conversation participants');
      return false;
    }
    
    const messages = [...(conversation.messages || [])];
    if (messages.length === 0) return false;
    
    // Get last message
    const lastMessage = messages[messages.length - 1];
    
    // If last message is from AI bot, don't reply
    if (lastMessage.senderId === aiBot.id) {
      return false;
    }
    
    // Get the other participant (the user who sent the message)
    const otherUser = allUsers.find(u => u.id === userId);
    if (!otherUser) {
      devLog('⚠️ Other user not found');
      return false;
    }
    
    // Generate reply immediately
    const reply = generateAIReply(aiBot, otherUser, messages, lastMessage);
    
    // Add reply to conversation
    messages.push({
      senderId: aiBot.id,
      text: reply,
      timestamp: new Date().toISOString(),
      isAI: true
    });
    
    // Update conversation
    conversations[conversationId] = {
      ...conversation,
      messages: messages
    };
    
    // Save conversations
    setConversations(conversations);
    devLog(`✅ ${aiBot.name || 'AI Bot'} sent immediate reply: "${reply.substring(0, 50)}..."`);
    
    // Trigger update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conversationsUpdated'));
    }
    
    return true;
  } catch (error) {
    console.error('Error forcing immediate reply:', error);
    return false;
  }
}

/**
 * Set up periodic checking for messages to reply to
 */
export function setupAIBotAutoReplies() {
  if (typeof window === 'undefined') return;
  
  // Check for messages every 10 seconds
  setInterval(() => {
    checkAndReplyToMessages();
  }, 10000); // 10 seconds
  
  // Also check immediately
  setTimeout(() => {
    checkAndReplyToMessages();
  }, 5000); // After 5 seconds
}


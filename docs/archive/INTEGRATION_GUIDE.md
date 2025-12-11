# Integration Guide - Complete Feature Integration

This guide provides step-by-step instructions for integrating all new features into existing pages.

## ✅ Completed Integrations

### 1. API Service Layer (`lib/api.js`)
- ✅ Created mock API functions for all features
- ✅ Ready to replace with real backend endpoints
- ✅ Includes: photo upload, verification, video chat, voice messages, social media, safety, subscription

### 2. Onboarding Page Updates
- ✅ Added PhotoUpload component
- ✅ Added PhotoVerification component  
- ✅ Added SocialMediaIntegration component
- ✅ Added education, occupation, lifestyle fields
- ✅ Updated formData structure
- ✅ Updated validation logic

## 🔄 Remaining Integrations Needed

### Profile Page (`app/profile/page.js`)

**Add Multiple Photos Display:**
```javascript
import PhotoUpload from '@/components/ui/PhotoUpload';
import PhotoVerification from '@/components/ui/PhotoVerification';

// In the profile display section, replace single photo with:
{user.photos && user.photos.length > 0 ? (
  <div className="grid grid-cols-3 gap-2">
    {user.photos.map((photo, idx) => (
      <img key={photo.id || idx} src={photo.url} alt={`Photo ${idx + 1}`} />
    ))}
  </div>
) : (
  // Fallback to single photoUrl
)}
```

**Add Verification Badge:**
```javascript
{user.verified && (
  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
    <CheckBadgeIcon className="w-5 h-5 text-white" />
  </div>
)}
```

**Add Social Media Links:**
```javascript
{user.socialMedia && (
  <div className="mt-4">
    <h4 className="font-semibold mb-2">Social Media</h4>
    {user.socialMedia.instagram && (
      <a href={`https://instagram.com/${user.socialMedia.instagram}`}>
        Instagram
      </a>
    )}
    {user.socialMedia.spotify && (
      <a href={user.socialMedia.spotify}>Spotify</a>
    )}
  </div>
)}
```

### Messages Page (`app/messages/page.js`)

**Add Voice Message Button:**
```javascript
import VoiceMessage from '@/components/ui/VoiceMessage';
import { uploadVoiceMessage } from '@/lib/api';

// Add state
const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

// Add button next to message input
<button onClick={() => setShowVoiceRecorder(true)}>
  🎤 Voice
</button>

// Add VoiceMessage component
{showVoiceRecorder && (
  <VoiceMessage
    onSend={async (audioBlob) => {
      const voiceData = await uploadVoiceMessage(audioBlob, selectedConversationId);
      handleSendMessage('', voiceData); // Send voice message
      setShowVoiceRecorder(false);
    }}
    onCancel={() => setShowVoiceRecorder(false)}
  />
)}
```

**Add Video Chat Button:**
```javascript
import VideoChat from '@/components/ui/VideoChat';
import { getVideoCallToken } from '@/lib/api';

// Add state
const [showVideoChat, setShowVideoChat] = useState(false);

// Add button in chat header
<button onClick={() => setShowVideoChat(true)}>
  📹 Video Call
</button>

// Add VideoChat component
{showVideoChat && (
  <VideoChat
    isOpen={showVideoChat}
    onClose={() => setShowVideoChat(false)}
    otherUser={selectedUser}
    currentUser={currentUser}
  />
)}
```

**Add Safety Actions:**
```javascript
import SafetyActions from '@/components/ui/SafetyActions';

// Add in chat header
<SafetyActions
  userId={selectedUser.id}
  userName={selectedUser.name}
  onBlock={(userId) => {
    // Handle block
    router.push('/discover');
  }}
  onReport={(userId, reason) => {
    showToast('User reported. Thank you for keeping VibeMatch safe.', 'success');
  }}
/>
```

### Discover Page (`app/discover/page.js`)

**Add Verification Badges to ProfileCard:**
```javascript
// In ProfileCard component, add:
{user.verified && (
  <div className="absolute top-5 left-5 bg-green-500 rounded-full p-2">
    <CheckBadgeIcon className="w-5 h-5 text-white" />
  </div>
)}
```

**Update FilterPanel Usage:**
The FilterPanel already has advanced filters integrated. Just ensure it's being used correctly:
```javascript
<FilterPanel
  filters={filters}
  onFiltersChange={setFilters}
  currentUserAgeGroup={currentUser.ageGroup}
/>
```

### Subscription Page (`app/subscription/page.js`)

**Update for Multiple Tiers:**
```javascript
import { getTierPricing, SUBSCRIPTION_TIERS } from '@/lib/subscription';

const tiers = getTierPricing();

// Display all tiers
{tiers[SUBSCRIPTION_TIERS.BASIC] && (
  <Card>
    <h3>{tiers[SUBSCRIPTION_TIERS.BASIC].name}</h3>
    <p>${tiers[SUBSCRIPTION_TIERS.BASIC].price}/{tiers[SUBSCRIPTION_TIERS.BASIC].period}</p>
    <ul>
      {tiers[SUBSCRIPTION_TIERS.BASIC].features.map(f => <li>{f}</li>)}
    </ul>
    <Button onClick={() => upgradeToTier(SUBSCRIPTION_TIERS.BASIC)}>
      Upgrade to Basic
    </Button>
  </Card>
)}
// Repeat for PLUS and VIP
```

## 📱 Mobile App Initialization

### Step 1: Initialize React Native Project
```bash
cd mobile
npx react-native init VibeMatch --version 0.72.6
```

### Step 2: Copy Configuration
- Copy `mobile/package.json` dependencies
- Copy `mobile/src/config/api.js` to the new project
- Follow `mobile/IMPLEMENTATION_GUIDE.md`

### Step 3: Install Dependencies
```bash
npm install
cd ios && pod install && cd ..
```

### Step 4: Run
```bash
npm run ios
# or
npm run android
```

## 🧪 Testing Checklist

### Photo Features
- [ ] Upload multiple photos (1-9)
- [ ] Reorder photos
- [ ] Remove photos
- [ ] Photo verification flow
- [ ] Verification badge displays

### Communication Features
- [ ] Voice message recording
- [ ] Voice message playback
- [ ] Video chat connection
- [ ] Video chat controls (mute, video toggle)

### Safety Features
- [ ] Block user functionality
- [ ] Report user with reasons
- [ ] Blocked users don't appear in discover

### Filtering Features
- [ ] Education filter works
- [ ] Occupation filter works
- [ ] Lifestyle filters work
- [ ] Premium-only filters gated correctly

### Subscription Features
- [ ] Multiple tiers display
- [ ] Tier upgrade works
- [ ] Tier-based feature access

### Social Media
- [ ] Instagram linking
- [ ] Spotify linking
- [ ] Social media displays on profile

## 🔧 Backend API Endpoints Needed

When connecting to real backend, implement these endpoints:

1. **POST /api/user/photos** - Upload photos
2. **POST /api/user/verify-photo** - Verify photo with selfie
3. **GET /api/video/token** - Get video call token
4. **POST /api/messages/voice** - Upload voice message
5. **POST /api/social/link** - Link social media
6. **POST /api/safety/block** - Block user
7. **POST /api/safety/report** - Report user
8. **POST /api/subscription/upgrade** - Upgrade subscription

## 📝 Notes

- All components are ready to use
- API layer uses mocks - replace with real endpoints
- Mobile app structure is ready - initialize React Native project
- All features follow existing code patterns


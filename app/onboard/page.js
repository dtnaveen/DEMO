'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingStep from '@/components/OnboardingStep';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { VALUE_QUESTIONS, CONTENT_QUESTIONS, GENDERS, LOOKING_FOR, GENDER_PREFERENCES, DEAL_BREAKERS, getAgeGroup, EDUCATION_LEVELS, LIFESTYLE_OPTIONS, OCCUPATION_CATEGORIES } from '@/lib/constants';
import { setCurrentUser, getAllUsers, setAllUsers } from '@/lib/localStorage';
import { initializeMockData } from '@/lib/mockData';
import { generateId, showToast } from '@/utils/helpers';
import { getCurrentLocation, getCoordinatesFromLocation, getLocationName } from '@/lib/gpsUtils';
import PhotoUpload from '@/components/ui/PhotoUpload';
import PhotoVerification from '@/components/ui/PhotoVerification';
import SocialMediaIntegration from '@/components/ui/SocialMediaIntegration';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    location: '',
    photoUrl: '',
    photos: [], // Multiple photos
    latitude: null,
    longitude: null,
    
    // Step 2: Age group (auto-detected)
    ageGroup: '',
    
    // Step 3: Values (10 answers)
    valueAnswers: [],
    
    // Step 4: Content preferences (5 answers)
    contentAnswers: [],
    
    // Step 5: Preferences & Filters
    preferences: {
      lookingFor: 'Relationship',
      ageRange: [18, 50],
      distance: 25,
      genderPreference: ['Everyone'],
      dealBreakers: []
    },
    
    // Step 6: Additional fields
    education: '',
    occupation: '',
    lifestyle: {
      exercise: '',
      diet: '',
      drinking: '',
      smoking: '',
      pets: '',
      children: ''
    },
    socialMedia: {
      instagram: '',
      spotify: '',
      customLinks: []
    },
    verified: false
  });
  const [showVerification, setShowVerification] = useState(false);
  
  // Initialize mock data on mount
  useEffect(() => {
    initializeMockData();
  }, []);
  
  // Auto-detect age group when age changes
  useEffect(() => {
    if (formData.age) {
      const age = parseInt(formData.age);
      if (age >= 18) {
        setFormData(prev => ({
          ...prev,
          ageGroup: getAgeGroup(age)
        }));
      }
    }
  }, [formData.age]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };
  
  const handleValueAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...formData.valueAnswers];
    newAnswers[questionIndex] = answerIndex;
    setFormData(prev => ({
      ...prev,
      valueAnswers: newAnswers
    }));
  };
  
  const handleContentAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...formData.contentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setFormData(prev => ({
      ...prev,
      contentAnswers: newAnswers
    }));
  };
  
  const handleDealBreakerToggle = (dealBreaker) => {
    const current = formData.preferences.dealBreakers || [];
    const newDealBreakers = current.includes(dealBreaker)
      ? current.filter(db => db !== dealBreaker)
      : [...current, dealBreaker];
    handlePreferenceChange('dealBreakers', newDealBreakers);
  };
  
  const handleGenderPreferenceToggle = (gender) => {
    const current = formData.preferences.genderPreference || [];
    const newPreferences = current.includes(gender)
      ? current.filter(g => g !== gender)
      : [...current, gender];
    handlePreferenceChange('genderPreference', newPreferences);
  };
  
  // Validate password strength for step 1
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, message: '' });
  
  useEffect(() => {
    if (formData.password) {
      import('@/lib/passwordSecurity').then(({ validatePasswordStrength }) => {
        const validation = validatePasswordStrength(formData.password);
        setPasswordValidation(validation);
      });
    } else {
      setPasswordValidation({ isValid: false, message: '' });
    }
  }, [formData.password]);
  
  const canProceedStep1 = formData.email && 
    formData.password && 
    formData.confirmPassword && 
    formData.name && 
    formData.age && 
    formData.gender && 
    formData.location && 
    formData.password === formData.confirmPassword && 
    passwordValidation.isValid &&
    formData.photos.length >= 1;
  const canProceedStep2 = formData.ageGroup !== '';
  const canProceedStep3 = formData.valueAnswers.length === 10;
  const canProceedStep4 = formData.contentAnswers.length === 5 && formData.ageGroup !== '';
  const canProceedStep5 = formData.preferences.lookingFor !== '';
  const canProceedStep6 = true; // Optional step - can always proceed
  
  const canGoNext = 
    (step === 1 && canProceedStep1) ||
    (step === 2 && canProceedStep2) ||
    (step === 3 && canProceedStep3) ||
    (step === 4 && canProceedStep4) ||
    (step === 5 && canProceedStep5) ||
    (step === 6 && canProceedStep6);
  
  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    // Hash password before storing
    let hashedPassword;
    try {
      const { hashPassword, validatePasswordStrength } = await import('@/lib/passwordSecurity');
      
      // Validate password strength
      const validation = validatePasswordStrength(formData.password);
      if (!validation.isValid) {
        showToast(validation.message, 'error');
        return;
      }
      
      hashedPassword = await hashPassword(formData.password);
    } catch (error) {
      console.error('Error hashing password:', error);
      showToast('Error creating account. Please try again.', 'error');
      return;
    }
    
    const user = {
      id: generateId(),
      email: formData.email,
      password: hashedPassword, // Store hashed password
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      photoUrl: formData.photoUrl || (formData.photos.length > 0 ? formData.photos[0].url : ''),
      photos: formData.photos.map(p => ({ id: p.id, url: p.url })),
      ageGroup: formData.ageGroup,
      valueAnswers: formData.valueAnswers,
      contentAnswers: formData.contentAnswers,
      preferences: formData.preferences,
      education: formData.education,
      occupation: formData.occupation,
      lifestyle: formData.lifestyle,
      socialMedia: formData.socialMedia,
      verified: formData.verified,
      createdAt: new Date().toISOString(),
      bio: '',
      subscriptionTier: 'free' // Default to free tier
    };
    
    // Save current user (without password in current user object)
    const { password: userPassword, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    
    // Add to all users list
    const allUsers = getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      allUsers[existingIndex] = user;
    } else {
      allUsers.push(user);
    }
    setAllUsers(allUsers);
    
    showToast('Profile created successfully!', 'success');
    router.push('/discover');
  };
  
  // Step 1: Basic Info - Modern Design
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
          <span className="text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Create Your Profile
          </span>
        </h2>
        <p className="text-gray-600 text-lg font-semibold">Let's start with the basics ✨</p>
      </div>
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Enter your email"
        required
        error={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Please enter a valid email' : ''}
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        placeholder="Create a strong password (min 8 chars, 1 number, 1 letter)"
        required
        error={formData.password && !passwordValidation.isValid ? passwordValidation.message : ''}
      />
      
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        placeholder="Confirm your password"
        required
        error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
      />
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-trendy">Profile Information</h3>
      </div>
      
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter your name"
        required
      />
      
      <Input
        label="Age"
        type="number"
        value={formData.age}
        onChange={(e) => handleInputChange('age', e.target.value)}
        placeholder="Enter your age"
        required
        min="18"
      />
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold transition-all"
          required
        >
          <option value="">Select gender</option>
          {GENDERS.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>
      
      <div>
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="City"
          required
        />
        <button
          type="button"
          onClick={async () => {
            try {
              const location = await getCurrentLocation();
              const locationName = getLocationName(location.latitude, location.longitude);
              handleInputChange('location', locationName);
              setFormData(prev => ({
                ...prev,
                latitude: location.latitude,
                longitude: location.longitude
              }));
              showToast('Location detected from GPS!', 'success');
            } catch (error) {
              showToast('Could not get GPS location. Please enter manually.', 'error');
            }
          }}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl hover:shadow-neon transform hover:scale-105 transition-all duration-300 font-bold text-sm"
        >
          📍 Use My Current Location
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Photos <span className="text-red-500">*</span> (Add at least 1 photo, up to 9)
        </label>
        <PhotoUpload
          photos={formData.photos}
          onPhotosChange={(photos) => handleInputChange('photos', photos)}
          maxPhotos={9}
          minPhotos={1}
        />
        {formData.photos.length > 0 && (
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setShowVerification(true)}
              variant="outline"
              size="sm"
            >
              Verify Photo
            </Button>
          </div>
        )}
      </div>
      
      <PhotoVerification
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        profilePhotos={formData.photos}
        onVerificationComplete={() => {
          setFormData(prev => ({ ...prev, verified: true }));
          setShowVerification(false);
          showToast('Photo verified successfully!', 'success');
        }}
      />
      
      <Input
        label="Profile Photo URL (Alternative - optional)"
        value={formData.photoUrl}
        onChange={(e) => handleInputChange('photoUrl', e.target.value)}
        placeholder="https://example.com/photo.jpg"
        type="url"
      />
    </div>
  );
  
  // Step 2: Age Detection - Modern Design
  const renderStep2 = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
        <span className="text-gradient">Age Group Detection</span>
      </h2>
      <p className="text-gray-600 text-lg font-semibold mb-6">
        Based on your age, we've categorized you as:
      </p>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative glass-effect rounded-3xl p-8 border-2 border-purple-300/50">
          <div className="text-6xl mb-4 floating">{formData.ageGroup === 'Gen Z' ? '🎮' : formData.ageGroup === 'Millennials' ? '☕' : '🚀'}</div>
          <h3 className="text-3xl font-black text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 font-trendy">
            {formData.ageGroup}
          </h3>
          <p className="text-gray-700 font-semibold leading-relaxed">
            This helps us show you relevant questions and match you with people who share similar cultural references and interests.
          </p>
        </div>
      </div>
      
      {formData.age && parseInt(formData.age) < 18 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6">
          <p className="text-red-700 font-bold">You must be 18 or older to use this app.</p>
        </div>
      )}
    </div>
  );
  
  // Step 3: Value Questions - Modern Design
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
          <span className="text-gradient">Your Values</span>
        </h2>
        <p className="text-gray-600 text-lg font-semibold">Answer these questions to help us find compatible matches 💝</p>
      </div>
      
      <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2">
        {VALUE_QUESTIONS.map((question, qIdx) => (
          <div key={qIdx} className="border-b border-gray-200 pb-6 last:border-b-0">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-trendy">
              {qIdx + 1}. {question.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleValueAnswer(qIdx, oIdx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 font-semibold ${
                    formData.valueAnswers[qIdx] === oIdx
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:scale-102'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="relative group mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-30"></div>
        <div className="relative glass-effect rounded-2xl p-4 border-2 border-blue-200/50">
          <p className="text-sm font-bold text-gray-900 text-center">
            Progress: <span className="text-purple-600 text-lg">{formData.valueAnswers.length} / 10</span> questions answered
          </p>
        </div>
      </div>
    </div>
  );
  
  // Step 4: Content Preferences - Modern Design
  const renderStep4 = () => {
    const contentQuestions = CONTENT_QUESTIONS[formData.ageGroup] || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
            <span className="text-gradient">Content Preferences</span>
          </h2>
          <p className="text-gray-600 text-lg font-semibold">
            Tell us about your content and media preferences ({formData.ageGroup}) 🎨
          </p>
        </div>
        
        <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2">
          {contentQuestions.map((question, qIdx) => (
            <div key={qIdx} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-trendy">
                {qIdx + 1}. {question.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleContentAnswer(qIdx, oIdx)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 font-semibold ${
                      formData.contentAnswers[qIdx] === oIdx
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:scale-102'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative group mt-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-30"></div>
          <div className="relative glass-effect rounded-2xl p-4 border-2 border-blue-200/50">
            <p className="text-sm font-bold text-gray-900 text-center">
              Progress: <span className="text-purple-600 text-lg">{formData.contentAnswers.length} / {contentQuestions.length}</span> questions answered
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Step 5: Preferences & Filters - Modern Design
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
          <span className="text-gradient">Preferences & Filters</span>
        </h2>
        <p className="text-gray-600 text-lg font-semibold">Set your preferences for matching and discovery ⚙️</p>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Looking for <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.preferences.lookingFor}
          onChange={(e) => handlePreferenceChange('lookingFor', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold transition-all"
        >
          {LOOKING_FOR.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1 font-medium">Select what you're looking for - all relationship types available</p>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Age Range: <span className="text-purple-600 font-black text-lg">{formData.preferences.ageRange[0]} - {formData.preferences.ageRange[1]}</span>
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-600 font-semibold">Min</label>
            <input
              type="range"
              min="18"
              max="50"
              value={formData.preferences.ageRange[0]}
              onChange={(e) => {
                const min = parseInt(e.target.value);
                const max = Math.max(min, formData.preferences.ageRange[1]);
                handlePreferenceChange('ageRange', [min, max]);
              }}
              className="w-full accent-purple-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 font-semibold">Max</label>
            <input
              type="range"
              min="18"
              max="50"
              value={formData.preferences.ageRange[1]}
              onChange={(e) => {
                const max = parseInt(e.target.value);
                const min = Math.min(max, formData.preferences.ageRange[0]);
                handlePreferenceChange('ageRange', [min, max]);
              }}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Distance: <span className="text-purple-600 font-black text-lg">{formData.preferences.distance} miles</span>
        </label>
        <input
          type="range"
          min="5"
          max="100"
          value={formData.preferences.distance}
          onChange={(e) => handlePreferenceChange('distance', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Gender Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {GENDER_PREFERENCES.map(gender => (
            <button
              key={gender}
              onClick={() => handleGenderPreferenceToggle(gender)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                formData.preferences.genderPreference.includes(gender)
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Deal-breakers (optional)
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {DEAL_BREAKERS.map(dealBreaker => (
            <label key={dealBreaker} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-purple-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.preferences.dealBreakers.includes(dealBreaker)}
                onChange={() => handleDealBreakerToggle(dealBreaker)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 accent-purple-500"
              />
              <span className="text-sm text-gray-700 font-semibold">{dealBreaker}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Step 6: Additional Info - Education, Occupation, Lifestyle, Social Media
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black text-gray-900 mb-3 font-trendy">
          <span className="text-gradient">Additional Info</span>
        </h2>
        <p className="text-gray-600 text-lg font-semibold">Tell us more about yourself (optional) 📝</p>
      </div>
      
      {/* Education */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Education Level
        </label>
        <select
          value={formData.education}
          onChange={(e) => handleInputChange('education', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold transition-all"
        >
          <option value="">Select education level (optional)</option>
          {EDUCATION_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      
      {/* Occupation */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Occupation
        </label>
        <select
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold transition-all"
        >
          <option value="">Select occupation (optional)</option>
          {OCCUPATION_CATEGORIES.map(occupation => (
            <option key={occupation} value={occupation}>{occupation}</option>
          ))}
        </select>
      </div>
      
      {/* Lifestyle */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Lifestyle Preferences
        </label>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 font-semibold mb-1 block">Exercise Frequency</label>
            <select
              value={formData.lifestyle.exercise}
              onChange={(e) => handleInputChange('lifestyle', { ...formData.lifestyle, exercise: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              <option value="">Select (optional)</option>
              {LIFESTYLE_OPTIONS.exercise.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 font-semibold mb-1 block">Diet</label>
            <select
              value={formData.lifestyle.diet}
              onChange={(e) => handleInputChange('lifestyle', { ...formData.lifestyle, diet: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              <option value="">Select (optional)</option>
              {LIFESTYLE_OPTIONS.diet.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 font-semibold mb-1 block">Drinking</label>
            <select
              value={formData.lifestyle.drinking}
              onChange={(e) => handleInputChange('lifestyle', { ...formData.lifestyle, drinking: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              <option value="">Select (optional)</option>
              {LIFESTYLE_OPTIONS.drinking.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 font-semibold mb-1 block">Children</label>
            <select
              value={formData.lifestyle.children}
              onChange={(e) => handleInputChange('lifestyle', { ...formData.lifestyle, children: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              <option value="">Select (optional)</option>
              {LIFESTYLE_OPTIONS.children.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Social Media */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Social Media Links (optional)
        </label>
        <SocialMediaIntegration
          socialMedia={formData.socialMedia}
          onSocialMediaChange={(socialMedia) => handleInputChange('socialMedia', socialMedia)}
        />
      </div>
      
      <div className="relative group mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-30"></div>
        <div className="relative glass-effect rounded-2xl p-4 border-2 border-green-200/50">
          <p className="text-sm font-bold text-gray-900 text-center">
            💡 All fields in this step are optional. You can skip or fill them later!
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Trendy animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>
        <div 
          className="fixed inset-0 opacity-30 -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <OnboardingStep
          step={step}
          data={formData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </OnboardingStep>
      </div>
    </>
  );
}

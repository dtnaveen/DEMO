'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getAllUsers, setAllUsers, clearCurrentUser } from '@/lib/localStorage';
import { VALUE_QUESTIONS, CONTENT_QUESTIONS, EDUCATION_LEVELS, OCCUPATION_CATEGORIES, LIFESTYLE_OPTIONS, getAgeGroup } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PhotoUpload from '@/components/ui/PhotoUpload';
import PhotoVerification from '@/components/ui/PhotoVerification';
import SocialMediaIntegration from '@/components/ui/SocialMediaIntegration';
import { showToast } from '@/utils/helpers';
import { CheckBadgeIcon, PhotoIcon, MicrophoneIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showVerification, setShowVerification] = useState(false);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/onboard');
      return;
    }
    
    // Check if user has a password
    const allUsers = getAllUsers();
    const userWithPassword = allUsers.find(u => u.id === currentUser.id);
    const userHasPassword = userWithPassword && userWithPassword.password && userWithPassword.password.length > 0;
    setHasPassword(userHasPassword);
    
    setUser(currentUser);
    setEditedData({
      email: currentUser.email || '',
      name: currentUser.name,
      location: currentUser.location,
      photoUrl: currentUser.photoUrl || '',
      photos: currentUser.photos || [],
      bio: currentUser.bio || '',
      education: currentUser.education || '',
      occupation: currentUser.occupation || '',
      lifestyle: currentUser.lifestyle || { exercise: [], diet: [], drinking: '', children: '' },
      socialMedia: currentUser.socialMedia || {}
    });
    setLoading(false);
  }, [router]);
  
  const handleSave = () => {
    // Validate email if provided
    if (editedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Check if email is being changed and if it already exists
    if (editedData.email && editedData.email !== user.email) {
      const allUsers = getAllUsers();
      const emailExists = allUsers.some(u => u.email === editedData.email && u.id !== user.id);
      if (emailExists) {
        showToast('An account with this email already exists', 'error');
        return;
      }
    }
    
    const updatedUser = {
      ...user,
      ...editedData,
      photos: editedData.photos || user.photos || [],
      education: editedData.education || user.education || '',
      occupation: editedData.occupation || user.occupation || '',
      lifestyle: editedData.lifestyle || user.lifestyle || {},
      socialMedia: editedData.socialMedia || user.socialMedia || {}
    };
    
    // Update in allUsers array as well (for login purposes)
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        email: editedData.email || allUsers[userIndex].email,
        name: editedData.name,
        location: editedData.location,
        photoUrl: editedData.photoUrl || '',
        photos: editedData.photos || allUsers[userIndex].photos || [],
        bio: editedData.bio || '',
        education: editedData.education || allUsers[userIndex].education || '',
        occupation: editedData.occupation || allUsers[userIndex].occupation || '',
        lifestyle: editedData.lifestyle || allUsers[userIndex].lifestyle || {},
        socialMedia: editedData.socialMedia || allUsers[userIndex].socialMedia || {}
      };
      setAllUsers(allUsers);
    }
    
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };
  
  const handleCancel = () => {
    setEditedData({
      email: user.email || '',
      name: user.name,
      location: user.location,
      photoUrl: user.photoUrl || '',
      photos: user.photos || [],
      bio: user.bio || '',
      education: user.education || '',
      occupation: user.occupation || '',
      lifestyle: user.lifestyle || { exercise: [], diet: [], drinking: '', children: '' },
      socialMedia: user.socialMedia || {}
    });
    setIsEditing(false);
  };
  
  const handleChangePassword = async () => {
    // Validation - only require old password if user has a password
    if (hasPassword && !passwordData.oldPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    
    // Validate password strength
    const { validatePasswordStrength } = await import('@/lib/passwordSecurity');
    const validation = validatePasswordStrength(passwordData.newPassword);
    if (!validation.isValid) {
      showToast(validation.message, 'error');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    // Get all users to verify old password (if exists) and update
    const allUsers = getAllUsers();
    const userWithPassword = allUsers.find(u => u.id === user.id);
    
    if (!userWithPassword) {
      showToast('User not found', 'error');
      return;
    }
    
    // Verify old password only if user has a password
    if (hasPassword) {
      const { verifyPassword } = await import('@/lib/passwordSecurity');
      const passwordValid = await verifyPassword(passwordData.oldPassword, userWithPassword.password);
      if (!passwordValid) {
        showToast('Current password is incorrect', 'error');
        return;
      }
    }
    
    // Hash new password
    try {
      const { hashPassword } = await import('@/lib/passwordSecurity');
      const hashedPassword = await hashPassword(passwordData.newPassword);
      
      // Update password in allUsers array
      userWithPassword.password = hashedPassword;
      const updatedUsers = allUsers.map(u => u.id === user.id ? userWithPassword : u);
      setAllUsers(updatedUsers);
      
      // Update hasPassword state
      setHasPassword(true);
      
      // Reset password form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      
      showToast(hasPassword ? 'Password changed successfully!' : 'Password set successfully!', 'success');
    } catch (error) {
      console.error('Error hashing password:', error);
      showToast('Error updating password. Please try again.', 'error');
    }
  };
  
  const handleCancelPasswordChange = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Your chats and matches will be saved.')) {
      clearCurrentUser();
      showToast('Logged out successfully', 'success');
      router.push('/');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  // Ensure ageGroup exists, calculate if missing
  const ageGroup = user.ageGroup || (user.age ? getAgeGroup(user.age) : 'Gen Z');
  const contentQuestions = CONTENT_QUESTIONS[ageGroup] || [];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <div className="flex gap-3">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
            <Button 
              onClick={handleLogout} 
              variant="danger"
              className="flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="md:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {/* Multiple Photos Display */}
                {!isEditing && user.photos && Array.isArray(user.photos) && user.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {user.photos.slice(0, 9).map((photo, idx) => (
                      <div key={photo?.id || idx} className="relative">
                        <img 
                          src={photo?.url || photo} 
                          alt={`Photo ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-primary"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {idx === 0 && user.verified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckBadgeIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : editedData.photoUrl || user.photoUrl ? (
                  <div className="relative">
                    <img 
                      src={isEditing ? editedData.photoUrl : user.photoUrl} 
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary"
                    />
                    {user.verified && (
                      <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
                        <CheckBadgeIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-primary">
                      {user.name.charAt(0)}
                    </div>
                    {user.verified && (
                      <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
                        <CheckBadgeIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Verification Badge */}
                {user.verified && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                    <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Verified</span>
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    placeholder="Enter your email"
                    error={editedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.email) ? 'Please enter a valid email' : ''}
                  />
                  <Input
                    label="Name"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  />
                  <Input
                    label="Location"
                    value={editedData.location}
                    onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (up to 9)
                    </label>
                    <PhotoUpload
                      photos={editedData.photos || []}
                      onPhotosChange={(photos) => setEditedData({ ...editedData, photos })}
                      maxPhotos={9}
                      minPhotos={0}
                    />
                    {editedData.photos && editedData.photos.length > 0 && (
                      <Button
                        onClick={() => setShowVerification(true)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Verify Photos
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    label="Photo URL (Alternative)"
                    value={editedData.photoUrl}
                    onChange={(e) => setEditedData({ ...editedData, photoUrl: e.target.value })}
                    type="url"
                  />
                  
                  <PhotoVerification
                    isOpen={showVerification}
                    onClose={() => setShowVerification(false)}
                    profilePhotos={editedData.photos || []}
                    onVerificationComplete={() => {
                      const updatedUser = { ...user, verified: true };
                      setUser(updatedUser);
                      setCurrentUser(updatedUser);
                      setShowVerification(false);
                      showToast('Photos verified successfully!', 'success');
                    }}
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">Save</Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'User'}</h2>
                  {user.email && (
                    <p className="text-gray-600 mb-1 text-sm">{user.email}</p>
                  )}
                  {user.age && (
                    <p className="text-gray-600 mb-2">{user.age} years old</p>
                  )}
                  {user.location && (
                    <p className="text-gray-600 mb-4">{user.location}</p>
                  )}
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {ageGroup}
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Details */}
          <Card className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
            
            {/* Contact Information */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <select
                    value={editedData.education || ''}
                    onChange={(e) => setEditedData({ ...editedData, education: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select education level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <select
                    value={editedData.occupation || ''}
                    onChange={(e) => setEditedData({ ...editedData, occupation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select occupation</option>
                    {OCCUPATION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle</label>
                  <div className="space-y-4">
                    {/* Exercise */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Exercise Frequency</label>
                      <div className="space-y-2">
                        {LIFESTYLE_OPTIONS.exercise.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(editedData.lifestyle?.exercise || []).includes(option)}
                              onChange={(e) => {
                                const current = editedData.lifestyle?.exercise || [];
                                const newExercise = e.target.checked 
                                  ? [...current, option]
                                  : current.filter(l => l !== option);
                                setEditedData({ 
                                  ...editedData, 
                                  lifestyle: {
                                    ...editedData.lifestyle,
                                    exercise: newExercise
                                  }
                                });
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-gray-700 text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Diet */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Diet</label>
                      <div className="space-y-2">
                        {LIFESTYLE_OPTIONS.diet.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(editedData.lifestyle?.diet || []).includes(option)}
                              onChange={(e) => {
                                const current = editedData.lifestyle?.diet || [];
                                const newDiet = e.target.checked 
                                  ? [...current, option]
                                  : current.filter(l => l !== option);
                                setEditedData({ 
                                  ...editedData, 
                                  lifestyle: {
                                    ...editedData.lifestyle,
                                    diet: newDiet
                                  }
                                });
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-gray-700 text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Drinking */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Drinking</label>
                      <div className="space-y-2">
                        {LIFESTYLE_OPTIONS.drinking.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="drinking"
                              checked={(editedData.lifestyle?.drinking || '') === option}
                              onChange={() => {
                                setEditedData({ 
                                  ...editedData, 
                                  lifestyle: {
                                    ...editedData.lifestyle,
                                    drinking: option
                                  }
                                });
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="text-gray-700 text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Children */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Children</label>
                      <div className="space-y-2">
                        {LIFESTYLE_OPTIONS.children.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="children"
                              checked={(editedData.lifestyle?.children || '') === option}
                              onChange={() => {
                                setEditedData({ 
                                  ...editedData, 
                                  lifestyle: {
                                    ...editedData.lifestyle,
                                    children: option
                                  }
                                });
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="text-gray-700 text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                  <SocialMediaIntegration
                    socialMedia={editedData.socialMedia || {}}
                    onSocialMediaChange={(socialMedia) => setEditedData({ ...editedData, socialMedia })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-6">
                  {user.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                </p>
              </div>
            )}
            
            {/* Value Answers */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Values</h3>
              <div className="space-y-4">
                {VALUE_QUESTIONS.map((question, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                    {user.valueAnswers && user.valueAnswers[idx] !== undefined ? (
                      <p className="text-gray-600">{question.options[user.valueAnswers[idx]]}</p>
                    ) : (
                      <p className="text-gray-400 italic">Not answered</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content Preferences */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Preferences</h3>
              <div className="space-y-4">
                {contentQuestions.map((question, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                    {user.contentAnswers && user.contentAnswers[idx] !== undefined ? (
                      <p className="text-gray-600">{question.options[user.contentAnswers[idx]]}</p>
                    ) : (
                      <p className="text-gray-400 italic">Not answered</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Education, Occupation, Lifestyle */}
            {(user.education || user.occupation || (user.lifestyle && (user.lifestyle.exercise?.length > 0 || user.lifestyle.diet?.length > 0 || user.lifestyle.drinking || user.lifestyle.children))) && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.education && (
                    <div>
                      <p className="text-sm text-gray-600">Education</p>
                      <p className="font-medium text-gray-900">{user.education}</p>
                    </div>
                  )}
                  {user.occupation && (
                    <div>
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-medium text-gray-900">{user.occupation}</p>
                    </div>
                  )}
                  {user.lifestyle && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Lifestyle</p>
                      <div className="space-y-2">
                        {user.lifestyle.exercise && user.lifestyle.exercise.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500">Exercise: </span>
                            <span className="text-gray-900">{user.lifestyle.exercise.join(', ')}</span>
                          </div>
                        )}
                        {user.lifestyle.diet && user.lifestyle.diet.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500">Diet: </span>
                            <span className="text-gray-900">{user.lifestyle.diet.join(', ')}</span>
                          </div>
                        )}
                        {user.lifestyle.drinking && (
                          <div>
                            <span className="text-xs text-gray-500">Drinking: </span>
                            <span className="text-gray-900">{user.lifestyle.drinking}</span>
                          </div>
                        )}
                        {user.lifestyle.children && (
                          <div>
                            <span className="text-xs text-gray-500">Children: </span>
                            <span className="text-gray-900">{user.lifestyle.children}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {user.socialMedia && Object.keys(user.socialMedia).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h3>
                <div className="flex flex-wrap gap-4">
                  {user.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${user.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
                    >
                      <PhotoIcon className="w-5 h-5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {user.socialMedia.spotify && (
                    <a
                      href={user.socialMedia.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                      <span>Spotify</span>
                    </a>
                  )}
                  {user.socialMedia.custom && user.socialMedia.custom.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {link.label || link.url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Looking for</p>
                  <p className="font-medium text-gray-900">{user.preferences?.lookingFor || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age range</p>
                  <p className="font-medium text-gray-900">
                    {user.preferences?.ageRange?.[0] || 18} - {user.preferences?.ageRange?.[1] || 50}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium text-gray-900">
                    {user.preferences?.distance || 25} miles
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender preference</p>
                  <p className="font-medium text-gray-900">
                    {user.preferences?.genderPreference?.join(', ') || 'Everyone'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Security Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Security</h3>
                {!isChangingPassword && (
                  <Button 
                    onClick={() => setIsChangingPassword(true)} 
                    variant="outline"
                    size="sm"
                  >
                    {hasPassword ? 'Change Password' : 'Set Password'}
                  </Button>
                )}
              </div>
              
              {/* Logout Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Account</p>
                    <p className="text-sm text-gray-600">Log out of your account</p>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="danger"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
              
              {/* Change Password Section */}
              <div>
              
              {isChangingPassword ? (
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  {hasPassword && (
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      placeholder="Enter your current password"
                    />
                  )}
                  
                  {!hasPassword && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                      <p className="text-sm text-blue-700">
                        You don't have a password set yet. Create one now to secure your account.
                      </p>
                    </div>
                  )}
                  
                  <Input
                    label={hasPassword ? "New Password" : "Password"}
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder={`Enter ${hasPassword ? 'new' : ''} password (min 6 characters)`}
                    required
                    error={passwordData.newPassword && passwordData.newPassword.length < 6 ? 'Password must be at least 6 characters' : ''}
                  />
                  
                  <Input
                    label={hasPassword ? "Confirm New Password" : "Confirm Password"}
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder={`Confirm ${hasPassword ? 'new' : ''} password`}
                    required
                    error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'Passwords do not match' : ''}
                  />
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleChangePassword}
                      disabled={
                        (hasPassword && !passwordData.oldPassword) ||
                        !passwordData.newPassword || 
                        !passwordData.confirmPassword || 
                        passwordData.newPassword.length < 6 || 
                        passwordData.newPassword !== passwordData.confirmPassword
                      }
                      className="flex-1"
                    >
                      {hasPassword ? 'Update Password' : 'Set Password'}
                    </Button>
                    <Button 
                      onClick={handleCancelPasswordChange}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  {hasPassword 
                    ? 'Click "Change Password" to update your password.'
                    : 'You don\'t have a password set. Click "Set Password" to create one.'
                  }
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

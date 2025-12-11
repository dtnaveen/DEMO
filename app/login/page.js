'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { getAllUsers, setCurrentUser, getCurrentUser, setAllUsers } from '@/lib/localStorage';
import { showToast, devLog } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { initializeMockData } from '@/lib/mockData';
import { setupRanjithUser } from '@/lib/userSetup';
import { createMatchingProfiles } from '@/lib/createMatchingProfiles';
import { setupTestUsers } from '@/lib/testUsers';
import { setupAllTestUsers } from '@/lib/testAllUsers';
import { verifyPassword, hashPassword, loginRateLimiter } from '@/lib/passwordSecurity';

// Login page component

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [initialized, setInitialized] = useState(false);
  
  // Check server availability
  useEffect(() => {
    const checkServer = async () => {
      try {
        // Try to fetch a simple request to check if server is running
        const response = await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        setServerStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        // Server not available - but we can still work offline with localStorage
        setServerStatus('offline');
        devLog('Server check failed, using offline mode:', error);
      }
    };

    checkServer();
  }, []);

  // Initialize data - works offline with localStorage
  useEffect(() => {
    if (initialized) return;
    
    const initializeData = async () => {
      try {
        let existingUsers = getAllUsers();
        
        // Always ensure Ranjith user exists
        if (!existingUsers || existingUsers.length === 0) {
          devLog('No users found, initializing mock data...');
          initializeMockData();
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Ensure Ranjith user exists
        setupRanjithUser();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create matching profiles if they don't exist
        existingUsers = getAllUsers();
        const sarahExists = existingUsers.some(u => 
          u.name?.toLowerCase().includes('sarah') && u.name?.toLowerCase().includes('martinez')
        );
        
        if (!sarahExists) {
          createMatchingProfiles(3);
        }
        
        // Setup test users (free and premium)
        setupTestUsers();
        // Setup all test users (admin, free, premium, basic, plus, regular)
        setupAllTestUsers();
        
        setInitialized(true);
      } catch (error) {
        console.error('Error ensuring mock data on login page:', error);
        // Continue anyway - we can still work with existing data
        setInitialized(true);
      }
    };

    initializeData();

    // If already logged in, go to discover
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.push('/discover');
    }
  }, [router, initialized]);
  
  const performLogin = async (overrideIdentifier = null, overridePassword = null) => {
    const currentIdentifier = overrideIdentifier || identifier;
    const currentPassword = overridePassword || password;
    
    console.log('🔐 performLogin called', { 
      identifier: currentIdentifier, 
      passwordLength: currentPassword?.length,
      usingOverride: !!(overrideIdentifier || overridePassword)
    });
    
    if (!currentIdentifier || !currentIdentifier.trim() || !currentPassword || !currentPassword.trim()) {
      console.log('❌ Validation failed - empty fields');
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setLoading(true);
    console.log('⏳ Loading state set to true');
    
    try {
      // Get all users from localStorage (works offline)
      let allUsers = getAllUsers() || [];
      console.log('👥 Found users:', allUsers.length);
      
      // If no users, try to initialize immediately (synchronous)
      if (allUsers.length === 0) {
        devLog('No users found, initializing...');
        try {
          initializeMockData();
          setupRanjithUser();
          setupTestUsers();
          setupAllTestUsers();
          allUsers = getAllUsers() || [];
          console.log('✅ Initialized users, now have:', allUsers.length);
        } catch (error) {
          console.error('Error initializing users:', error);
          showToast('Error initializing user data. Please refresh the page.', 'error');
          setLoading(false);
          return;
        }
      }
      
      // Ensure all test users exist
      if (allUsers.length > 0) {
        try {
          setupAllTestUsers(); // Update/create all test users
          allUsers = getAllUsers() || [];
          console.log('✅ Test users ensured, now have:', allUsers.length);
        } catch (error) {
          console.error('Error setting up test users:', error);
          // Continue with existing users
        }
      }
      
      const trimmed = currentIdentifier.trim().toLowerCase();
      console.log('🔍 Searching for user with identifier:', trimmed);
      
      // Check rate limiting
      const rateLimit = loginRateLimiter.isRateLimited(trimmed);
      if (rateLimit.isLimited) {
        const minutesLeft = Math.ceil(rateLimit.remainingTime / 60000);
        console.log('🚫 Rate limited');
        showToast(`Too many failed login attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`, 'error');
        setLoading(false);
        return;
      }
      
      // Allow login by email OR exact name (case-insensitive)
      const user = allUsers.find((u) => {
        const emailLower = (u.email || '').toLowerCase();
        const nameLower = (u.name || '').toLowerCase();
        const matches = emailLower === trimmed || nameLower === trimmed;
        if (matches) {
          console.log('✅ Found user:', { email: u.email, name: u.name, hasPassword: !!u.password });
        }
        return matches;
      });
      
      if (!user) {
        console.log('❌ User not found');
        loginRateLimiter.recordFailedAttempt(trimmed);
        showToast(`No account found with "${currentIdentifier}". Please check your email or name.`, 'error');
        setLoading(false);
        return;
      }
      
      // Check if user has a password set
      if (!user.password) {
        console.log('❌ User has no password');
        showToast('This account has no password set. Please create a new account or set a password in your profile.', 'error');
        setLoading(false);
        return;
      }
      
      // Verify password using secure hashing
      const passwordValid = await verifyPassword(currentPassword, user.password);
      if (!passwordValid) {
        console.log('❌ Password mismatch');
        loginRateLimiter.recordFailedAttempt(trimmed);
        const attemptsLeft = loginRateLimiter.isRateLimited(trimmed).attemptsLeft;
        if (attemptsLeft > 0) {
          showToast(`Incorrect password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`, 'error');
        } else {
          const minutesLeft = Math.ceil(loginRateLimiter.isRateLimited(trimmed).remainingTime / 60000);
          showToast(`Too many failed attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`, 'error');
        }
        setLoading(false);
        return;
      }
      
      // Migrate plain text password to hashed format (backward compatibility)
      if (!user.password.includes(':')) {
        console.log('🔄 Migrating password to secure hash format');
        try {
          const hashedPassword = await hashPassword(currentPassword);
          user.password = hashedPassword;
          // Update in allUsers array
          const updatedUsers = allUsers.map(u => u.id === user.id ? user : u);
          setAllUsers(updatedUsers);
          console.log('✅ Password migrated to secure format');
        } catch (error) {
          console.error('Error migrating password:', error);
          // Continue with login even if migration fails
        }
      }
      
      // Clear rate limiting on successful login
      loginRateLimiter.clearAttempts(trimmed);
      
      // Remove password from user object before setting as current user
      const { password: _, ...userWithoutPassword } = user;
      console.log('✅ Password correct, setting current user:', userWithoutPassword.email);
      
      // Save to localStorage (works offline)
      try {
        setCurrentUser(userWithoutPassword);
        console.log('💾 User saved to localStorage');
        showToast('Logged in successfully!', 'success');
        
        // Small delay to ensure toast is shown, then redirect
        setTimeout(() => {
          // Check if admin user
          const isAdmin = userWithoutPassword.role === 'admin' || userWithoutPassword.email === 'admin@vibematch.com';
          const redirectPath = isAdmin ? '/admin' : '/discover';
          console.log('🚀 Redirecting to:', redirectPath, { isAdmin });
          router.push(redirectPath);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('❌ Error saving user:', error);
        showToast('Error saving login. Please try again.', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      showToast('An error occurred during login. Please try again.', 'error');
      setLoading(false);
    }
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📝 Form submitted via handleLogin');
    performLogin();
  };
  
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖱️ Button clicked via handleButtonClick', { 
      identifier, 
      identifierLength: identifier?.length,
      passwordLength: password?.length
    });
    
    // Get current values directly from form inputs as fallback
    let emailValue = identifier;
    let passwordValue = password;
    
    try {
      const form = e?.target?.closest?.('form');
      if (form) {
        const emailInput = form.querySelector('input[type="text"]');
        const passwordInput = form.querySelector('input[type="password"]');
        if (emailInput && emailInput.value) {
          emailValue = emailInput.value;
        }
        if (passwordInput && passwordInput.value) {
          passwordValue = passwordInput.value;
        }
      }
    } catch (error) {
      console.warn('Could not read form values from DOM:', error);
      // Continue with state values
    }
    
    console.log('📋 Form values:', { emailValue, passwordValue, emailLength: emailValue?.length, passwordLength: passwordValue?.length });
    
    if (!emailValue || !emailValue.trim() || !passwordValue || !passwordValue.trim()) {
      console.log('❌ Validation failed in handleButtonClick');
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Update state if values from DOM are different
    if (emailValue !== identifier) {
      setIdentifier(emailValue);
    }
    if (passwordValue !== password) {
      setPassword(passwordValue);
    }
    
    // Use the values we have (from state or DOM)
    const currentIdentifier = emailValue;
    const currentPassword = passwordValue;
    
    // Call performLogin with current values
    if (currentIdentifier && currentPassword) {
      // Temporarily update state if needed, then call performLogin
      if (currentIdentifier !== identifier || currentPassword !== password) {
        setIdentifier(currentIdentifier);
        setPassword(currentPassword);
        // Wait a moment for state to update
        setTimeout(() => {
          performLogin(currentIdentifier, currentPassword);
        }, 50);
      } else {
        performLogin(currentIdentifier, currentPassword);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <Card variant="glass" className="max-w-md w-full relative z-10 border-2 border-white/30">
        <div className="text-center mb-8">
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Logo clicked, redirecting to home...');
              router.push('/');
            }} 
            className="flex justify-center mb-8 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ pointerEvents: 'auto' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/');
              }
            }}
          >
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-black text-dark-900 mb-3 font-display">Welcome Back</h1>
          <p className="text-dark-600 text-lg font-medium">Sign in to your account</p>
          
          {/* Server status indicator */}
          {serverStatus === 'offline' && (
            <div className="mt-4 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
              ⚠️ Offline mode: Using local data. Server connection unavailable.
            </div>
          )}
        </div>
        
        <form 
          onSubmit={(e) => {
            console.log('📝 Form onSubmit triggered');
            handleLogin(e);
          }} 
          className="space-y-6" 
          noValidate
        >
          <Input
            label="Email or Name"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or name"
            required
            autoComplete="email"
            disabled={loading}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            onClick={handleButtonClick}
            disabled={loading}
            className="mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/onboard" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-left space-y-2">
          <p className="font-semibold mb-2">Test Accounts Available:</p>
          <div className="space-y-1">
            <p className="text-gray-600">
              Test account credentials are available in <code className="bg-gray-100 px-1 rounded">TEST_USERS_CREDENTIALS.md</code> (local file, not in git).
            </p>
            <p className="font-medium text-gray-700 mt-2">Available Test Accounts:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>Admin: admin@vibematch.com</li>
              <li>Free: free@test.com</li>
              <li>Basic: basic@test.com</li>
              <li>Plus: plus@test.com</li>
              <li>Premium (VIP): premium@test.com</li>
              <li>Regular: ranjith@example.com or "ranjith"</li>
            </ul>
            <p className="text-gray-500 italic mt-2">
              ⚠️ For security, passwords are not displayed here. See TEST_USERS_CREDENTIALS.md for credentials.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

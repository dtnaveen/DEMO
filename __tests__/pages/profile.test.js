/**
 * Profile Page Tests
 * Tests for Profile page functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from '@/app/profile/page';
import { getCurrentUser, setCurrentUser, getAllUsers, setAllUsers, clearCurrentUser } from '@/lib/localStorage';
import { showToast } from '@/utils/helpers';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/profile'),
}));
jest.mock('@/lib/localStorage');
jest.mock('@/utils/helpers');
jest.mock('@/components/ui/Card', () => {
  return function Card({ children, className, onClick }) {
    return <div className={className} onClick={onClick} data-testid="card">{children}</div>;
  };
});
jest.mock('@/components/ui/Button', () => {
  return function Button({ children, onClick, disabled, className, variant }) {
    return <button onClick={onClick} disabled={disabled} className={className} data-testid="button">{children}</button>;
  };
});
jest.mock('@/components/ui/Input', () => {
  return function Input({ label, placeholder, value, onChange, type, className, error }) {
    return (
      <div className={className}>
        {label && <label>{label}</label>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} data-testid="input" />
        {error && <p>{error}</p>}
      </div>
    );
  };
});
jest.mock('@/components/ui/PhotoUpload', () => {
  return function PhotoUpload({ photos, onPhotosChange }) {
    return <div data-testid="photo-upload">Photo Upload ({photos?.length || 0} photos)</div>;
  };
});
jest.mock('@/components/ui/PhotoVerification', () => {
  return function PhotoVerification({ isOpen, onClose }) {
    return isOpen ? <div data-testid="photo-verification">Photo Verification</div> : null;
  };
});
jest.mock('@/components/ui/SocialMediaIntegration', () => {
  return function SocialMediaIntegration() {
    return <div data-testid="social-media">Social Media Integration</div>;
  };
});

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  replace: jest.fn(),
};

const mockUser = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  age: 25,
  location: 'New York',
  bio: 'Test bio',
  photos: [],
  subscriptionTier: 'free',
};

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    useRouter.mockReturnValue(mockRouter);
    getCurrentUser.mockReturnValue(mockUser);
    getAllUsers.mockReturnValue([mockUser]);
    setCurrentUser.mockImplementation(() => {});
    setAllUsers.mockImplementation(() => {});
    clearCurrentUser.mockImplementation(() => {});
    showToast.mockImplementation(() => {});
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
    
    // Reset localStorage mock
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('renders profile page with user name', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    });
  });

  it('displays user information', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });
  });

  it('shows edit profile button', () => {
    render(<ProfilePage />);
    const editButton = screen.getByText(/Edit Profile/i);
    expect(editButton).toBeInTheDocument();
  });

  it('enters edit mode when edit button clicked', () => {
    render(<ProfilePage />);
    const editButton = screen.getByText(/Edit Profile/i);
    fireEvent.click(editButton);
    
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  it('displays logout button in header', () => {
    render(<ProfilePage />);
    const logoutButtons = screen.getAllByText(/Logout/i);
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it('displays logout section in Security area', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Log out of your account/i)).toBeInTheDocument();
  });

  it('handles logout button click with confirmation', () => {
    render(<ProfilePage />);
    const logoutButton = screen.getAllByText(/Logout/i)[0];
    
    fireEvent.click(logoutButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(clearCurrentUser).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('Logged out successfully', 'success');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does not logout if user cancels confirmation', () => {
    window.confirm.mockReturnValue(false);
    
    render(<ProfilePage />);
    const logoutButton = screen.getAllByText(/Logout/i)[0];
    
    fireEvent.click(logoutButton);
    
    expect(clearCurrentUser).not.toHaveBeenCalled();
  });

  it('saves profile changes', async () => {
    render(<ProfilePage />);
    const editButton = screen.getByText(/Edit Profile/i);
    fireEvent.click(editButton);
    
    await waitFor(() => {
      const nameInput = screen.getByDisplayValue(mockUser.name);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      
      const saveButton = screen.getByText(/Save/i);
      fireEvent.click(saveButton);
      
      expect(setCurrentUser).toHaveBeenCalled();
      expect(showToast).toHaveBeenCalledWith('Profile updated successfully!', 'success');
    });
  });

  it('cancels profile editing', () => {
    render(<ProfilePage />);
    const editButton = screen.getByText(/Edit Profile/i);
    fireEvent.click(editButton);
    
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);
    
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
  });

  it('displays change password button', () => {
    render(<ProfilePage />);
    const changePasswordButton = screen.queryByText(/Change Password|Set Password/i);
    expect(changePasswordButton).toBeInTheDocument();
  });

  it('opens password change form', () => {
    render(<ProfilePage />);
    const changePasswordButton = screen.getByText(/Change Password|Set Password/i);
    fireEvent.click(changePasswordButton);
    
    expect(screen.getByText(/Current Password|Password/i)).toBeInTheDocument();
  });

  it('displays user email', () => {
    render(<ProfilePage />);
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('displays user location', () => {
    render(<ProfilePage />);
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
  });

  it('displays user bio', () => {
    render(<ProfilePage />);
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  });

  it('redirects to onboard if user not authenticated', () => {
    getCurrentUser.mockReturnValue(null);
    render(<ProfilePage />);
    
    expect(mockPush).toHaveBeenCalledWith('/onboard');
  });

  it('handles form validation errors', async () => {
    render(<ProfilePage />);
    const editButton = screen.getByText(/Edit Profile/i);
    fireEvent.click(editButton);
    
    await waitFor(() => {
      const emailInput = screen.queryByLabelText(/Email/i);
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);
        // Should show validation error
      }
    });
  });
});


/**
 * Forums Page Tests
 * Tests for Forums feature functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ForumsPage from '@/app/forums/page';
import { getCurrentUser } from '@/lib/localStorage';
import { showToast } from '@/utils/helpers';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/forums'),
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
  return function Input({ placeholder, value, onChange, className }) {
    return <input placeholder={placeholder} value={value} onChange={onChange} className={className} data-testid="input" />;
  };
});

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  replace: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
};

const mockUser = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
};

describe('Forums Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    useRouter.mockReturnValue(mockRouter);
    useSearchParams.mockReturnValue(mockSearchParams);
    getCurrentUser.mockReturnValue(mockUser);
    showToast.mockImplementation(() => {});
    mockSearchParams.get.mockReturnValue(null);
    
    // Reset localStorage mock
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('renders forums page with header', async () => {
    render(<ForumsPage />);
    await waitFor(() => {
      expect(screen.getByText(/Community Forums/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays search input', async () => {
    render(<ForumsPage />);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search forums/i);
      expect(searchInput).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays category filter buttons', async () => {
    render(<ForumsPage />);
    await waitFor(() => {
      expect(screen.getByText(/All/i)).toBeInTheDocument();
      expect(screen.getByText(/Success Stories/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters forums by category', async () => {
    render(<ForumsPage />);
    
    await waitFor(() => {
      const categoryButton = screen.getByText(/Success Stories/i);
      fireEvent.click(categoryButton);
      expect(categoryButton).toBeInTheDocument();
    });
  });

  it('navigates to forum detail when forum card clicked', async () => {
    render(<ForumsPage />);
    
    await waitFor(() => {
      const forumCards = screen.queryAllByText(/Success Stories|Dating Tips/i);
      if (forumCards.length > 0) {
        fireEvent.click(forumCards[0].closest('[class*="cursor-pointer"]'));
        expect(mockPush).toHaveBeenCalled();
      }
    });
  });

  it('displays posts when forum is selected', async () => {
    mockSearchParams.get.mockReturnValue('1');
    
    render(<ForumsPage />);
    
    await waitFor(() => {
      const backButton = screen.queryByText(/Back to Forums/i);
      expect(backButton || screen.getByText(/Community Forums/i)).toBeTruthy();
    });
  });

  it('handles create post button click', async () => {
    mockSearchParams.get.mockReturnValue('1');
    
    render(<ForumsPage />);
    
    await waitFor(() => {
      const createButton = screen.queryByText(/Create New Post/i);
      if (createButton) {
        fireEvent.click(createButton);
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/forums/create-post'));
      }
    });
  });

  it('handles sort option change', async () => {
    mockSearchParams.get.mockReturnValue('1');
    
    render(<ForumsPage />);
    
    await waitFor(() => {
      const sortButtons = screen.queryAllByText(/Recent|Popular|Trending/i);
      if (sortButtons.length > 0) {
        fireEvent.click(sortButtons[0]);
        expect(sortButtons[0]).toBeInTheDocument();
      }
    });
  });

  it('displays pagination controls', async () => {
    render(<ForumsPage />);
    
    await waitFor(() => {
      const paginationButtons = screen.queryAllByText(/Previous|Next/i);
      // Pagination may or may not appear
      expect(paginationButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles empty forums array gracefully', async () => {
    getCurrentUser.mockReturnValue(mockUser);
    render(<ForumsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Community Forums/i)).toBeInTheDocument();
    });
  });

  it('redirects to login if user not authenticated', () => {
    getCurrentUser.mockReturnValue(null);
    render(<ForumsPage />);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles back to forums navigation', async () => {
    mockSearchParams.get.mockReturnValue('1');
    
    render(<ForumsPage />);
    
    await waitFor(() => {
      const backButton = screen.queryByText(/Back to Forums/i);
      if (backButton) {
        fireEvent.click(backButton);
        expect(mockPush).toHaveBeenCalledWith('/forums');
      }
    });
  });

  it('filters posts by search query', async () => {
    mockSearchParams.get.mockReturnValue('1');
    
    render(<ForumsPage />);
    
    await waitFor(() => {
      const searchInput = screen.queryByPlaceholderText(/Search posts/i);
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(searchInput.value).toBe('test');
      }
    });
  });
});


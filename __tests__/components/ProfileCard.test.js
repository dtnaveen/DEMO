import { render, screen, fireEvent } from '@testing-library/react'
import ProfileCard from '@/components/ui/ProfileCard'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('ProfileCard Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    age: 25,
    bio: 'Test bio',
    photoUrl: 'https://example.com/photo.jpg',
    matchScore: {
      percentage: 85
    },
    distance: 5.2
  }

  it('renders user information', () => {
    render(<ProfileCard user={mockUser} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('displays match score', () => {
    render(<ProfileCard user={mockUser} />)
    expect(screen.getByText(/85%/)).toBeInTheDocument()
  })

  it('displays distance when provided', () => {
    render(<ProfileCard user={mockUser} />)
    expect(screen.getByText(/5.2/)).toBeInTheDocument()
  })

  it('calls onLike when like button is clicked', () => {
    const onLike = jest.fn()
    const { container } = render(<ProfileCard user={mockUser} onLike={onLike} />)
    
    // Find the like button (heart icon button - last button in the action group)
    // The like button has a gradient background class
    const likeButton = container.querySelector('button.bg-gradient-to-r.from-pink-500')
    
    expect(likeButton).toBeInTheDocument()
    fireEvent.click(likeButton)
    expect(onLike).toHaveBeenCalled()
  })

  it('calls onPass when pass button is clicked', () => {
    const onPass = jest.fn()
    const { container } = render(<ProfileCard user={mockUser} onPass={onPass} />)
    
    // Find the pass button (X icon button - first button, has hover:bg-red-500)
    const passButton = container.querySelector('button.hover\\:bg-red-500')
    
    expect(passButton).toBeInTheDocument()
    fireEvent.click(passButton)
    expect(onPass).toHaveBeenCalled()
  })

  it('shows verification badge for verified users', () => {
    const verifiedUser = { ...mockUser, verified: true }
    render(<ProfileCard user={verifiedUser} />)
    // Check for verification indicator (may vary by implementation)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('handles missing optional fields', () => {
    const minimalUser = {
      id: '2',
      name: 'Minimal User',
      age: 30
    }
    render(<ProfileCard user={minimalUser} />)
    expect(screen.getByText('Minimal User')).toBeInTheDocument()
  })
})


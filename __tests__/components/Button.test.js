import { render, screen, fireEvent } from '@testing-library/react'
// eslint-disable-next-line no-unused-vars
import Button from '@/components/ui/Button'

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByText('Disabled Button')).toBeDisabled()
  })

  it('applies correct variant classes', () => {
    const { container } = render(<Button variant="secondary">Button</Button>)
    // Check for gradient classes that are actually used
    expect(container.firstChild.className).toMatch(/from-blue-500|via-purple-500|to-pink-500/)
  })

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(<Button fullWidth>Button</Button>)
    expect(container.firstChild).toHaveClass('w-full')
  })
})


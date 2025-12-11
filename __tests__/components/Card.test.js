import { render, screen } from '@testing-library/react'
import Card from '@/components/ui/Card'

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Test Content</Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass('bg-white')
  })

  it('applies glass effect variant', () => {
    const { container } = render(<Card variant="glass">Content</Card>)
    expect(container.firstChild).toHaveClass('glass-effect')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>)
    expect(container.firstChild).toHaveClass('p-6')
  })
})


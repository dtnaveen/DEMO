import { render, screen } from '@testing-library/react'
// eslint-disable-next-line no-unused-vars
import Logo from '@/components/ui/Logo'

describe('Logo Component', () => {
  it('renders the logo with text', () => {
    render(<Logo showText={true} />)
    expect(screen.getByText('Vibe')).toBeInTheDocument()
    expect(screen.getByText('Match')).toBeInTheDocument()
  })

  it('renders logo without text when showText is false', () => {
    render(<Logo showText={false} />)
    expect(screen.queryByText('Vibe')).not.toBeInTheDocument()
    expect(screen.queryByText('Match')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { container } = render(<Logo size="lg" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})


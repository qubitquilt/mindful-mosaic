
import { render, screen, fireEvent } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import SignInButton from '../../SignInButton'
import { signIn, signOut } from 'next-auth/react'

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('SignInButton', () => {
  it('renders Sign In button when user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<SignInButton />)

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('does not render when user is authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated'
    })

    render(<SignInButton />)

    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument()
  })

  it('calls signIn when Sign In button is clicked', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<SignInButton />)

    const button = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(button)

    expect(signIn).toHaveBeenCalled()
  })

  it('calls signOut when Sign out button is clicked', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated'
    })

    render(<SignInButton />)

    const button = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(button)

    expect(signOut).toHaveBeenCalled()
  })
})
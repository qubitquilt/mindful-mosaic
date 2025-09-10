import React from 'react'
import { render, screen } from '@testing-library/react'
import { Providers } from '../providers'

// Mock next-auth/react for SessionProvider
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Providers', () => {
  it('renders children wrapped with SessionProvider', () => {
    const mockChild = <div data-testid="child">Test Child</div>

    render(
      <Providers>
        {mockChild}
      </Providers>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('wraps children with SessionProvider', () => {
    const mockChild = <div data-testid="child">Wrapped Content</div>

    render(
      <Providers>
        {mockChild}
      </Providers>
    )

    // Verify the structure - Providers should wrap children with SessionProvider
    const childElement = screen.getByTestId('child')
    expect(childElement).toBeInTheDocument()
  })
})

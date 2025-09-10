import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import type { Metadata } from 'next'

// Mock next-auth/react for Providers and useSession in RootLayout
  jest.mock('next-auth/react', () => ({
    SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSession: jest.fn(),
  }))

// Mock next/font/google at top level before imports
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({
    className: 'mock-inter-class',
    style: { fontFamily: 'Inter' }
  }))
}))

import RootLayout, { metadata } from '../layout'

describe('RootLayout', () => {
  it('exports correct metadata', () => {
    expect(metadata as Metadata).toEqual({
      title: 'Mindful Mosaic',
      description: 'A privacy-first, open-source organizational platform.',
    })
  })

  it('applies bg-gray-100 class to body', () => {
    const mockChildren = <div data-testid="main-content">Main Content</div>

    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { container } = render(
      <RootLayout>{mockChildren}</RootLayout>
    )

    consoleErrorSpy.mockRestore()

    const body = container.querySelector('body')
    expect(body).toHaveClass('bg-gray-100', 'mock-inter-class')
  })

  it('wraps content with Providers and renders Header', () => {
    const mockChildren = <div data-testid="main-content">Main Content</div>

    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <RootLayout>{mockChildren}</RootLayout>
    )

    consoleErrorSpy.mockRestore()

    // Check for Header rendering (Mindful Mosaic title)
    expect(screen.getByText('Mindful Mosaic')).toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })

  it('renders main container with Tailwind classes', () => {
    const mockChildren = <div data-testid="main-content">Main Content</div>

    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { container } = render(
      <RootLayout>{mockChildren}</RootLayout>
    )

    consoleErrorSpy.mockRestore()

    const main = screen.getByTestId('main-content').closest('main')
    expect(main).toHaveClass('container', 'mx-auto', 'p-4')
  })
})
import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  render,
  screen,
} from '@testing-library/react'
import { TerminalHeader } from './TerminalHeader'

describe('TerminalHeader', () => {
  it('renders the supplied terminal title', () => {
    render(
      <TerminalHeader title="JayShell v0.17.0" />,
    )

    expect(
      screen.getByText('JayShell v0.17.0'),
    ).toBeInTheDocument()
  })

  it('renders the terminal header element', () => {
    const { container } = render(
      <TerminalHeader title="JayShell" />,
    )

    const header = container.querySelector(
      '.terminal__header',
    )

    expect(header).toBeInTheDocument()
  })

  it('renders three decorative window controls', () => {
    const { container } = render(
      <TerminalHeader title="JayShell" />,
    )

    const controls = container.querySelectorAll(
      '.terminal__control',
    )

    expect(controls).toHaveLength(3)

    expect(
      container.querySelector(
        '.terminal__control--close',
      ),
    ).toBeInTheDocument()

    expect(
      container.querySelector(
        '.terminal__control--minimize',
      ),
    ).toBeInTheDocument()

    expect(
      container.querySelector(
        '.terminal__control--maximize',
      ),
    ).toBeInTheDocument()
  })

  it('hides decorative controls from assistive technology', () => {
    const { container } = render(
      <TerminalHeader title="JayShell" />,
    )

    const controlsContainer =
      container.querySelector(
        '.terminal__controls',
      )

    expect(controlsContainer).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
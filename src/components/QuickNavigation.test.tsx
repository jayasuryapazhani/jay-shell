import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickNavigation } from './QuickNavigation'

describe('QuickNavigation', () => {
  it('renders all portfolio navigation items', () => {
    render(
      <QuickNavigation
        onRunCommand={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('navigation'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('About Me'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Projects'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Resume'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Terminal Help'),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('button'),
    ).toHaveLength(10)
  })

  it('runs the projects command', async () => {
    const user = userEvent.setup()
    const onRunCommand = vi.fn()

    render(
      <QuickNavigation
        onRunCommand={onRunCommand}
      />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /Projects/i,
      }),
    )

    expect(onRunCommand).toHaveBeenCalledWith(
      'projects',
    )
  })

  it('runs the home command', async () => {
    const user = userEvent.setup()
    const onRunCommand = vi.fn()

    render(
      <QuickNavigation
        onRunCommand={onRunCommand}
      />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /Home/i,
      }),
    )

    expect(onRunCommand).toHaveBeenCalledWith(
      'cd ~',
    )
  })
})
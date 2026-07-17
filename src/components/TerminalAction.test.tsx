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
import { TerminalAction } from './TerminalAction'

describe('TerminalAction', () => {
  it('renders the provided content', () => {
    render(
      <TerminalAction
        command="about"
        onRunCommand={vi.fn()}
      >
        About Me
      </TerminalAction>,
    )

    expect(
      screen.getByRole('button', {
        name: 'About Me',
      }),
    ).toBeInTheDocument()
  })

  it('runs the configured command when clicked', async () => {
    const user = userEvent.setup()
    const onRunCommand = vi.fn()

    render(
      <TerminalAction
        command="projects"
        onRunCommand={onRunCommand}
      >
        Projects
      </TerminalAction>,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Projects',
      }),
    )

    expect(onRunCommand).toHaveBeenCalledTimes(1)
    expect(onRunCommand).toHaveBeenCalledWith(
      'projects',
    )
  })
})
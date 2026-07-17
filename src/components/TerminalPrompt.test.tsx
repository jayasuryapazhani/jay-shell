import {
  useRef,
  useState,
} from 'react'
import type {
  FormEvent,
  KeyboardEvent,
} from 'react'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TerminalPrompt } from './TerminalPrompt'

type PromptHarnessProps = {
  onSubmitCommand: (
    command: string,
  ) => void
  onKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>,
  ) => void
}

function PromptHarness({
  onSubmitCommand,
  onKeyDown = vi.fn(),
}: PromptHarnessProps) {
  const [commandInput, setCommandInput] =
    useState('')

  const commandInputRef =
    useRef<HTMLInputElement>(null)

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    onSubmitCommand(commandInput)
  }

  return (
    <TerminalPrompt
      currentPrompt="doctor-polaris@jayshell:~$"
      commandInput={commandInput}
      commandInputRef={commandInputRef}
      onSubmit={handleSubmit}
      onChange={(event) => {
        setCommandInput(event.target.value)
      }}
      onKeyDown={onKeyDown}
    />
  )
}

describe('TerminalPrompt', () => {
  it('renders the current prompt and input', () => {
    render(
      <PromptHarness
        onSubmitCommand={vi.fn()}
      />,
    )

    expect(
      screen.getByText(
        'doctor-polaris@jayshell:~$',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('textbox', {
        name: 'Enter a terminal command',
      }),
    ).toBeInTheDocument()
  })

  it('allows a command to be entered and submitted', async () => {
    const user = userEvent.setup()
    const onSubmitCommand = vi.fn()

    render(
      <PromptHarness
        onSubmitCommand={onSubmitCommand}
      />,
    )

    const input = screen.getByRole('textbox', {
      name: 'Enter a terminal command',
    })

    await user.type(input, 'projects')

    expect(input).toHaveValue('projects')

    const form = input.closest('form')

    expect(form).not.toBeNull()

    fireEvent.submit(form!)

    expect(onSubmitCommand).toHaveBeenCalledWith(
      'projects',
    )
  })

  it('forwards keyboard events', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()

    render(
      <PromptHarness
        onSubmitCommand={vi.fn()}
        onKeyDown={onKeyDown}
      />,
    )

    const input = screen.getByRole('textbox', {
      name: 'Enter a terminal command',
    })

    await user.click(input)
    await user.keyboard('{ArrowUp}')

    expect(onKeyDown).toHaveBeenCalled()

    expect(
      onKeyDown.mock.calls.some(
        ([event]) => event.key === 'ArrowUp',
      ),
    ).toBe(true)
  })
})
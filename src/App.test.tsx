import {
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import App from './App'
import { profile } from './data/profile'
import { generateVisitorAlias } from './utils/visitorAlias'

vi.mock('./utils/visitorAlias', () => ({
  generateVisitorAlias: vi.fn(),
}))

const mockedGenerateVisitorAlias =
  vi.mocked(generateVisitorAlias)

const createMatchMedia = (
  matches: boolean,
) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

const renderReadyApp = async () => {
  const renderResult = render(<App />)

  const input = await screen.findByRole(
    'textbox',
    {
      name: 'Enter a terminal command',
    },
  )

  return {
    ...renderResult,
    input,
  }
}

const runCommand = async (
  user: ReturnType<typeof userEvent.setup>,
  command: string,
) => {
  const input = screen.getByRole('textbox', {
    name: 'Enter a terminal command',
  })

  await user.clear(input)
  await user.type(input, command)
  await user.keyboard('{Enter}')
}

const getTerminalEntryOutput = (
  element: HTMLElement,
): HTMLElement => {
  const output = element.closest<HTMLElement>(
    '.terminal__entry-output',
  )

  if (!output) {
    throw new Error(
      'Terminal output container was not found.',
    )
  }

  return output
}

describe('App terminal integration', () => {
  beforeEach(() => {
    mockedGenerateVisitorAlias.mockReset()
    mockedGenerateVisitorAlias.mockReturnValue(
      'Doctor Polaris',
    )

    Object.defineProperty(
      window,
      'matchMedia',
      {
        configurable: true,
        writable: true,
        value: createMatchMedia(true),
      },
    )

    vi.spyOn(window, 'open').mockImplementation(
      () => null,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a ready terminal session', async () => {
    const { container, input } =
      await renderReadyApp()

    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()

    expect(
      screen.getByText(/JAYSHELL v/),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        'Portfolio quick navigation',
      ),
    ).toBeInTheDocument()

    const startup = container.querySelector<HTMLElement>(
      '.terminal__startup',
    )

    expect(startup).toBeInTheDocument()

    expect(startup).toHaveTextContent(
      'Hello, Doctor Polaris.',
    )

    expect(startup).toHaveTextContent(
      'Welcome to JayShell.',
    )
  })

  it('executes the about command', async () => {
    const user = userEvent.setup()

    await renderReadyApp()
    await runCommand(user, 'about')

    expect(
      screen.getByText(profile.headline),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Career Focus'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Hands-on Experience',
      ),
    ).toBeInTheDocument()
  })

  it('navigates to the projects directory', async () => {
    const user = userEvent.setup()

    const { container } =
      await renderReadyApp()

    await runCommand(user, 'cd projects')

    const title = container.querySelector<HTMLElement>(
      '.terminal__title',
    )

    expect(title).toHaveTextContent(
      'doctor-polaris@jayshell:~/projects',
    )

    await runCommand(user, 'pwd')

    expect(
      screen.getByText(
        '/home/jayasurya/projects',
      ),
    ).toBeInTheDocument()

    await runCommand(user, 'ls')

    expect(
      screen.getByRole('button', {
        name: 'shrtn/',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'siptime/',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'warzone/',
      }),
    ).toBeInTheDocument()
  })

  it('autocompletes a command with Tab', async () => {
    const user = userEvent.setup()

    const { input } = await renderReadyApp()

    await user.type(input, 'proj')
    await user.keyboard('{Tab}')

    expect(input).toHaveValue('projects')

    await user.keyboard('{Enter}')

    expect(
      screen.getByText(
        /Selected software-engineering projects/,
      ),
    ).toBeInTheDocument()
  })

  it('moves through command history with arrow keys', async () => {
    const user = userEvent.setup()

    const { input } = await renderReadyApp()

    await runCommand(user, 'about')
    await runCommand(user, 'skills')

    await user.click(input)
    await user.keyboard('{ArrowUp}')

    expect(input).toHaveValue('skills')

    await user.keyboard('{ArrowUp}')

    expect(input).toHaveValue('about')

    await user.keyboard('{ArrowDown}')

    expect(input).toHaveValue('skills')

    await user.keyboard('{ArrowDown}')

    expect(input).toHaveValue('')
  })

  it('suggests a valid command for a typo', async () => {
    const user = userEvent.setup()

    await renderReadyApp()
    await runCommand(user, 'projcts')

    const errorMessage = screen.getByText(
      'jayshell: command not found: projcts',
    )

    const output = getTerminalEntryOutput(
      errorMessage,
    )

    const suggestionLine =
      output.querySelector<HTMLElement>(
        '.terminal__suggestion-line',
      )

    expect(suggestionLine).toBeInTheDocument()

    expect(suggestionLine).toHaveTextContent(
      'Did you mean: projects?',
    )

    expect(
      within(output).getByRole('button', {
        name: 'projects',
      }),
    ).toBeInTheDocument()
  })

  it('runs a suggested command when clicked', async () => {
    const user = userEvent.setup()

    await renderReadyApp()
    await runCommand(user, 'projcts')

    const errorMessage = screen.getByText(
      'jayshell: command not found: projcts',
    )

    const output = getTerminalEntryOutput(
      errorMessage,
    )

    await user.click(
      within(output).getByRole('button', {
        name: 'projects',
      }),
    )

    expect(
      screen.getByText(
        /Selected software-engineering projects/,
      ),
    ).toBeInTheDocument()
  })

  it('clears visible terminal output', async () => {
    const user = userEvent.setup()

    await renderReadyApp()
    await runCommand(user, 'about')

    expect(
      screen.getByText('Career Focus'),
    ).toBeInTheDocument()

    await runCommand(user, 'clear')

    expect(
      screen.queryByText('Career Focus'),
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('textbox', {
        name: 'Enter a terminal command',
      }),
    ).toBeInTheDocument()
  })

  it('resets the terminal to the home directory', async () => {
    const user = userEvent.setup()

    const { container } =
      await renderReadyApp()

    await runCommand(user, 'cd projects')

    expect(
      container.querySelector<HTMLElement>(
        '.terminal__title',
      ),
    ).toHaveTextContent(
      'doctor-polaris@jayshell:~/projects',
    )

    await runCommand(user, 'reset')

    expect(
      container.querySelector<HTMLElement>(
        '.terminal__title',
      ),
    ).toHaveTextContent(
      'doctor-polaris@jayshell:~',
    )

    expect(
      screen.queryByText(
        '/home/jayasurya/projects',
      ),
    ).not.toBeInTheDocument()
  })

  it('reboots with a new visitor alias', async () => {
    mockedGenerateVisitorAlias
      .mockReturnValueOnce('Doctor Polaris')
      .mockReturnValueOnce('Black Manta')

    const user = userEvent.setup()

    const { container } =
      await renderReadyApp()

    await runCommand(user, 'about')

    expect(
      screen.getByText('Career Focus'),
    ).toBeInTheDocument()

    await runCommand(user, 'reboot')

    await screen.findByRole('textbox', {
      name: 'Enter a terminal command',
    })

    expect(
      container.querySelector<HTMLElement>(
        '.terminal__title',
      ),
    ).toHaveTextContent(
      'black-manta@jayshell:~',
    )

    expect(
      container.querySelector<HTMLElement>(
        '.terminal__startup',
      ),
    ).toHaveTextContent(
      'Hello, Black Manta.',
    )

    expect(
      screen.queryByText('Career Focus'),
    ).not.toBeInTheDocument()

    expect(
      mockedGenerateVisitorAlias,
    ).toHaveBeenCalledTimes(2)
  })

  it('runs commands from Quick Navigation', async () => {
    const user = userEvent.setup()

    await renderReadyApp()

    const navigation = screen.getByLabelText(
      'Portfolio quick navigation',
    )

    await user.click(
      within(navigation).getByRole('button', {
        name: /Experience/i,
      }),
    )

    expect(
      screen.getByText(
        /Professional software-engineering experience listed/,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Frontend Engineer Intern',
      ),
    ).toBeInTheDocument()
  })

  it('opens a project store link in a new tab', async () => {
    const user = userEvent.setup()
    const openSpy = vi.mocked(window.open)

    await renderReadyApp()

    await runCommand(user, 'cd projects')
    await runCommand(user, 'cd siptime')
    await runCommand(user, 'store')

    expect(openSpy).toHaveBeenCalledTimes(1)

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'chromewebstore.google.com',
      ),
      '_blank',
      'noopener,noreferrer',
    )

    expect(
      screen.getByText(
        'SipTime: Chrome Web Store',
      ),
    ).toBeInTheDocument()
  })

  it('provides a skip link to the terminal region', async () => {
  const user = userEvent.setup()

  const { input } = await renderReadyApp()

  const skipLink = screen.getByRole('link', {
    name: 'Skip to terminal content',
  })

  expect(skipLink).toHaveAttribute(
    'href',
    '#terminal-main',
  )

  const terminalRegion = screen.getByRole(
    'region',
    {
      name: 'Terminal session and command output',
    },
  )

  expect(terminalRegion).toHaveAttribute(
    'id',
    'terminal-main',
  )

  input.blur()
  await user.tab()

  expect(skipLink).toHaveFocus()
})
})
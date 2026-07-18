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
import { TerminalStartup } from './TerminalStartup'

describe('TerminalStartup', () => {
it('renders the boot cursor during the booting phase', () => {
  const { container } = render(
    <TerminalStartup
      phase="booting"
      typedIntroduction=""
      onRunCommand={vi.fn()}
    />,
  )

  expect(
    screen.getByLabelText(
      'JayShell is starting',
    ),
  ).toBeInTheDocument()

  expect(
    container.querySelector(
      '.terminal__boot-cursor',
    ),
  ).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {
      name: 'About Me',
    }),
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole('link', {
      name: 'View Resume',
    }),
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole('link', {
      name: 'Download Resume',
    }),
  ).not.toBeInTheDocument()
})

  it('renders partial introduction text during typing', () => {
    const { container } = render(
      <TerminalStartup
        phase="typing"
        typedIntroduction="Hello, Doctor Polaris."
        onRunCommand={vi.fn()}
      />,
    )

    expect(
      screen.getByText(
        /Hello, Doctor Polaris\./,
      ),
    ).toBeInTheDocument()

    expect(
      container.querySelector(
        '.terminal__typing-cursor',
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'About Me',
      }),
    ).not.toBeInTheDocument()
  })

  it('renders the completed introduction during the ready phase', () => {
    const introduction = [
      'Hello, Doctor Polaris.',
      'Welcome to JayShell.',
      'Explore the interactive terminal portfolio of Jayasurya Pazhani.',
    ].join(' ')

    const { container } = render(
      <TerminalStartup
        phase="ready"
        typedIntroduction={introduction}
        onRunCommand={vi.fn()}
      />,
    )

    expect(
      screen.getByText(introduction),
    ).toBeInTheDocument()

    expect(
      container.querySelector(
        '.terminal__typing-cursor',
      ),
    ).not.toBeInTheDocument()
  })

  it('shows the About Me action only when ready', () => {
    render(
      <TerminalStartup
        phase="ready"
        typedIntroduction="Welcome to JayShell."
        onRunCommand={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'About Me',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/type/),
    ).toBeInTheDocument()

    expect(
      screen.getByText('help'),
    ).toBeInTheDocument()
  })

it('runs the about command when About Me is clicked', async () => {
  const user = userEvent.setup()
  const onRunCommand = vi.fn()

  render(
    <TerminalStartup
      phase="ready"
      typedIntroduction="Welcome to JayShell."
      onRunCommand={onRunCommand}
    />,
  )

  await user.click(
    screen.getByRole('button', {
      name: 'About Me',
    }),
  )

  expect(onRunCommand).toHaveBeenCalledTimes(1)

  expect(onRunCommand).toHaveBeenCalledWith(
    'about',
  )
})

  it('uses a polite live region for startup updates', () => {
    const { container } = render(
      <TerminalStartup
        phase="typing"
        typedIntroduction="Welcome"
        onRunCommand={vi.fn()}
      />,
    )

    const startup = container.querySelector(
      '.terminal__startup',
    )

    expect(startup).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })
  it('shows view and download resume links when ready', () => {
  render(
    <TerminalStartup
      phase="ready"
      typedIntroduction="Welcome to JayShell."
      onRunCommand={vi.fn()}
    />,
  )

  const viewResumeLink = screen.getByRole(
    'link',
    {
      name: 'View Resume',
    },
  )

  expect(viewResumeLink).toHaveAttribute(
    'href',
    '/Jayasurya-Pazhani-Resume.pdf',
  )

  expect(viewResumeLink).toHaveAttribute(
    'target',
    '_blank',
  )

  expect(viewResumeLink).toHaveAttribute(
    'rel',
    'noreferrer',
  )

  const downloadResumeLink = screen.getByRole(
    'link',
    {
      name: 'Download Resume',
    },
  )

  expect(downloadResumeLink).toHaveAttribute(
    'href',
    '/Jayasurya-Pazhani-Resume.pdf',
  )

  expect(downloadResumeLink).toHaveAttribute(
    'download',
    'Jayasurya-Pazhani-Resume.pdf',
  )
})

})
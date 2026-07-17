import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './App.css'

const OWNER_NAME = 'Jayasurya Pazhani'
const CONTACT_EMAIL = 'pazhanijayasurya@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jayasurya-pazhani/'
const GITHUB_URL = 'https://github.com/jayasuryapazhani'
const HOME_DIRECTORY = '/home/jayasurya'

type TerminalEntry = {
  id: number
  command: string
  output: ReactNode
}

const createTerminalUsername = (name: string) => {
  const firstName = name.trim().split(/\s+/)[0]

  const username = firstName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  return username || 'visitor'
}

const getCommandOutput = (
  command: string,
  visitorName: string,
): ReactNode => {
  const normalizedCommand = command.trim().toLowerCase()

  switch (normalizedCommand) {
    case 'help':
      return (
        <div className="terminal__result">
          <p className="terminal__section-title">Available commands</p>

          <div className="terminal__help-list">
            <p>
              <span>help</span>
              Show available commands
            </p>
            <p>
              <span>about</span>
              Learn about Jayasurya
            </p>
            <p>
              <span>projects</span>
              View featured projects
            </p>
            <p>
              <span>contact</span>
              Display contact information
            </p>
            <p>
              <span>socials</span>
              Display LinkedIn and GitHub
            </p>
            <p>
              <span>whoami</span>
              Display the current terminal user
            </p>
            <p>
              <span>pwd</span>
              Show the current directory
            </p>
            <p>
              <span>ls</span>
              List available portfolio directories
            </p>
            <p>
              <span>clear</span>
              Clear the terminal history
            </p>
          </div>
        </div>
      )

    case 'about':
      return (
        <div className="terminal__result">
          <p className="terminal__section-title">About Jayasurya</p>
          <p>
            Jayasurya Pazhani is a software engineer and MEng Software
            Engineering student at Concordia University.
          </p>
          <p>
            He is focused on software development, backend systems, APIs,
            testing, automation, and building practical developer tools.
          </p>
        </div>
      )

    case 'projects':
      return (
        <div className="terminal__result">
          <p className="terminal__section-title">Featured projects</p>
          <p>
            <span className="terminal__directory">shrtn/</span>
            {' — '}URL shortener and QR code Chrome extension
          </p>
          <p>
            <span className="terminal__directory">supportbot/</span>
            {' — '}API and test-automation learning platform
          </p>
          <p>
            <span className="terminal__directory">dev-monitor/</span>
            {' — '}Developer system-monitoring dashboard
          </p>
          <p>
            <span className="terminal__directory">jay-shell/</span>
            {' — '}Interactive terminal portfolio
          </p>
        </div>
      )

    case 'contact':
      return (
        <div className="terminal__result">
          <p className="terminal__section-title">Contact</p>
          <p>
            Email:{' '}
            <a className="terminal__link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      )

    case 'socials':
      return (
        <div className="terminal__result">
          <p className="terminal__section-title">Social profiles</p>

          <p>
            LinkedIn:{' '}
            <a
              className="terminal__link"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/jayasurya-pazhani
            </a>
          </p>

          <p>
            GitHub:{' '}
            <a
              className="terminal__link"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              github.com/jayasuryapazhani
            </a>
          </p>
        </div>
      )

    case 'whoami':
      return (
        <div className="terminal__result">
          <p>{createTerminalUsername(visitorName)}</p>
          <p>
            Current session visitor: <span>{visitorName}</span>
          </p>
        </div>
      )

    case 'pwd':
      return (
        <div className="terminal__result">
          <p>{HOME_DIRECTORY}</p>
        </div>
      )

    case 'ls':
      return (
        <div className="terminal__directory-list">
          <span>about/</span>
          <span>skills/</span>
          <span>experience/</span>
          <span>education/</span>
          <span>projects/</span>
          <span>contact/</span>
          <span>socials/</span>
        </div>
      )

    default:
      return (
        <div className="terminal__result terminal__error">
          <p>jayshell: command not found: {command}</p>
          <p>
            Type <span className="terminal__command">help</span> to see
            available commands.
          </p>
        </div>
      )
  }
}

function App() {
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState<string | null>(null)
  const [commandInput, setCommandInput] = useState('')
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([])

  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const commandInputRef = useRef<HTMLInputElement>(null)
  const entryIdRef = useRef(0)

  const terminalUsername = visitorName
    ? createTerminalUsername(visitorName)
    : 'visitor'

  useEffect(() => {
    if (visitorName) {
      commandInputRef.current?.focus()
    }

    const terminalBody = terminalBodyRef.current

    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight
    }
  }, [visitorName, terminalEntries])

  const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanedName = nameInput.trim()

    if (!cleanedName) {
      return
    }

    setVisitorName(cleanedName)
  }

  const handleCommandSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!visitorName) {
      return
    }

    const cleanedCommand = commandInput.trim()

    if (!cleanedCommand) {
      return
    }

    if (cleanedCommand.toLowerCase() === 'clear') {
      setTerminalEntries([])
      setCommandInput('')
      return
    }

    entryIdRef.current += 1

    const newEntry: TerminalEntry = {
      id: entryIdRef.current,
      command: cleanedCommand,
      output: getCommandOutput(cleanedCommand, visitorName),
    }

    setTerminalEntries((currentEntries) => [
      ...currentEntries,
      newEntry,
    ])

    setCommandInput('')
  }

  const focusCommandInput = () => {
    if (visitorName) {
      commandInputRef.current?.focus()
    }
  }

  return (
    <main className="app-shell">
      <section
        className="terminal"
        aria-label="JayShell interactive terminal portfolio"
      >
        <header className="terminal__header">
          <div className="terminal__controls" aria-hidden="true">
            <span className="terminal__control terminal__control--close" />
            <span className="terminal__control terminal__control--minimize" />
            <span className="terminal__control terminal__control--maximize" />
          </div>

          <p className="terminal__title">
            {terminalUsername}@jayshell:~
          </p>

          <div className="terminal__header-space" aria-hidden="true" />
        </header>

        <div
          ref={terminalBodyRef}
          className="terminal__body"
          onClick={focusCommandInput}
        >
          <div className="terminal__intro">
            <p className="terminal__brand">JAYSHELL v0.2.0</p>
            <p>Interactive terminal portfolio</p>

            <p>
              Owner:{' '}
              <span className="terminal__highlight">
                {OWNER_NAME}
              </span>
            </p>
          </div>

          {visitorName === null ? (
            <form
              className="name-prompt"
              onSubmit={handleNameSubmit}
              aria-label="Visitor name form"
            >
              <div className="name-prompt__line">
                <label htmlFor="visitor-name">
                  Enter your name:
                </label>

                <input
                  id="visitor-name"
                  className="terminal__input terminal__input--name"
                  type="text"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  maxLength={40}
                  autoComplete="off"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </form>
          ) : (
            <div className="terminal__session">
              <p className="terminal__submitted-name">
                Enter your name: <span>{visitorName}</span>
              </p>

              <div className="terminal__welcome">
                <p>
                  Hello,{' '}
                  <span className="terminal__highlight">
                    {visitorName}
                  </span>
                  .
                </p>

                <p>
                  Welcome to {OWNER_NAME}&apos;s interactive developer
                  portfolio.
                </p>

                <p>
                  Explore my background, skills, experience, and software
                  projects through terminal commands.
                </p>

                <p>
                  Type{' '}
                  <span className="terminal__command">
                    help
                  </span>{' '}
                  to view available commands.
                </p>
              </div>

              <div
                className="terminal__history"
                aria-live="polite"
              >
                {terminalEntries.map((entry) => (
                  <div className="terminal__entry" key={entry.id}>
                    <div className="terminal__command-line">
                      <span className="terminal__prompt">
                        {terminalUsername}@jayshell:~$
                      </span>
                      <span>{entry.command}</span>
                    </div>

                    <div className="terminal__entry-output">
                      {entry.output}
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="terminal__command-line terminal__command-form"
                onSubmit={handleCommandSubmit}
              >
                <label
                  className="terminal__prompt"
                  htmlFor="terminal-command"
                >
                  {terminalUsername}@jayshell:~$
                </label>

                <input
                  ref={commandInputRef}
                  id="terminal-command"
                  className="terminal__input terminal__command-input"
                  type="text"
                  value={commandInput}
                  onChange={(event) =>
                    setCommandInput(event.target.value)
                  }
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-label="Enter a terminal command"
                />
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
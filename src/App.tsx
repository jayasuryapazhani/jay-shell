import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const OWNER_NAME = 'Jayasurya Pazhani'

const createTerminalUsername = (name: string) => {
  const firstName = name.trim().split(/\s+/)[0]

  const username = firstName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  return username || 'visitor'
}

function App() {
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState<string | null>(null)

  const terminalUsername = visitorName
    ? createTerminalUsername(visitorName)
    : 'visitor'

  const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanedName = nameInput.trim()

    if (!cleanedName) {
      return
    }

    setVisitorName(cleanedName)
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

        <div className="terminal__body">
          <div className="terminal__intro">
            <p className="terminal__brand">JAYSHELL v0.1.0</p>
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
                  aria-label="Enter your name"
                />
              </div>
            </form>
          ) : (
            <div className="terminal__output" aria-live="polite">
              <p className="terminal__submitted-name">
                Enter your name:{' '}
                <span>{visitorName}</span>
              </p>

              <div className="terminal__response">
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

              <div className="terminal__command-line">
                <span className="terminal__prompt">
                  {terminalUsername}@jayshell:~$
                </span>

                <span
                  className="terminal__cursor"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
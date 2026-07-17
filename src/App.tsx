import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const OWNER_NAME = 'Jayasurya Pazhani'

function App() {
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState<string | null>(null)

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

          <p className="terminal__title">visitor@jayshell: ~</p>
        </header>

        <div className="terminal__body">
          <div className="terminal__intro">
            <p className="terminal__brand">JAYSHELL v0.1.0</p>
            <p>Interactive terminal portfolio</p>
            <p>
              Owner: <span className="terminal__highlight">{OWNER_NAME}</span>
            </p>
          </div>

          {visitorName === null ? (
            <form
              className="name-prompt"
              onSubmit={handleNameSubmit}
              aria-label="Visitor name form"
            >
              <label htmlFor="visitor-name">Enter your name:</label>

              <div className="terminal__input-row">
                <span className="terminal__prompt" aria-hidden="true">
                  &gt;
                </span>

                <input
                  id="visitor-name"
                  className="terminal__input"
                  type="text"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  maxLength={40}
                  autoComplete="name"
                  autoFocus
                  aria-label="Enter your name"
                />
              </div>

              <button className="terminal__submit" type="submit">
                Enter ↵
              </button>
            </form>
          ) : (
            <div className="terminal__output" aria-live="polite">
              <p>
                Hello,{' '}
                <strong className="terminal__highlight">{visitorName}</strong>.
              </p>

              <p>
                Welcome to {OWNER_NAME}&apos;s interactive developer portfolio.
              </p>

              <p>
                Explore my background, skills, experience, and software
                projects through a terminal-inspired interface.
              </p>

              <p className="terminal__muted">
                Session initialized. Command support will be added next.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
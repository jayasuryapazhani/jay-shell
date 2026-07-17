import { useEffect, useRef, useState } from 'react'
import type {
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from 'react'
import {
  getDirectoryByPath,
 // virtualFileSystem,
} from './data/virtualFileSystem'
import './App.css'

const OWNER_NAME = 'Jayasurya Pazhani'
const CONTACT_EMAIL = 'pazhanijayasurya@gmail.com'
const LINKEDIN_URL =
  'https://www.linkedin.com/in/jayasurya-pazhani/'
const GITHUB_URL = 'https://github.com/jayasuryapazhani'
const HOME_DIRECTORY = '/home/jayasurya'
const AVAILABLE_COMMANDS = [
  'help',
  'info',
  'ls',
  'cd',
  'pwd',
  'whoami',
  'about',
  'skills',
  'experience',
  'education',
  'projects',
  'contact',
  'socials',
  'clear',
]
type TerminalEntry = {
  id: number
  command: string
  prompt: string
  output: ReactNode | null
}

type CommandResult = {
  output: ReactNode | null
  nextPath?: string[]
  clear?: boolean
}

const createTerminalUsername = (name: string) => {
  const firstName = name.trim().split(/\s+/)[0]

  const username = firstName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  return username || 'visitor'
}

const formatVirtualPath = (path: string[]) => {
  if (path.length === 0) {
    return HOME_DIRECTORY
  }

  return `${HOME_DIRECTORY}/${path.join('/')}`
}

const formatPromptPath = (path: string[]) => {
  if (path.length === 0) {
    return '~'
  }

  return `~/${path.join('/')}`
}

const resolveDirectoryPath = (
  target: string,
  currentPath: string[],
): string[] | null => {
  const normalizedTarget = target
    .trim()
    .replaceAll('\\', '/')

  let candidatePath: string[]
  let pathToProcess: string

  if (
    normalizedTarget === '' ||
    normalizedTarget === '~' ||
    normalizedTarget === HOME_DIRECTORY
  ) {
    return []
  }

  if (normalizedTarget.startsWith('~/')) {
    candidatePath = []
    pathToProcess = normalizedTarget.slice(2)
  } else if (
    normalizedTarget.startsWith(`${HOME_DIRECTORY}/`)
  ) {
    candidatePath = []
    pathToProcess = normalizedTarget.slice(
      HOME_DIRECTORY.length + 1,
    )
  } else if (normalizedTarget.startsWith('/')) {
    return null
  } else {
    candidatePath = [...currentPath]
    pathToProcess = normalizedTarget
  }

  const pathSegments = pathToProcess.split('/')

  for (const segment of pathSegments) {
    const normalizedSegment = segment.trim().toLowerCase()

    if (
      normalizedSegment === '' ||
      normalizedSegment === '.'
    ) {
      continue
    }

    if (normalizedSegment === '..') {
      candidatePath.pop()
      continue
    }

    candidatePath.push(normalizedSegment)
  }

  if (!getDirectoryByPath(candidatePath)) {
    return null
  }

  return candidatePath
}
const getAutocompleteValue = (
  input: string,
  currentPath: string[],
): string | null => {
  const inputWithoutLeadingSpaces = input.trimStart()

  if (inputWithoutLeadingSpaces.toLowerCase().startsWith('cd ')) {
    const directoryInput = inputWithoutLeadingSpaces
      .slice(3)
      .toLowerCase()

    if (directoryInput.includes('/')) {
      return null
    }

    const currentDirectory = getDirectoryByPath(currentPath)

    const directoryOptions = [
      '..',
      '~',
      ...Object.keys(currentDirectory?.children ?? {}),
    ]

    const matches = directoryOptions.filter((directoryName) =>
      directoryName.toLowerCase().startsWith(directoryInput),
    )

    if (matches.length !== 1) {
      return null
    }

    return `cd ${matches[0]}`
  }

  if (inputWithoutLeadingSpaces.includes(' ')) {
    return null
  }

  const normalizedInput = inputWithoutLeadingSpaces.toLowerCase()

  const matches = AVAILABLE_COMMANDS.filter((command) =>
    command.startsWith(normalizedInput),
  )

  if (matches.length !== 1) {
    return null
  }

  return matches[0]
}
const getDirectoryInfoOutput = (
  path: string[],
): ReactNode => {
  const directory = getDirectoryByPath(path)

  if (!directory) {
    return (
      <div className="terminal__result terminal__error">
        <p>Unable to read the current directory.</p>
      </div>
    )
  }

  const childDirectories = Object.keys(
    directory.children ?? {},
  )

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        {directory.title}
      </p>

      {directory.description.map((paragraph, index) => (
        <p key={`${directory.name}-${index}`}>
          {paragraph}
        </p>
      ))}

      {childDirectories.length > 0 && (
        <>
          <p className="terminal__section-title">
            Directories
          </p>

          <div className="terminal__directory-list">
            {childDirectories.map((directoryName) => (
              <span key={directoryName}>
                {directoryName}/
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const getListOutput = (path: string[]): ReactNode => {
  const directory = getDirectoryByPath(path)

  if (!directory) {
    return (
      <div className="terminal__result terminal__error">
        <p>ls: unable to read the current directory</p>
      </div>
    )
  }

  const childDirectories = Object.keys(
    directory.children ?? {},
  )

  if (childDirectories.length === 0) {
    return (
      <div className="terminal__result terminal__muted">
        <p>
          No subdirectories. Type{' '}
          <span className="terminal__command">info</span>{' '}
          to view this section.
        </p>
      </div>
    )
  }

  return (
    <div className="terminal__directory-list">
      {childDirectories.map((directoryName) => (
        <span key={directoryName}>
          {directoryName}/
        </span>
      ))}
    </div>
  )
}

const getHelpOutput = (path: string[]): ReactNode => {
  const directory = getDirectoryByPath(path)
  const currentPath = formatVirtualPath(path)
  const childDirectories = Object.keys(
    directory?.children ?? {},
  )
  const currentSection = path[0]

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        Help: {currentPath}
      </p>

      <div className="terminal__help-list">
        <p>
          <span>help</span>
          Show help for the current directory
        </p>

        <p>
          <span>info</span>
          Display information about the current directory
        </p>

        <p>
          <span>ls</span>
          List subdirectories
        </p>

        {childDirectories.length > 0 && (
          <p>
            <span>cd &lt;name&gt;</span>
            Enter a subdirectory
          </p>
        )}

        <p>
          <span>cd ..</span>
          Move to the parent directory
        </p>

        <p>
          <span>cd ~</span>
          Return to the home directory
        </p>

        <p>
          <span>pwd</span>
          Display the current path
        </p>

        <p>
          <span>whoami</span>
          Display the current terminal user
        </p>

        <p>
          <span>clear</span>
          Clear command history
        </p>
      </div>

      {path.length === 0 && (
        <>
          <p className="terminal__section-title">
            Portfolio shortcuts
          </p>

          <div className="terminal__help-list">
            <p>
              <span>about</span>
              Display information about Jayasurya
            </p>

            <p>
              <span>skills</span>
              Display technical skills
            </p>

            <p>
              <span>experience</span>
              Display professional experience
            </p>

            <p>
              <span>education</span>
              Display education
            </p>

            <p>
              <span>projects</span>
              Display featured projects
            </p>

            <p>
              <span>contact</span>
              Display contact information
            </p>

            <p>
              <span>socials</span>
              Display LinkedIn and GitHub
            </p>
          </div>
        </>
      )}

      {path.length > 0 && currentSection && (
        <>
          <p className="terminal__section-title">
            Section shortcut
          </p>

          <div className="terminal__help-list">
            <p>
              <span>{currentSection}</span>
              Display the main {currentSection} section
            </p>
          </div>
        </>
      )}
    </div>
  )
}

const getContactOutput = (): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">Contact</p>

    <p>
      Email:{' '}
      <a
        className="terminal__link"
        href={`mailto:${CONTACT_EMAIL}`}
      >
        {CONTACT_EMAIL}
      </a>
    </p>
  </div>
)

const getSocialsOutput = (): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">
      Social Profiles
    </p>

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

const executeCommand = (
  commandInput: string,
  visitorName: string,
  currentPath: string[],
): CommandResult => {
  const commandParts = commandInput.trim().split(/\s+/)
  const commandName = commandParts[0].toLowerCase()
  const commandArguments = commandParts.slice(1)

  switch (commandName) {
    case 'help':
      return {
        output: getHelpOutput(currentPath),
      }

    case 'info':
      return {
        output: getDirectoryInfoOutput(currentPath),
      }

    case 'ls':
      return {
        output: getListOutput(currentPath),
      }

    case 'pwd':
      return {
        output: (
          <div className="terminal__result">
            <p>{formatVirtualPath(currentPath)}</p>
          </div>
        ),
      }

    case 'whoami':
      return {
        output: (
          <div className="terminal__result">
            <p>{createTerminalUsername(visitorName)}</p>
            <p>
              Current session visitor: {visitorName}
            </p>
          </div>
        ),
      }

    case 'cd': {
      if (commandArguments.length > 1) {
        return {
          output: (
            <div className="terminal__result terminal__error">
              <p>cd: too many arguments</p>
            </div>
          ),
        }
      }

      const targetDirectory =
        commandArguments[0] ?? '~'

      const nextPath = resolveDirectoryPath(
        targetDirectory,
        currentPath,
      )

      if (!nextPath) {
        return {
          output: (
            <div className="terminal__result terminal__error">
              <p>
                jayshell: cd: {targetDirectory}: No such
                directory
              </p>
            </div>
          ),
        }
      }

      return {
        output: null,
        nextPath,
      }
    }

    case 'about':
      return {
        output: getDirectoryInfoOutput(['about']),
      }

    case 'skills':
      return {
        output: getDirectoryInfoOutput(['skills']),
      }

    case 'experience':
      return {
        output: getDirectoryInfoOutput(['experience']),
      }

    case 'education':
      return {
        output: getDirectoryInfoOutput(['education']),
      }

    case 'projects':
      return {
        output: getDirectoryInfoOutput(['projects']),
      }

    case 'contact':
      return {
        output: getContactOutput(),
      }

    case 'socials':
      return {
        output: getSocialsOutput(),
      }

    case 'clear':
      return {
        output: null,
        clear: true,
      }

    default:
      return {
        output: (
          <div className="terminal__result terminal__error">
            <p>
              jayshell: command not found: {commandInput}
            </p>

            <p>
              Type{' '}
              <span className="terminal__command">
                help
              </span>{' '}
              to see available commands.
            </p>
          </div>
        ),
      }
  }
}

function App() {
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] =
    useState<string | null>(null)
  const [commandInput, setCommandInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>(
  [],
)

const [commandHistoryIndex, setCommandHistoryIndex] = useState<
  number | null
>(null)
  const [currentPath, setCurrentPath] =
    useState<string[]>([])
  const [terminalEntries, setTerminalEntries] = useState<
    TerminalEntry[]
  >([])

  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const commandInputRef = useRef<HTMLInputElement>(null)
  const entryIdRef = useRef(0)

  const terminalUsername = visitorName
    ? createTerminalUsername(visitorName)
    : 'visitor'

  const currentPrompt = `${terminalUsername}@jayshell:${formatPromptPath(
    currentPath,
  )}$`

  useEffect(() => {
    if (visitorName) {
      commandInputRef.current?.focus()
    }

    const terminalBody = terminalBodyRef.current

    if (terminalBody) {
      terminalBody.scrollTop =
        terminalBody.scrollHeight
    }
  }, [visitorName, terminalEntries, currentPath])

  const handleNameSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const cleanedName = nameInput.trim()

    if (!cleanedName) {
      return
    }

    setVisitorName(cleanedName)
  }
const handleCommandKeyDown = (
  event: KeyboardEvent<HTMLInputElement>,
) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()

    if (commandHistory.length === 0) {
      return
    }

    const nextIndex =
      commandHistoryIndex === null
        ? commandHistory.length - 1
        : Math.max(0, commandHistoryIndex - 1)

    setCommandHistoryIndex(nextIndex)
    setCommandInput(commandHistory[nextIndex])

    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()

    if (commandHistoryIndex === null) {
      return
    }

    const nextIndex = commandHistoryIndex + 1

    if (nextIndex >= commandHistory.length) {
      setCommandHistoryIndex(null)
      setCommandInput('')
      return
    }

    setCommandHistoryIndex(nextIndex)
    setCommandInput(commandHistory[nextIndex])

    return
  }

  if (event.key === 'Tab') {
    event.preventDefault()

    const autocompleteValue = getAutocompleteValue(
      commandInput,
      currentPath,
    )

    if (autocompleteValue) {
      setCommandInput(autocompleteValue)
      setCommandHistoryIndex(null)
    }
  }
}
  const handleCommandSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!visitorName) {
      return
    }

    const cleanedCommand = commandInput.trim()

    if (!cleanedCommand) {
      return
    }
setCommandHistory((currentHistory) => [
  ...currentHistory,
  cleanedCommand,
].slice(-100))

setCommandHistoryIndex(null)
    const commandResult = executeCommand(
      cleanedCommand,
      visitorName,
      currentPath,
    )

    if (commandResult.clear) {
      setTerminalEntries([])
      setCommandInput('')
      return
    }

    entryIdRef.current += 1

    const newEntry: TerminalEntry = {
      id: entryIdRef.current,
      command: cleanedCommand,
      prompt: currentPrompt,
      output: commandResult.output,
    }

    setTerminalEntries((currentEntries) => [
      ...currentEntries,
      newEntry,
    ])

    if (commandResult.nextPath) {
      setCurrentPath(commandResult.nextPath)
    }

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
          <div
            className="terminal__controls"
            aria-hidden="true"
          >
            <span className="terminal__control terminal__control--close" />
            <span className="terminal__control terminal__control--minimize" />
            <span className="terminal__control terminal__control--maximize" />
          </div>

          <p className="terminal__title">
            {terminalUsername}@jayshell:
            {formatPromptPath(currentPath)}
          </p>

          <div
            className="terminal__header-space"
            aria-hidden="true"
          />
        </header>

        <div
          ref={terminalBodyRef}
          className="terminal__body"
          onClick={focusCommandInput}
        >
          <div className="terminal__intro">
            <p className="terminal__brand">
              JAYSHELL v0.3.0
            </p>

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
                  onChange={(event) =>
                    setNameInput(event.target.value)
                  }
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
                Enter your name: {visitorName}
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
                  Welcome to {OWNER_NAME}&apos;s interactive
                  developer portfolio.
                </p>

                <p>
                  Explore my background, skills, experience,
                  and software projects through terminal
                  commands.
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
                  <div
                    className="terminal__entry"
                    key={entry.id}
                  >
                    <div className="terminal__command-line">
                      <span className="terminal__prompt">
                        {entry.prompt}
                      </span>

                      <span>{entry.command}</span>
                    </div>

                    {entry.output !== null && (
                      <div className="terminal__entry-output">
                        {entry.output}
                      </div>
                    )}
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
                  {currentPrompt}
                </label>

                  <input
                    ref={commandInputRef}
                    id="terminal-command"
                    className="terminal__input terminal__command-input"
                    type="text"
                    value={commandInput}
                    onChange={(event) => {
                      setCommandInput(event.target.value)
                      setCommandHistoryIndex(null)
                    }}
                    onKeyDown={handleCommandKeyDown}
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
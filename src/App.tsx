import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from 'react'
import { PORTFOLIO_CONFIG } from './config/portfolio'
import {
  getProjectByPath,
  type ProjectDetails,
} from './data/projects'
import { getDirectoryByPath } from './data/virtualFileSystem'
import type {
  CommandResult,
  CommandRunner,
  TerminalEntry,
} from './types/terminal'
import {
  createDirectoryCommand,
  createTerminalUsername,
  formatPromptPath,
  formatVirtualPath,
  getAutocompleteValue,
  resolveDirectoryPath,
} from './utils/terminal'
import './App.css'


type TerminalActionProps = {
  command: string
  onRunCommand: CommandRunner
  children: ReactNode
  className?: string
}

type HelpActionProps = {
  command: string
  label?: string
  description: string
  onRunCommand: CommandRunner
}

function TerminalAction({
  command,
  onRunCommand,
  children,
  className = '',
}: TerminalActionProps) {
  return (
    <button
      className={`terminal__action ${className}`.trim()}
      type="button"
      title={`Run command: ${command}`}
      onClick={(event) => {
        event.stopPropagation()
        onRunCommand(command)
      }}
    >
      {children}
    </button>
  )
}

function HelpAction({
  command,
  label = command,
  description,
  onRunCommand,
}: HelpActionProps) {
  return (
    <p>
      <TerminalAction
        command={command}
        onRunCommand={onRunCommand}
        className="terminal__action--command"
      >
        {label}
      </TerminalAction>

      <span className="terminal__help-description">
        {description}
      </span>
    </p>
  )
}



const getDirectoryInfoOutput = (
  path: string[],
  onRunCommand: CommandRunner,
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
              <TerminalAction
                key={directoryName}
                command={createDirectoryCommand(
                  path,
                  directoryName,
                )}
                onRunCommand={onRunCommand}
                className="terminal__action--directory"
              >
                {directoryName}/
              </TerminalAction>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const getListOutput = (
  path: string[],
  onRunCommand: CommandRunner,
): ReactNode => {
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
            <TerminalAction
              key={directoryName}
              command={createDirectoryCommand(
                path,
                directoryName,
              )}
              onRunCommand={onRunCommand}
              className="terminal__action--directory"
            >
              {directoryName}/
            </TerminalAction>
          ))}
        </div>
  )
}


const getProjectOverviewOutput = (
  project: ProjectDetails,
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">
      {project.name}
    </p>

    <div className="terminal__project-meta">
      <p>
        <span>Type:</span>
        {project.category}
      </p>

      <p>
        <span>Status:</span>
        {project.status}
      </p>
    </div>

    {project.summary.map((paragraph, index) => (
      <p key={`${project.slug}-summary-${index}`}>
        {paragraph}
      </p>
    ))}

    <p className="terminal__muted">
      Type <span className="terminal__command">help</span>{' '}
      to view project-specific commands.
    </p>
  </div>
)

const getProjectDetailOutput = (
  title: string,
  items: string[],
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">{title}</p>

    <div className="terminal__detail-list">
      {items.map((item) => (
        <p className="terminal__detail-item" key={item}>
          {item}
        </p>
      ))}
    </div>
  </div>
)

const getProjectCommandError = (
  command: string,
): ReactNode => (
  <div className="terminal__result terminal__error">
    <p>
      jayshell: {command}: command is only available inside
      an individual project directory
    </p>

    <p>
      Try{' '}
      <span className="terminal__command">
        cd projects
      </span>
      .
    </p>
  </div>
)

const getUnavailableProjectLinkOutput = (
  project: ProjectDetails,
  linkType: string,
): ReactNode => (
  <div className="terminal__result terminal__muted">
    <p>
      {project.name} does not currently have a public{' '}
      {linkType} link.
    </p>
  </div>
)

const getExternalProjectLinkOutput = (
  label: string,
  url: string,
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">{label}</p>

    <p>
      Opening:{' '}
      <a
        className="terminal__link"
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        {url}
      </a>
    </p>
  </div>
)


const getHelpOutput = (
  path: string[],
  onRunCommand: CommandRunner,
): ReactNode => {
  const directory = getDirectoryByPath(path)

  const currentPath = formatVirtualPath(path)

  const childDirectories = Object.keys(
    directory?.children ?? {},
  )

  const currentSection = path[0]
  const currentProject = getProjectByPath(path)

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        Help: {currentPath}
      </p>

      <div className="terminal__help-list">
        <HelpAction
          command="help"
          description="Show help for the current directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="info"
          description="Display information about the current directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="ls"
          description="List subdirectories"
          onRunCommand={onRunCommand}
        />

        {childDirectories.length > 0 && (
          <p>
            <span className="terminal__help-placeholder">
              cd &lt;name&gt;
            </span>

            <span className="terminal__help-description">
              Enter a subdirectory
            </span>
          </p>
        )}

        <HelpAction
          command="cd .."
          label="cd .."
          description="Move to the parent directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="cd ~"
          label="cd ~"
          description="Return to the home directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="pwd"
          description="Display the current path"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="whoami"
          description="Display the current terminal user"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="clear"
          description="Clear command history"
          onRunCommand={onRunCommand}
        />
      </div>

      {path.length === 0 && (
        <>
          <p className="terminal__section-title">
            Portfolio shortcuts
          </p>

          <div className="terminal__help-list">
            <HelpAction
              command="about"
              description="Display information about Jayasurya"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="skills"
              description="Display technical skills"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="experience"
              description="Display professional experience"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="education"
              description="Display education"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="projects"
              description="Display featured projects"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="contact"
              description="Display contact information"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="socials"
              description="Display LinkedIn and GitHub"
              onRunCommand={onRunCommand}
            />
          </div>
        </>
      )}

      {path.length > 0 && currentSection && (
        <>
          <p className="terminal__section-title">
            Section shortcut
          </p>

          <div className="terminal__help-list">
            <HelpAction
              command={currentSection}
              description={`Display the main ${currentSection} section`}
              onRunCommand={onRunCommand}
            />
          </div>
        </>
      )}
      {currentProject && (
  <>
    <p className="terminal__section-title">
      Project commands
    </p>

    <div className="terminal__help-list">
      <HelpAction
        command="stack"
        description="Display the project technology stack"
        onRunCommand={onRunCommand}
      />

      <HelpAction
        command="features"
        description="Display key project features"
        onRunCommand={onRunCommand}
      />

      <HelpAction
        command="testing"
        description="Display testing and validation details"
        onRunCommand={onRunCommand}
      />

      <HelpAction
        command="architecture"
        description="Display the project architecture"
        onRunCommand={onRunCommand}
      />

      <HelpAction
        command="lessons"
        description="Display lessons learned"
        onRunCommand={onRunCommand}
      />

      {currentProject.githubUrl && (
        <HelpAction
          command="github"
          description="Open the GitHub repository"
          onRunCommand={onRunCommand}
        />
      )}

      {currentProject.demoUrl && (
        <HelpAction
          command="demo"
          description="Open the live application"
          onRunCommand={onRunCommand}
        />
      )}

      {currentProject.storeUrl && (
        <HelpAction
          command="store"
          description="Open the Chrome Web Store listing"
          onRunCommand={onRunCommand}
        />
      )}
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
        href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
      >
        {PORTFOLIO_CONFIG.contactEmail}
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
        href={PORTFOLIO_CONFIG.linkedInUrl}
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
        href={PORTFOLIO_CONFIG.githubUrl}
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
  onRunCommand: CommandRunner,
): CommandResult => {
  const commandParts = commandInput.trim().split(/\s+/)
  const commandName = commandParts[0].toLowerCase()
  const commandArguments = commandParts.slice(1)
  const currentProject = getProjectByPath(currentPath)

  switch (commandName) {
    case 'help':
      return {
                  output: getHelpOutput(
            currentPath,
            onRunCommand,
          ),
      }
      case 'info':
        return {
          output: currentProject
            ? getProjectOverviewOutput(currentProject)
            : getDirectoryInfoOutput(
                currentPath,
                onRunCommand,
              ),
        }

    case 'ls':
      return {
            output: getListOutput(
              currentPath,
              onRunCommand,
            ),
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
      output: getDirectoryInfoOutput(
        ['about'],
        onRunCommand,
      ),
    }

  case 'skills':
    return {
      output: getDirectoryInfoOutput(
        ['skills'],
        onRunCommand,
      ),
    }

  case 'experience':
    return {
      output: getDirectoryInfoOutput(
        ['experience'],
        onRunCommand,
      ),
    }

  case 'education':
    return {
      output: getDirectoryInfoOutput(
        ['education'],
        onRunCommand,
      ),
    }

  case 'projects':
    return {
      output: getDirectoryInfoOutput(
        ['projects'],
        onRunCommand,
      ),
    }

    case 'contact':
      return {
        output: getContactOutput(),
      }

    case 'socials':
      return {
        output: getSocialsOutput(),
      }
case 'stack':
  return {
    output: currentProject
      ? getProjectDetailOutput(
          `${currentProject.name}: Technology Stack`,
          currentProject.stack,
        )
      : getProjectCommandError('stack'),
  }

case 'features':
  return {
    output: currentProject
      ? getProjectDetailOutput(
          `${currentProject.name}: Features`,
          currentProject.features,
        )
      : getProjectCommandError('features'),
  }

case 'testing':
  return {
    output: currentProject
      ? getProjectDetailOutput(
          `${currentProject.name}: Testing`,
          currentProject.testing,
        )
      : getProjectCommandError('testing'),
  }

case 'architecture':
  return {
    output: currentProject
      ? getProjectDetailOutput(
          `${currentProject.name}: Architecture`,
          currentProject.architecture,
        )
      : getProjectCommandError('architecture'),
  }

case 'lessons':
  return {
    output: currentProject
      ? getProjectDetailOutput(
          `${currentProject.name}: Lessons Learned`,
          currentProject.lessons,
        )
      : getProjectCommandError('lessons'),
  }

case 'github':
  if (!currentProject) {
    return {
      output: getProjectCommandError('github'),
    }
  }

  if (!currentProject.githubUrl) {
    return {
      output: getUnavailableProjectLinkOutput(
        currentProject,
        'GitHub repository',
      ),
    }
  }

  return {
    output: getExternalProjectLinkOutput(
      `${currentProject.name}: GitHub`,
      currentProject.githubUrl,
    ),
    externalUrl: currentProject.githubUrl,
  }

case 'demo':
  if (!currentProject) {
    return {
      output: getProjectCommandError('demo'),
    }
  }

  if (!currentProject.demoUrl) {
    return {
      output: getUnavailableProjectLinkOutput(
        currentProject,
        'live demo',
      ),
    }
  }

  return {
    output: getExternalProjectLinkOutput(
      `${currentProject.name}: Live Demo`,
      currentProject.demoUrl,
    ),
    externalUrl: currentProject.demoUrl,
  }

case 'store':
  if (!currentProject) {
    return {
      output: getProjectCommandError('store'),
    }
  }

  if (!currentProject.storeUrl) {
    return {
      output: getUnavailableProjectLinkOutput(
        currentProject,
        'store',
      ),
    }
  }

  return {
    output: getExternalProjectLinkOutput(
      `${currentProject.name}: Chrome Web Store`,
      currentProject.storeUrl,
    ),
    externalUrl: currentProject.storeUrl,
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
const visitorNameRef = useRef<string | null>(null)
const currentPathRef = useRef<string[]>([])
const currentPromptRef = useRef('')
const commandRunnerRef = useRef<CommandRunner>(() => undefined)
  const terminalUsername = visitorName
    ? createTerminalUsername(visitorName)
    : 'visitor'

const currentPrompt =
  `${terminalUsername}@${PORTFOLIO_CONFIG.hostName}:` +
  `${formatPromptPath(currentPath)}$`
useEffect(() => {
  visitorNameRef.current = visitorName
  currentPathRef.current = currentPath
  currentPromptRef.current = currentPrompt
}, [visitorName, currentPath, currentPrompt])
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


const runCommandFromOutput = useCallback(
  (command: string) => {
    commandRunnerRef.current(command)
  },
  [],
)

const runCommand = useCallback(
  (rawCommand: string) => {
    const activeVisitorName = visitorNameRef.current

    if (!activeVisitorName) {
      return
    }

    const cleanedCommand = rawCommand.trim()

    if (!cleanedCommand) {
      return
    }

    const activePath = currentPathRef.current
    const activePrompt = currentPromptRef.current

    setCommandHistory((currentHistory) => [
      ...currentHistory,
      cleanedCommand,
    ].slice(-100))

    setCommandHistoryIndex(null)

    const commandResult = executeCommand(
      cleanedCommand,
      activeVisitorName,
      activePath,
      runCommandFromOutput,
    )
if (commandResult.externalUrl) {
  window.open(
    commandResult.externalUrl,
    '_blank',
    'noopener,noreferrer',
  )
}
    if (commandResult.clear) {
      setTerminalEntries([])
      setCommandInput('')
      return
    }

    entryIdRef.current += 1

    const newEntry: TerminalEntry = {
      id: entryIdRef.current,
      command: cleanedCommand,
      prompt: activePrompt,
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
  },
  [runCommandFromOutput],
)

useEffect(() => {
  commandRunnerRef.current = runCommand
}, [runCommand])


const handleCommandSubmit = (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault()
  runCommand(commandInput)
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
            {terminalUsername}@{PORTFOLIO_CONFIG.hostName}:
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
            {PORTFOLIO_CONFIG.appName.toUpperCase()} v
            {PORTFOLIO_CONFIG.version}
            </p>

            <p>Interactive terminal portfolio</p>

            <p>
              Owner:{' '}
              <span className="terminal__highlight">
                {PORTFOLIO_CONFIG.ownerName}
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
                  Welcome to {PORTFOLIO_CONFIG.ownerName}&apos;s interactive
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
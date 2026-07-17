import type { CommandRunner } from '../types/terminal'
import { TerminalAction } from './TerminalAction'

const QUICK_NAVIGATION_ITEMS = [
  {
    label: 'Home',
    command: 'cd ~',
  },
  {
    label: 'About Me',
    command: 'about',
  },
  {
    label: 'Skills',
    command: 'skills',
  },
  {
    label: 'Experience',
    command: 'experience',
  },
  {
    label: 'Education',
    command: 'education',
  },
  {
    label: 'Projects',
    command: 'projects',
  },
  {
    label: 'Resume',
    command: 'resume',
  },
  {
    label: 'Contact',
    command: 'contact',
  },
  {
    label: 'Socials',
    command: 'socials',
  },
  {
    label: 'Terminal Help',
    command: 'help',
  },
] as const

type QuickNavigationProps = {
  onRunCommand: CommandRunner
}

export function QuickNavigation({
  onRunCommand,
}: QuickNavigationProps) {
  return (
    <aside
      className="terminal__sidebar"
      aria-label="Portfolio quick navigation"
    >
      <div className="terminal__sidebar-header">
        <p className="terminal__sidebar-title">
          Quick Navigation
        </p>

        <p className="terminal__sidebar-description">
          Select a section or use the terminal.
        </p>
      </div>

      <nav className="terminal__quick-links">
        {QUICK_NAVIGATION_ITEMS.map((item, index) => (
          <TerminalAction
            key={item.command}
            command={item.command}
            onRunCommand={onRunCommand}
            className="terminal__quick-link"
          >
            <span className="terminal__quick-link-number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="terminal__quick-link-label">
              {item.label}
            </span>

            <span
              className="terminal__quick-link-command"
              aria-hidden="true"
            >
              {item.command}
            </span>
          </TerminalAction>
        ))}
      </nav>

      <div className="terminal__sidebar-footer">
        <p>
          Keyboard: <span>↑ ↓</span> history
        </p>

        <p>
          Keyboard: <span>Tab</span> autocomplete
        </p>
        <p>
        Command log: <span>history</span>
        </p>
        <p>
        Clear screen: <span>clear / cls</span>
        </p>
        <p>
        Reset terminal: <span>reset</span>
        </p>

        <p>
        New session: <span>reboot</span>
        </p>
      </div>
    </aside>
  )
}
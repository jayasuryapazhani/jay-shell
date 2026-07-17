import type {
  CommandRunner,
  StartupPhase,
} from '../types/terminal'
import { TerminalAction } from './TerminalAction'

type TerminalStartupProps = {
  phase: StartupPhase
  typedIntroduction: string
  onRunCommand: CommandRunner
}

export function TerminalStartup({
  phase,
  typedIntroduction,
  onRunCommand,
}: TerminalStartupProps) {
  return (
    <div
      className="terminal__startup"
      aria-live="polite"
    >
      {phase === 'booting' && (
        <div className="terminal__boot">
          <span
            className="terminal__boot-cursor"
            aria-label="JayShell is starting"
          >
            _
          </span>
        </div>
      )}

      {phase !== 'booting' && (
        <div className="terminal__typed-introduction">
          <p className="terminal__typed-text">
            {typedIntroduction}

            {phase === 'typing' && (
              <span
                className="terminal__typing-cursor"
                aria-hidden="true"
              >
                _
              </span>
            )}
          </p>

          {phase === 'ready' && (
            <div className="terminal__intro-actions">
              <TerminalAction
                command="about"
                onRunCommand={onRunCommand}
                className="terminal__action--primary"
              >
                About Me
              </TerminalAction>

              <p className="terminal__intro-hint">
                Select About Me, use Quick Navigation, or type{' '}
                <span className="terminal__command">
                  help
                </span>{' '}
                below.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
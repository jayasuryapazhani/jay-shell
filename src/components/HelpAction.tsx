import type { CommandRunner } from '../types/terminal'
import { TerminalAction } from './TerminalAction'

type HelpActionProps = {
  command: string
  description: string
  onRunCommand: CommandRunner
  label?: string
}

export function HelpAction({
  command,
  description,
  onRunCommand,
  label = command,
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
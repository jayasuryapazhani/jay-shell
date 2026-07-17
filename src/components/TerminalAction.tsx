import type { ReactNode } from 'react'
import type { CommandRunner } from '../types/terminal'

type TerminalActionProps = {
  command: string
  onRunCommand: CommandRunner
  children: ReactNode
  className?: string
}

export function TerminalAction({
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
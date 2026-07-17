import type { ReactNode } from 'react'
export type StartupPhase = 'booting' | 'typing' | 'ready'
export type TerminalEntry = {
  id: number
  command: string
  prompt: string
  output: ReactNode | null
}

export type CommandResult = {
  output: ReactNode | null
  nextPath?: string[]
  clear?: boolean
  externalUrl?: string
}

export type CommandRunner = (command: string) => void
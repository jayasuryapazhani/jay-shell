import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  render,
  screen,
} from '@testing-library/react'
import type { TerminalEntry } from '../types/terminal'
import { TerminalHistory } from './TerminalHistory'

const entries: TerminalEntry[] = [
  {
    id: 1,
    command: 'about',
    prompt: 'doctor-polaris@jayshell:~$',
    output: (
      <p>
        About Jayasurya
      </p>
    ),
  },
  {
    id: 2,
    command: 'clear',
    prompt: 'doctor-polaris@jayshell:~$',
    output: null,
  },
]

describe('TerminalHistory', () => {
  it('renders command history entries', () => {
    render(
      <TerminalHistory entries={entries} />,
    )

    expect(
      screen.getByText('about'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('clear'),
    ).toBeInTheDocument()

    expect(
      screen.getAllByText(
        'doctor-polaris@jayshell:~$',
      ),
    ).toHaveLength(2)
  })

  it('renders command output when output exists', () => {
    render(
      <TerminalHistory entries={entries} />,
    )

    expect(
      screen.getByText('About Jayasurya'),
    ).toBeInTheDocument()
  })
})
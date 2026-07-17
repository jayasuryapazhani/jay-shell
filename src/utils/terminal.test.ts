import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  createTerminalUsername,
  formatPromptPath,
  formatVirtualPath,
  getSuggestedCommand,
} from './terminal'

describe('createTerminalUsername', () => {
  it('converts an alias into a terminal-safe username', () => {
    expect(
      createTerminalUsername('Doctor Polaris'),
    ).toBe('doctor-polaris')
  })

  it('converts spaces and punctuation to hyphens', () => {
    expect(
      createTerminalUsername(
        'The Amazing Spider-Man!',
      ),
    ).toBe('the-amazing-spider-man')
  })

  it('removes repeated separators', () => {
    expect(
      createTerminalUsername(
        'Doctor   Victor---Von Doom',
      ),
    ).toBe('doctor-victor-von-doom')
  })

  it('removes leading and trailing separators', () => {
    expect(
      createTerminalUsername(
        '---Black Manta---',
      ),
    ).toBe('black-manta')
  })
})

describe('formatPromptPath', () => {
  it('uses the home shortcut for an empty path', () => {
    expect(formatPromptPath([])).toBe('~')
  })

  it('formats a top-level directory', () => {
    expect(
      formatPromptPath(['projects']),
    ).toBe('~/projects')
  })

  it('formats a nested project directory', () => {
    expect(
      formatPromptPath([
        'projects',
        'slot-machine-pixijs',
      ]),
    ).toBe(
      '~/projects/slot-machine-pixijs',
    )
  })
})

describe('formatVirtualPath', () => {
  it('returns the complete home path', () => {
    expect(
      formatVirtualPath([]),
    ).toBe('/home/jayasurya')
  })

  it('returns an absolute project path', () => {
    expect(
      formatVirtualPath([
        'projects',
        'siptime',
      ]),
    ).toBe(
      '/home/jayasurya/projects/siptime',
    )
  })
})

describe('getSuggestedCommand', () => {
  it('suggests projects for a common misspelling', () => {
    expect(
      getSuggestedCommand('projcts'),
    ).toBe('projects')
  })

  it('suggests experience for a common misspelling', () => {
    expect(
      getSuggestedCommand('experince'),
    ).toBe('experience')
  })

  it('suggests history for transposed letters', () => {
    expect(
      getSuggestedCommand('histroy'),
    ).toBe('history')
  })

  it('suggests reset for an extra character', () => {
    expect(
      getSuggestedCommand('resett'),
    ).toBe('reset')
  })

  it('returns null for an unrelated command', () => {
    expect(
      getSuggestedCommand('banana'),
    ).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(
      getSuggestedCommand(''),
    ).toBeNull()
  })

  it('uses only the command portion of the input', () => {
    expect(
      getSuggestedCommand(
        'projcts additional arguments',
      ),
    ).toBe('projects')
  })
})
import {
  AVAILABLE_COMMANDS,
  PORTFOLIO_CONFIG,
} from '../config/portfolio'
import { getDirectoryByPath } from '../data/virtualFileSystem'

export const createTerminalUsername = (name: string) => {
  const firstName = name.trim().split(/\s+/)[0]

  const username = firstName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  return username || 'visitor'
}

export const formatVirtualPath = (path: string[]) => {
  if (path.length === 0) {
    return PORTFOLIO_CONFIG.homeDirectory
  }

  return `${PORTFOLIO_CONFIG.homeDirectory}/${path.join('/')}`
}

export const formatPromptPath = (path: string[]) => {
  if (path.length === 0) {
    return '~'
  }

  return `~/${path.join('/')}`
}

export const createDirectoryCommand = (
  currentPath: string[],
  directoryName: string,
) => {
  const targetPath = [...currentPath, directoryName].join('/')

  return `cd ${PORTFOLIO_CONFIG.homeDirectory}/${targetPath}`
}

export const resolveDirectoryPath = (
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
    normalizedTarget === PORTFOLIO_CONFIG.homeDirectory
  ) {
    return []
  }

  if (normalizedTarget.startsWith('~/')) {
    candidatePath = []
    pathToProcess = normalizedTarget.slice(2)
  } else if (
    normalizedTarget.startsWith(
      `${PORTFOLIO_CONFIG.homeDirectory}/`,
    )
  ) {
    candidatePath = []
    pathToProcess = normalizedTarget.slice(
      PORTFOLIO_CONFIG.homeDirectory.length + 1,
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

export const getAutocompleteValue = (
  input: string,
  currentPath: string[],
): string | null => {
  const inputWithoutLeadingSpaces = input.trimStart()

  if (
    inputWithoutLeadingSpaces.toLowerCase().startsWith('cd ')
  ) {
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
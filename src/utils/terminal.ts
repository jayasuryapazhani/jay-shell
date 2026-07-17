import {
  AVAILABLE_COMMANDS,
  PORTFOLIO_CONFIG,
} from '../config/portfolio'
import { getDirectoryByPath } from '../data/virtualFileSystem'

export const createTerminalUsername = (name: string) => {
  const username = name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

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

const getEditDistance = (
  source: string,
  target: string,
): number => {
  const previousRow = Array.from(
    { length: target.length + 1 },
    (_, index) => index,
  )

  for (
    let sourceIndex = 1;
    sourceIndex <= source.length;
    sourceIndex += 1
  ) {
    const currentRow: number[] = [sourceIndex]

    for (
      let targetIndex = 1;
      targetIndex <= target.length;
      targetIndex += 1
    ) {
      const substitutionCost =
        source[sourceIndex - 1] === target[targetIndex - 1]
          ? 0
          : 1

      currentRow[targetIndex] = Math.min(
        currentRow[targetIndex - 1] + 1,
        previousRow[targetIndex] + 1,
        previousRow[targetIndex - 1] + substitutionCost,
      )
    }

    for (
      let index = 0;
      index < currentRow.length;
      index += 1
    ) {
      previousRow[index] = currentRow[index]
    }
  }

  return previousRow[target.length]
}

export const getSuggestedCommand = (
  input: string,
): string | null => {
  const normalizedInput = input
    .trim()
    .toLowerCase()
    .split(/\s+/)[0]

  if (!normalizedInput) {
    return null
  }

  const matches = AVAILABLE_COMMANDS
    .map((command) => ({
      command,
      distance: getEditDistance(
        normalizedInput,
        command,
      ),
    }))
    .sort(
      (firstMatch, secondMatch) =>
        firstMatch.distance - secondMatch.distance,
    )

  const bestMatch = matches[0]

  if (!bestMatch) {
    return null
  }

  const maximumDistance =
    normalizedInput.length <= 4 ? 1 : 2

  if (bestMatch.distance > maximumDistance) {
    return null
  }

  return bestMatch.command
}
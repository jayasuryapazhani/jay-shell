import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  getAllProjects,
  getProjectByPath,
} from './projects'
import {
  getDirectoryByPath,
} from './virtualFileSystem'

describe('virtual filesystem', () => {
  it('returns the home directory for an empty path', () => {
    const homeDirectory = getDirectoryByPath([])

    expect(homeDirectory).not.toBeNull()
    expect(homeDirectory?.name).toBe('jayasurya')
    expect(homeDirectory?.title).toBe('JayShell Home')
  })

  it('resolves a nested project directory', () => {
    const sipTimeDirectory = getDirectoryByPath([
      'projects',
      'siptime',
    ])

    expect(sipTimeDirectory).not.toBeNull()
    expect(sipTimeDirectory?.name).toBe('siptime')
    expect(sipTimeDirectory?.title).toBe('SipTime')
  })

  it('returns null for a directory that does not exist', () => {
    const missingDirectory = getDirectoryByPath([
      'projects',
      'missing-project',
    ])

    expect(missingDirectory).toBeNull()
  })
})

describe('project portfolio data', () => {
  it('contains seven configured projects', () => {
    const projects = getAllProjects()

    expect(projects).toHaveLength(7)
  })

  it('keeps project data synchronized with project directories', () => {
    const projectDirectory =
      getDirectoryByPath(['projects'])

    const directorySlugs = Object.keys(
      projectDirectory?.children ?? {},
    ).sort()

    const projectSlugs = getAllProjects()
      .map((project) => project.slug)
      .sort()

    expect(projectSlugs).toEqual(directorySlugs)
  })

  it('resolves project details from a virtual path', () => {
    const project = getProjectByPath([
      'projects',
      'slot-machine-pixijs',
    ])

    expect(project).not.toBeNull()
    expect(project?.name).toBe('PixiJS Slot Machine')
    expect(project?.githubUrl).toContain(
      'slot-machine-pixijs',
    )
  })

  it('rejects invalid project paths', () => {
    expect(
      getProjectByPath(['projects']),
    ).toBeNull()

    expect(
      getProjectByPath(['projects', 'missing-project']),
    ).toBeNull()

    expect(
      getProjectByPath([
        'projects',
        'siptime',
        'nested',
      ]),
    ).toBeNull()
  })
})
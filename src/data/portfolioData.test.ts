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

  it('resolves the Recordock project directory', () => {
    const recordockDirectory = getDirectoryByPath([
      'projects',
      'recordock',
    ])

    expect(recordockDirectory).not.toBeNull()
    expect(recordockDirectory?.name).toBe('recordock')
    expect(recordockDirectory?.title).toBe('Recordock')
  })

  it('includes directories for current client and self-hosted work', () => {
    const clientProject = getDirectoryByPath(['projects', 'life-of-priya'])
    const streamingProject = getDirectoryByPath(['projects', 'pazora'])

    expect(clientProject?.name).toBe('life-of-priya')
    expect(streamingProject?.name).toBe('pazora')
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
  it('contains ten configured projects', () => {
    const projects = getAllProjects()

    expect(projects).toHaveLength(10)
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

  it('shows new production projects and keeps private links private', () => {
    const clientProject = getProjectByPath(['projects', 'life-of-priya'])
    const streamingProject = getProjectByPath(['projects', 'pazora'])
    const shrtn = getProjectByPath(['projects', 'shrtn'])

    expect(clientProject?.demoUrl).toBe('https://lifeofpriya.com/')
    expect(clientProject?.githubUrl).toBeUndefined()
    expect(streamingProject?.demoUrl).toBeUndefined()
    expect(streamingProject?.githubUrl).toBeUndefined()
    expect(shrtn?.demoUrl).toBeUndefined()
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

  it('includes current published product links', () => {
    const recordock = getProjectByPath([
      'projects',
      'recordock',
    ])

    expect(recordock?.status).toContain('Published')
    expect(recordock?.demoUrl).toContain('recordock.vercel.app')
    expect(recordock?.storeUrl).toContain('chromewebstore.google.com')

    const sipTime = getProjectByPath([
      'projects',
      'siptime',
    ])

    expect(sipTime?.demoUrl).toContain('siptime.vercel.app')

    const shrtn = getProjectByPath([
      'projects',
      'shrtn',
    ])

    expect(shrtn?.status).toContain('v1.1.0')
    expect(shrtn?.features).toContain(
      'Shorten selected hyperlinks without opening them',
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

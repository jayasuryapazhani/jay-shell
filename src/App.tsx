import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from 'react'

import { TerminalHeader } from './components/TerminalHeader'
import { TerminalHistory } from './components/TerminalHistory'
import { TerminalPrompt } from './components/TerminalPrompt'
import { TerminalStartup } from './components/TerminalStartup'


import { HelpAction } from './components/HelpAction'
import { QuickNavigation } from './components/QuickNavigation'
import { TerminalAction } from './components/TerminalAction'

import { PORTFOLIO_CONFIG } from './config/portfolio'

import { profile } from './data/profile'

import {
  getAllProjects,
  getProjectByPath,
  type ProjectDetails,
} from './data/projects'


import { getDirectoryByPath } from './data/virtualFileSystem'
import type {
  CommandResult,
  CommandRunner,
  StartupPhase,
  TerminalEntry,
} from './types/terminal'


import {
  createDirectoryCommand,
  createTerminalUsername,
  formatPromptPath,
  formatVirtualPath,
  getAutocompleteValue,
  getSuggestedCommand,
  resolveDirectoryPath,
} from './utils/terminal'


import { generateVisitorAlias } from './utils/visitorAlias'
import './App.css'



const getDirectoryInfoOutput = (
  path: string[],
  onRunCommand: CommandRunner,
): ReactNode => {
  const directory = getDirectoryByPath(path)

  if (!directory) {
    return (
      <div className="terminal__result terminal__error">
        <p>Unable to read the current directory.</p>
      </div>
    )
  }

  const childDirectories = Object.keys(
    directory.children ?? {},
  )

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        {directory.title}
      </p>

      {directory.description.map((paragraph, index) => (
        <p key={`${directory.name}-${index}`}>
          {paragraph}
        </p>
      ))}

      {childDirectories.length > 0 && (
        <>
          <p className="terminal__section-title">
            Directories
          </p>

          <div className="terminal__directory-list">
            {childDirectories.map((directoryName) => (
              <TerminalAction
                key={directoryName}
                command={createDirectoryCommand(
                  path,
                  directoryName,
                )}
                onRunCommand={onRunCommand}
                className="terminal__action--directory"
              >
                {directoryName}/
              </TerminalAction>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const getListOutput = (
  path: string[],
  onRunCommand: CommandRunner,
): ReactNode => {
  const directory = getDirectoryByPath(path)

  if (!directory) {
    return (
      <div className="terminal__result terminal__error">
        <p>ls: unable to read the current directory</p>
      </div>
    )
  }

  const childDirectories = Object.keys(
    directory.children ?? {},
  )

  if (childDirectories.length === 0) {
    return (
      <div className="terminal__result terminal__muted">
        <p>
          No subdirectories. Type{' '}
          <span className="terminal__command">info</span>{' '}
          to view this section.
        </p>
      </div>
    )
  }

  return (
    <div className="terminal__directory-list">
      {childDirectories.map((directoryName) => (
        <TerminalAction
          key={directoryName}
          command={createDirectoryCommand(
            path,
            directoryName,
          )}
          onRunCommand={onRunCommand}
          className="terminal__action--directory"
        >
          {directoryName}/
        </TerminalAction>
      ))}
    </div>
  )
}

const getProjectOverviewOutput = (
  project: ProjectDetails,
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">
      {project.name}
    </p>

    <div className="terminal__project-meta">
      <p>
        <span>Type:</span>
        {project.category}
      </p>

      <p>
        <span>Status:</span>
        {project.status}
      </p>
    </div>

    {project.summary.map((paragraph, index) => (
      <p key={`${project.slug}-summary-${index}`}>
        {paragraph}
      </p>
    ))}

    <p className="terminal__muted">
      Type <span className="terminal__command">help</span>{' '}
      to view project-specific commands.
    </p>
  </div>
)

const getProjectDetailOutput = (
  title: string,
  items: string[],
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">{title}</p>

    <div className="terminal__detail-list">
      {items.map((item) => (
        <p className="terminal__detail-item" key={item}>
          {item}
        </p>
      ))}
    </div>
  </div>
)

const getProjectCommandError = (
  command: string,
): ReactNode => (
  <div className="terminal__result terminal__error">
    <p>
      jayshell: {command}: command is only available inside
      an individual project directory
    </p>

    <p>
      Try{' '}
      <span className="terminal__command">
        cd projects
      </span>
      .
    </p>
  </div>
)

const getUnavailableProjectLinkOutput = (
  project: ProjectDetails,
  linkType: string,
): ReactNode => (
  <div className="terminal__result terminal__muted">
    <p>
      {project.name} does not currently have a public{' '}
      {linkType} link.
    </p>
  </div>
)

const getExternalProjectLinkOutput = (
  label: string,
  url: string,
): ReactNode => (
  <div className="terminal__result">
    <p className="terminal__section-title">{label}</p>

    <p>
      Opening:{' '}
      <a
        className="terminal__link"
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        {url}
      </a>
    </p>
  </div>
)


const getAboutOutput = (): ReactNode => (
  <div className="terminal__result terminal__profile">
    <section className="terminal__profile-section">
      <p className="terminal__profile-name">
        {profile.name}
      </p>

      <p className="terminal__profile-headline">
        {profile.headline}
      </p>

      {profile.summary.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Career Focus
      </p>

      <div className="terminal__detail-list">
        {profile.focusAreas.map((area) => (
          <p
            className="terminal__detail-item"
            key={area}
          >
            {area}
          </p>
        ))}
      </div>
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Education
      </p>

      {profile.education.map((education) => (
        <div
          className="terminal__education"
          key={education.institution}
        >
          <p className="terminal__profile-label">
            {education.program}
          </p>

          <p>{education.institution}</p>
          <p className="terminal__muted">
            {education.location}
          </p>

          <div className="terminal__detail-list">
            {education.details.map((detail) => (
              <p
                className="terminal__detail-item"
                key={detail}
              >
                {detail}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Professional Experience
      </p>

        <div className="terminal__detail-list">
          {profile.workExperience.map((experience) => (
            <p
              className="terminal__detail-item"
              key={`${experience.company}-${experience.title}`}
            >
              {experience.title} — {experience.company},{' '}
              {experience.period}
            </p>
          ))}
        </div>
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Hands-on Experience
      </p>

      <div className="terminal__detail-list">
        {profile.handsOnExperience.map((item) => (
          <p
            className="terminal__detail-item"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Technical Skills
      </p>

      <div className="terminal__skills-grid">
        {profile.skills.map((skillGroup) => (
          <div
            className="terminal__skill-group"
            key={skillGroup.category}
          >
            <p className="terminal__profile-label">
              {skillGroup.category}
            </p>

            <p>{skillGroup.skills.join(' · ')}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Contact
      </p>

      <p>
        Email:{' '}
        <a
          className="terminal__link"
          href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
          onClick={(event) => event.stopPropagation()}
        >
          {PORTFOLIO_CONFIG.contactEmail}
        </a>
      </p>

      <p>
        LinkedIn:{' '}
        <a
          className="terminal__link"
          href={PORTFOLIO_CONFIG.linkedInUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          linkedin.com/in/jayasurya-pazhani
        </a>
      </p>

      <p>
        GitHub:{' '}
        <a
          className="terminal__link"
          href={PORTFOLIO_CONFIG.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          github.com/jayasuryapazhani
        </a>
      </p>
    </section>

    <section className="terminal__profile-section">
      <p className="terminal__section-title">
        Resume
      </p>

      <div className="terminal__resume-actions">
        <a
          className="terminal__resume-action"
          href={PORTFOLIO_CONFIG.resumeUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          View Resume
        </a>

        <a
          className="terminal__resume-action"
          href={PORTFOLIO_CONFIG.resumeUrl}
          download="Jayasurya-Pazhani-Resume.pdf"
          onClick={(event) => event.stopPropagation()}
        >
          Download Resume
        </a>
      </div>
    </section>
  </div>
)
const getSkillsOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Technical Skills
      </p>

      <p className="terminal__content-description">
        Technologies and tools used through professional work,
        academic study, and hands-on software projects.
      </p>
    </div>

    <div className="terminal__content-grid">
      {profile.skills.map((skillGroup) => (
        <section
          className="terminal__content-card"
          key={skillGroup.category}
        >
          <p className="terminal__content-card-title">
            {skillGroup.category}
          </p>

          <div className="terminal__tag-list">
            {skillGroup.skills.map((skill) => (
              <span
                className="terminal__tag"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
)
const getExperienceOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Professional Experience
      </p>

      <p className="terminal__content-description">
        Professional software-engineering experience listed from
        most recent to earliest.
      </p>
    </div>

    <div className="terminal__experience-list">
      {profile.workExperience.map((experience) => (
        <article
          className="terminal__content-card terminal__experience-card"
          key={`${experience.company}-${experience.title}`}
        >
          <header className="terminal__experience-header">
            <div>
              <p className="terminal__content-card-title">
                {experience.title}
              </p>

              <p className="terminal__experience-company">
                {experience.company}
              </p>

              <p className="terminal__muted">
                {experience.location}
              </p>
            </div>

            <span className="terminal__experience-period">
              {experience.period}
            </span>
          </header>

          <div className="terminal__detail-list">
            {experience.responsibilities.map(
              (responsibility) => (
                <p
                  className="terminal__detail-item"
                  key={responsibility}
                >
                  {responsibility}
                </p>
              ),
            )}
          </div>
        </article>
      ))}
    </div>

    <section className="terminal__content-card terminal__project-experience">
      <p className="terminal__content-card-title">
        Project and Hands-on Experience
      </p>

      <p className="terminal__content-note">
        Independent development experience from deployed
        applications, browser extensions, testing projects, and
        developer tools.
      </p>

      <div className="terminal__detail-list">
        {profile.handsOnExperience.map((item) => (
          <p
            className="terminal__detail-item"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  </div>
)
const getEducationOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Education
      </p>

      <p className="terminal__content-description">
        Academic background and software-engineering areas of study.
      </p>
    </div>

    {profile.education.map((education) => (
      <section
        className="terminal__content-card"
        key={`${education.institution}-${education.program}`}
      >
        <p className="terminal__content-card-title">
          {education.program}
        </p>

        <div className="terminal__education-meta">
          <p>{education.institution}</p>

          <p className="terminal__muted">
            {education.location}
          </p>
          <p className="terminal__muted">
          {education.period}
        </p>
        </div>

        <div className="terminal__detail-list">
          {education.details.map((detail) => (
            <p
              className="terminal__detail-item"
              key={detail}
            >
              {detail}
            </p>
          ))}
        </div>
      </section>
    ))}
  </div>
)


const getHelpOutput = (
  path: string[],
  onRunCommand: CommandRunner,
): ReactNode => {
  const directory = getDirectoryByPath(path)
  const currentPath = formatVirtualPath(path)
  const childDirectories = Object.keys(
    directory?.children ?? {},
  )
  const currentSection = path[0]
  const currentProject = getProjectByPath(path)

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        Help: {currentPath}
      </p>

      <div className="terminal__help-list">
        <HelpAction
          command="help"
          description="Show help for the current directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="info"
          description="Display information about the current directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="ls"
          description="List subdirectories"
          onRunCommand={onRunCommand}
        />

        {childDirectories.length > 0 && (
          <p>
            <span className="terminal__help-placeholder">
              cd &lt;name&gt;
            </span>

            <span className="terminal__help-description">
              Enter a subdirectory
            </span>
          </p>
        )}

        <HelpAction
          command="cd .."
          label="cd .."
          description="Move to the parent directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="cd ~"
          label="cd ~"
          description="Return to the home directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="pwd"
          description="Display the current path"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="whoami"
          description="Display the current terminal user"
          onRunCommand={onRunCommand}
        />
        <HelpAction
          command="history"
          description="Display commands entered during this session"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="reset"
          description="Clear output and return to the home directory"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="reboot"
          description="Restart JayShell with a new visitor alias"
          onRunCommand={onRunCommand}
        />

        <HelpAction
          command="clear"
          label="clear / cls"
          description="Clear terminal output"
          onRunCommand={onRunCommand}
        />
      </div>

      {currentProject && (
        <>
          <p className="terminal__section-title">
            Project commands
          </p>

          <div className="terminal__help-list">
            <HelpAction
              command="stack"
              description="Display the project technology stack"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="features"
              description="Display key project features"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="testing"
              description="Display testing and validation details"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="architecture"
              description="Display the project architecture"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="lessons"
              description="Display lessons learned"
              onRunCommand={onRunCommand}
            />

            {currentProject.githubUrl && (
              <HelpAction
                command="github"
                description="Open the GitHub repository"
                onRunCommand={onRunCommand}
              />
            )}

            {currentProject.demoUrl && (
              <HelpAction
                command="demo"
                description="Open the live application"
                onRunCommand={onRunCommand}
              />
            )}

            {currentProject.storeUrl && (
              <HelpAction
                command="store"
                description="Open the Chrome Web Store listing"
                onRunCommand={onRunCommand}
              />
            )}
          </div>
        </>
      )}

      {path.length === 0 && (
        <>
          <p className="terminal__section-title">
            Portfolio shortcuts
          </p>

          <div className="terminal__help-list">
            <HelpAction
              command="about"
              description="Display information about Jayasurya"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="skills"
              description="Display technical skills"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="experience"
              description="Display professional experience"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="education"
              description="Display education"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="projects"
              description="Display featured projects"
              onRunCommand={onRunCommand}
            />

            <HelpAction
              command="contact"
              description="Display contact information"
              onRunCommand={onRunCommand}
            />
            <HelpAction
              command="resume"
              description="View or download the resume"
              onRunCommand={onRunCommand}
            />
            <HelpAction
              command="socials"
              description="Display LinkedIn and GitHub"
              onRunCommand={onRunCommand}
            />
          </div>
        </>
      )}

      {path.length > 0 && currentSection && (
        <>
          <p className="terminal__section-title">
            Section shortcut
          </p>

          <div className="terminal__help-list">
            <HelpAction
              command={currentSection}
              description={`Display the main ${currentSection} section`}
              onRunCommand={onRunCommand}
            />
          </div>
        </>
      )}
    </div>
  )
}



const getContactOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Contact
      </p>

      <p className="terminal__content-description">
        Contact Jayasurya regarding software-development roles,
        technical projects, or professional opportunities.
      </p>
    </div>

    <section className="terminal__content-card">
      <p className="terminal__content-card-title">
        Email
      </p>

      <p>
        <a
          className="terminal__link"
          href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
          onClick={(event) => event.stopPropagation()}
        >
          {PORTFOLIO_CONFIG.contactEmail}
        </a>
      </p>

      <div className="terminal__contact-actions">
        <a
          className="terminal__resume-action"
          href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
          onClick={(event) => event.stopPropagation()}
        >
          Send Email
        </a>
      </div>
    </section>
  </div>
)

const getSocialsOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Social Profiles
      </p>

      <p className="terminal__content-description">
        Professional profiles, projects, repositories, and
        development activity.
      </p>
    </div>

    <div className="terminal__content-grid">
      <section className="terminal__content-card">
        <p className="terminal__content-card-title">
          LinkedIn
        </p>

        <p className="terminal__content-note">
          Professional experience, education, and career updates.
        </p>

        <a
          className="terminal__link"
          href={PORTFOLIO_CONFIG.linkedInUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          linkedin.com/in/jayasurya-pazhani
        </a>
      </section>

      <section className="terminal__content-card">
        <p className="terminal__content-card-title">
          GitHub
        </p>

        <p className="terminal__content-note">
          Source code, project history, branches, and technical
          documentation.
        </p>

        <a
          className="terminal__link"
          href={PORTFOLIO_CONFIG.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          github.com/jayasuryapazhani
        </a>
      </section>
    </div>
  </div>
)

const getResumeOutput = (): ReactNode => (
  <div className="terminal__result terminal__portfolio-output">
    <div className="terminal__content-heading">
      <p className="terminal__section-title">
        Resume
      </p>

      <p className="terminal__content-description">
        View the resume in the browser or download a PDF copy.
      </p>
    </div>

    <section className="terminal__content-card">
      <p className="terminal__content-card-title">
        Jayasurya Pazhani
      </p>

      <p className="terminal__content-note">
        Software Engineer | MEng Software Engineering Student
      </p>

      <div className="terminal__resume-actions">
        <a
          className="terminal__resume-action"
          href={PORTFOLIO_CONFIG.resumeUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          View Resume
        </a>

        <a
          className="terminal__resume-action"
          href={PORTFOLIO_CONFIG.resumeUrl}
          download="Jayasurya-Pazhani-Resume.pdf"
          onClick={(event) => event.stopPropagation()}
        >
          Download Resume
        </a>
      </div>
    </section>
  </div>
)

const getProjectsOutput = (
  onRunCommand: CommandRunner,
): ReactNode => {
  const projects = getAllProjects()

  return (
    <div className="terminal__result terminal__portfolio-output">
      <div className="terminal__content-heading">
        <p className="terminal__section-title">
          Projects
        </p>

        <p className="terminal__content-description">
          Selected software-engineering projects covering
          full-stack development, browser extensions, backend APIs,
          testing, automation, and developer tooling.
        </p>
      </div>

      <div className="terminal__projects-grid">
        {projects.map((project) => {
          const projectDirectory =
            `${PORTFOLIO_CONFIG.homeDirectory}/projects/` +
            project.slug

          return (
            <article
              className="terminal__project-card"
              key={project.slug}
            >
              <header className="terminal__project-card-header">
                <div>
                  <p className="terminal__project-card-title">
                    {project.name}
                  </p>

                  <p className="terminal__project-card-category">
                    {project.category}
                  </p>
                </div>

                <span className="terminal__project-status">
                  {project.status}
                </span>
              </header>

              <div className="terminal__project-summary">
                {project.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="terminal__tag-list">
                {project.stack.slice(0, 7).map((technology) => (
                  <span
                    className="terminal__tag"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}

                {project.stack.length > 7 && (
                  <span className="terminal__tag terminal__tag--muted">
                    +{project.stack.length - 7} more
                  </span>
                )}
              </div>

              <div className="terminal__project-actions">
                <TerminalAction
                  command={`cd ${projectDirectory}`}
                  onRunCommand={onRunCommand}
                  className="terminal__project-action"
                >
                  Open in Terminal
                </TerminalAction>

                {project.githubUrl && (
                  <a
                    className="terminal__project-action"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    GitHub
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    className="terminal__project-action"
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    Live Demo
                  </a>
                )}

                {project.storeUrl && (
                  <a
                    className="terminal__project-action"
                    href={project.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    Chrome Store
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

const getCommandHistoryOutput = (
  commandHistory: string[],
): ReactNode => {
  if (commandHistory.length === 0) {
    return (
      <div className="terminal__result terminal__muted">
        <p>No commands have been entered in this session.</p>
      </div>
    )
  }

  return (
    <div className="terminal__result">
      <p className="terminal__section-title">
        Command History
      </p>

      <div className="terminal__command-history-list">
        {commandHistory.map((command, index) => (
          <p key={`${index}-${command}`}>
            <span className="terminal__history-number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span>{command}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

const executeCommand = (
  commandInput: string,
  visitorAlias: string,
  currentPath: string[],
  commandHistory: string[],
  onRunCommand: CommandRunner,
): CommandResult => {
  const commandParts = commandInput.trim().split(/\s+/)
  const commandName = commandParts[0].toLowerCase()
  const commandArguments = commandParts.slice(1)
  const currentProject = getProjectByPath(currentPath)
const suggestedCommand =
  getSuggestedCommand(commandName)

  switch (commandName) {
    case 'help':
      return {
        output: getHelpOutput(
          currentPath,
          onRunCommand,
        ),
      }

      case 'info':
        if (
          currentPath.length === 1 &&
          currentPath[0] === 'projects'
        ) {
          return {
            output: getProjectsOutput(onRunCommand),
          }
        }

        return {
          output: currentProject
            ? getProjectOverviewOutput(currentProject)
            : getDirectoryInfoOutput(
                currentPath,
                onRunCommand,
              ),
        }

    case 'ls':
      return {
        output: getListOutput(
          currentPath,
          onRunCommand,
        ),
      }

    case 'pwd':
      return {
        output: (
          <div className="terminal__result">
            <p>{formatVirtualPath(currentPath)}</p>
          </div>
        ),
      }

    case 'whoami':
      return {
        output: (
          <div className="terminal__result">
            <p>{createTerminalUsername(visitorAlias)}</p>
            <p>
              Current session alias: {visitorAlias}
            </p>
          </div>
        ),
      }

    case 'cd': {
      if (commandArguments.length > 1) {
        return {
          output: (
            <div className="terminal__result terminal__error">
              <p>cd: too many arguments</p>
            </div>
          ),
        }
      }

      const targetDirectory =
        commandArguments[0] ?? '~'

      const nextPath = resolveDirectoryPath(
        targetDirectory,
        currentPath,
      )

      if (!nextPath) {
        return {
          output: (
            <div className="terminal__result terminal__error">
              <p>
                jayshell: cd: {targetDirectory}: No such
                directory
              </p>
            </div>
          ),
        }
      }

      return {
        output: null,
        nextPath,
      }
    }

case 'about':
  return {
    output: getAboutOutput(),
  }

      case 'skills':
        return {
          output: getSkillsOutput(),
        }

        case 'experience':
          return {
            output: getExperienceOutput(),
          }

        case 'education':
          return {
            output: getEducationOutput(),
          }

              case 'projects':
                return {
                  output: getProjectsOutput(onRunCommand),
                }

    case 'contact':
      return {
        output: getContactOutput(),
      }

    case 'socials':
      return {
        output: getSocialsOutput(),
      }
      case 'resume':
        return {
          output: getResumeOutput(),
        }
    case 'stack':
      return {
        output: currentProject
          ? getProjectDetailOutput(
              `${currentProject.name}: Technology Stack`,
              currentProject.stack,
            )
          : getProjectCommandError('stack'),
      }

    case 'features':
      return {
        output: currentProject
          ? getProjectDetailOutput(
              `${currentProject.name}: Features`,
              currentProject.features,
            )
          : getProjectCommandError('features'),
      }

    case 'testing':
      return {
        output: currentProject
          ? getProjectDetailOutput(
              `${currentProject.name}: Testing`,
              currentProject.testing,
            )
          : getProjectCommandError('testing'),
      }

    case 'architecture':
      return {
        output: currentProject
          ? getProjectDetailOutput(
              `${currentProject.name}: Architecture`,
              currentProject.architecture,
            )
          : getProjectCommandError('architecture'),
      }

    case 'lessons':
      return {
        output: currentProject
          ? getProjectDetailOutput(
              `${currentProject.name}: Lessons Learned`,
              currentProject.lessons,
            )
          : getProjectCommandError('lessons'),
      }

    case 'github':
      if (!currentProject) {
        return {
          output: getProjectCommandError('github'),
        }
      }

      if (!currentProject.githubUrl) {
        return {
          output: getUnavailableProjectLinkOutput(
            currentProject,
            'GitHub repository',
          ),
        }
      }

      return {
        output: getExternalProjectLinkOutput(
          `${currentProject.name}: GitHub`,
          currentProject.githubUrl,
        ),
        externalUrl: currentProject.githubUrl,
      }

    case 'demo':
      if (!currentProject) {
        return {
          output: getProjectCommandError('demo'),
        }
      }

      if (!currentProject.demoUrl) {
        return {
          output: getUnavailableProjectLinkOutput(
            currentProject,
            'live demo',
          ),
        }
      }

      return {
        output: getExternalProjectLinkOutput(
          `${currentProject.name}: Live Demo`,
          currentProject.demoUrl,
        ),
        externalUrl: currentProject.demoUrl,
      }

    case 'store':
      if (!currentProject) {
        return {
          output: getProjectCommandError('store'),
        }
      }

      if (!currentProject.storeUrl) {
        return {
          output: getUnavailableProjectLinkOutput(
            currentProject,
            'store',
          ),
        }
      }

      return {
        output: getExternalProjectLinkOutput(
          `${currentProject.name}: Chrome Web Store`,
          currentProject.storeUrl,
        ),
        externalUrl: currentProject.storeUrl,
      }

        case 'history':
        return {
          output: getCommandHistoryOutput(commandHistory),
        }                        
        case 'reset':
          return {
            output: null,
            reset: true,
          }

        case 'reboot':
          return {
            output: null,
            reboot: true,
          }

        case 'clear':
        case 'cls':
          return {
            output: null,
            clear: true,
          }

      default:
        return {
          output: (
            <div className="terminal__result terminal__error">
              <p>
                jayshell: command not found: {commandInput}
              </p>

              {suggestedCommand ? (
                <p className="terminal__suggestion-line">
                  Did you mean:{' '}
                  <TerminalAction
                    command={suggestedCommand}
                    onRunCommand={onRunCommand}
                    className="terminal__suggestion-command"
                  >
                    {suggestedCommand}
                  </TerminalAction>
                  ?
                </p>
              ) : (
                <p>
                  Type{' '}
                  <span className="terminal__command">
                    help
                  </span>{' '}
                  to see available commands.
                </p>
              )}
            </div>
          ),
        }
  }
}

function App() {
const [visitorAlias, setVisitorAlias] = useState(
  () => generateVisitorAlias(),
)

  const [startupPhase, setStartupPhase] =
  useState<StartupPhase>('booting')

const [typedIntroduction, setTypedIntroduction] =
  useState('')


  const [commandInput, setCommandInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<
    string[]
  >([])
  const [
    commandHistoryIndex,
    setCommandHistoryIndex,
  ] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [terminalEntries, setTerminalEntries] = useState<
    TerminalEntry[]
  >([])

  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const commandInputRef = useRef<HTMLInputElement>(null)
  const entryIdRef = useRef(0)
  const commandHistoryRef = useRef<string[]>([])
  const visitorAliasRef = useRef(visitorAlias)
  const currentPathRef = useRef<string[]>([])
  const currentPromptRef = useRef('')
  const commandRunnerRef = useRef<CommandRunner>(
    () => undefined,
  )

  const terminalUsername =
    createTerminalUsername(visitorAlias)

  const currentPrompt =
    `${terminalUsername}@${PORTFOLIO_CONFIG.hostName}:` +
    `${formatPromptPath(currentPath)}$`

    const introductionText = [
  `Hello, ${visitorAlias}.`,
  `Welcome to ${PORTFOLIO_CONFIG.appName}.`,
  `Explore the interactive terminal portfolio of ${PORTFOLIO_CONFIG.ownerName}.`,
    ].join('\n')
useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion) {
    setTypedIntroduction(introductionText)
    setStartupPhase('ready')
    return
  }

  let characterIndex = 0
  let typingTimer: number | undefined

  const bootTimer = window.setTimeout(() => {
    setStartupPhase('typing')

    typingTimer = window.setInterval(() => {
      characterIndex += 1

      setTypedIntroduction(
        introductionText.slice(0, characterIndex),
      )

      if (characterIndex >= introductionText.length) {
        if (typingTimer !== undefined) {
          window.clearInterval(typingTimer)
        }

        setStartupPhase('ready')
      }
    }, 28)
  }, 2000)

  return () => {
    window.clearTimeout(bootTimer)

    if (typingTimer !== undefined) {
      window.clearInterval(typingTimer)
    }
  }
}, [introductionText])

  useEffect(() => {
    visitorAliasRef.current = visitorAlias
    currentPathRef.current = currentPath
    currentPromptRef.current = currentPrompt
  }, [visitorAlias, currentPath, currentPrompt])

useEffect(() => {
  const terminalBody = terminalBodyRef.current

  if (terminalBody) {
    terminalBody.scrollTop =
      terminalBody.scrollHeight
  }

  if (startupPhase === 'ready') {
    commandInputRef.current?.focus()
  }
}, [startupPhase, terminalEntries, currentPath])

  const runCommandFromOutput = useCallback(
    (command: string) => {
      commandRunnerRef.current(command)
    },
    [],
  )

  const runCommand = useCallback(
    (rawCommand: string) => {
      const activeVisitorAlias =
        visitorAliasRef.current
      const cleanedCommand = rawCommand.trim()

      if (!cleanedCommand) {
        return
      }

      const activePath = currentPathRef.current
      const activePrompt = currentPromptRef.current

        const nextCommandHistory = [
          ...commandHistoryRef.current,
          cleanedCommand,
        ].slice(-100)

        commandHistoryRef.current = nextCommandHistory
        setCommandHistory(nextCommandHistory)
        setCommandHistoryIndex(null)

        const commandResult = executeCommand(
          cleanedCommand,
          activeVisitorAlias,
          activePath,
          nextCommandHistory,
          runCommandFromOutput,
        )

      if (commandResult.externalUrl) {
        window.open(
          commandResult.externalUrl,
          '_blank',
          'noopener,noreferrer',
        )
      }

      if (commandResult.clear) {
        setTerminalEntries([])
        setCommandInput('')
        setCommandHistoryIndex(null)
        entryIdRef.current = 0
        return
      }

      if (commandResult.reset) {
        setTerminalEntries([])
        setCurrentPath([])
        setCommandInput('')
        setCommandHistoryIndex(null)
        entryIdRef.current = 0
        return
      }

      if (commandResult.reboot) {
        const newVisitorAlias = generateVisitorAlias()

        setVisitorAlias(newVisitorAlias)
        visitorAliasRef.current = newVisitorAlias

        setTerminalEntries([])
        setCurrentPath([])
        currentPathRef.current = []

        setCommandInput('')
        setCommandHistory([])
        commandHistoryRef.current = []
        setCommandHistoryIndex(null)

        setTypedIntroduction('')
        setStartupPhase('booting')

        entryIdRef.current = 0
        return
      }

      entryIdRef.current += 1

      const newEntry: TerminalEntry = {
        id: entryIdRef.current,
        command: cleanedCommand,
        prompt: activePrompt,
        output: commandResult.output,
      }

      setTerminalEntries((currentEntries) => [
        ...currentEntries,
        newEntry,
      ])

      if (commandResult.nextPath) {
        setCurrentPath(commandResult.nextPath)
      }

      setCommandInput('')
    },
    [runCommandFromOutput],
  )

  useEffect(() => {
    commandRunnerRef.current = runCommand
  }, [runCommand])

  const handleCommandSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    runCommand(commandInput)
  }

  const handleCommandKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()

      if (commandHistory.length === 0) {
        return
      }

      const nextIndex =
        commandHistoryIndex === null
          ? commandHistory.length - 1
          : Math.max(0, commandHistoryIndex - 1)

      setCommandHistoryIndex(nextIndex)
      setCommandInput(commandHistory[nextIndex])

      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (commandHistoryIndex === null) {
        return
      }

      const nextIndex = commandHistoryIndex + 1

      if (nextIndex >= commandHistory.length) {
        setCommandHistoryIndex(null)
        setCommandInput('')
        return
      }

      setCommandHistoryIndex(nextIndex)
      setCommandInput(commandHistory[nextIndex])

      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()

      const autocompleteValue = getAutocompleteValue(
        commandInput,
        currentPath,
      )

      if (autocompleteValue) {
        setCommandInput(autocompleteValue)
        setCommandHistoryIndex(null)
      }
    }
  }

const focusCommandInput = () => {
  if (startupPhase === 'ready') {
    commandInputRef.current?.focus()
  }
}

  return (
    <main className="app-shell">
      <section
        className="terminal"
        aria-label="JayShell interactive terminal portfolio"
      >
          <TerminalHeader
            title={
              `${terminalUsername}@${PORTFOLIO_CONFIG.hostName}:` +
              formatPromptPath(currentPath)
            }
          />

        <div
          ref={terminalBodyRef}
          className="terminal__body"
          onClick={focusCommandInput}
        >
          <div className="terminal__intro">
            <p className="terminal__brand">
              {PORTFOLIO_CONFIG.appName.toUpperCase()} v
              {PORTFOLIO_CONFIG.version}
            </p>

            <p>Interactive terminal portfolio</p>

            <p>
              Admin:{' '}
              <span className="terminal__highlight">
                {PORTFOLIO_CONFIG.ownerName}
              </span>
            </p>
          </div>

            <div
              className={[
                'terminal__workspace',
                startupPhase === 'ready'
                  ? 'terminal__workspace--ready'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="terminal__main">
                <div className="terminal__session">
                  <TerminalStartup
                    phase={startupPhase}
                    typedIntroduction={typedIntroduction}
                    onRunCommand={runCommandFromOutput}
                  />

                  {startupPhase === 'ready' && (
                    <>
                      <TerminalHistory entries={terminalEntries} />

                          <TerminalPrompt
                            currentPrompt={currentPrompt}
                            commandInput={commandInput}
                            commandInputRef={commandInputRef}
                            onSubmit={handleCommandSubmit}
                            onChange={(event) => {
                              setCommandInput(event.target.value)
                              setCommandHistoryIndex(null)
                            }}
                            onKeyDown={handleCommandKeyDown}
                          />
                    </>
                  )}
                </div>
              </div>

              {startupPhase === 'ready' && (
                <QuickNavigation
                  onRunCommand={runCommandFromOutput}
                />
              )}
            </div>
        </div>
      </section>
    </main>
  )
}

export default App
export type VirtualDirectory = {
  name: string
  title: string
  description: string[]
  children?: Record<string, VirtualDirectory>
}

export const virtualFileSystem: VirtualDirectory = {
  name: 'jayasurya',
  title: 'JayShell Home',
  description: [
    'Welcome to the virtual home directory of Jayasurya Pazhani.',
    'Use ls to list available sections and cd <directory> to explore them.',
  ],
  children: {
    about: {
      name: 'about',
      title: 'About Jayasurya',
      description: [
        'Jayasurya Pazhani is a software engineer and MEng Software Engineering student at Concordia University.',
        'He is interested in software development, backend systems, APIs, testing, automation, and practical developer tools.',
      ],
    },

    skills: {
      name: 'skills',
      title: 'Technical Skills',
      description: [
        'Languages: JavaScript, TypeScript, Java, Python, SQL, HTML, and CSS.',
        'Technologies: React, Node.js, Express, Spring Boot, REST APIs, PostgreSQL, Git, Docker, Postman, and automated testing tools.',
      ],
    },

    experience: {
      name: 'experience',
      title: 'Professional Experience',
      description: [
        'Professional experience includes desktop application development, debugging, issue investigation, code reviews, testing, and cross-functional collaboration.',
        'Detailed work experience and accomplishments will be added in a later section.',
      ],
    },

    education: {
      name: 'education',
      title: 'Education',
      description: [
        'Master of Engineering in Software Engineering at Concordia University.',
        'Relevant areas include software architecture, programming, testing, project management, and software development processes.',
      ],
    },

    projects: {
      name: 'projects',
      title: 'Software Projects',
      description: [
        'This directory contains selected software engineering and developer-tool projects.',
        'Use ls to list projects and cd <project> to open one.',
      ],
      children: {
        shrtn: {
          name: 'shrtn',
          title: 'Shrtn',
          description: [
            'A Chrome extension and backend service for shortening URLs and generating shareable QR codes.',
            'Built with React, Node.js, Express, PostgreSQL, Neon, Chrome Extension Manifest V3, and Vitest.',
          ],
        },

        supportbot: {
          name: 'supportbot',
          title: 'SupportBot',
          description: [
            'A chatbot platform created to learn backend development, API testing, database testing, automation, and CI/CD.',
            'The project uses Java, Spring Boot, REST APIs, Postman, Rest Assured, Selenium, TestNG, SQL, Jenkins, and Docker.',
          ],
        },

        'dev-monitor': {
          name: 'dev-monitor',
          title: 'Developer Monitor',
          description: [
            'A lightweight monitoring dashboard designed for a secondary developer display.',
            'It is intended to display system activity such as CPU, memory, disk usage, network speed, latency, logs, and service status.',
          ],
        },

        'jay-shell': {
          name: 'jay-shell',
          title: 'JayShell',
          description: [
            'An interactive terminal-style portfolio built with React, TypeScript, and Vite.',
            'It includes terminal commands, virtual directories, contextual help, project navigation, and responsive terminal styling.',
          ],
        },
      },
    },

    contact: {
      name: 'contact',
      title: 'Contact',
      description: [
        'Use the contact command to view email information.',
        'Professional inquiries and software-development opportunities are welcome.',
      ],
    },

    socials: {
      name: 'socials',
      title: 'Social Profiles',
      description: [
        'Use the socials command to view LinkedIn and GitHub.',
      ],
    },
  },
}

export const getDirectoryByPath = (
  path: string[],
): VirtualDirectory | null => {
  let currentDirectory = virtualFileSystem

  for (const directoryName of path) {
    const nextDirectory =
      currentDirectory.children?.[directoryName]

    if (!nextDirectory) {
      return null
    }

    currentDirectory = nextDirectory
  }

  return currentDirectory
}
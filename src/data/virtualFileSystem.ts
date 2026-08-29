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
            'A production URL shortener and Manifest V3 extension for persistent links, QR codes, redirect analytics, and browser context-menu actions.',
            'Version 1.1.0 also includes local recent-link history, duplicate detection, result restoration, and resilient API handling.',
          ],
        },

        siptime: {
          name: 'siptime',
          title: 'SipTime',
          description: [
            'A privacy-focused hydration reminder extension published for Chrome and Brave.',
            'It supports interval and fixed schedules, quiet hours, snoozing, local settings, browser notifications, and a responsive Vercel landing page.',
          ],
        },

        recordock: {
          name: 'recordock',
          title: 'Recordock',
          description: [
            'A local-first screen recorder for Chrome and the web that captures tabs, windows, or monitors with optional source audio.',
            'The extension uses a service worker and offscreen document so recording continues after the popup closes, while completed recordings stay local.',
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

        'slot-machine-pixijs': {
          name: 'slot-machine-pixijs',
          title: 'PixiJS Slot Machine',
          description: [
            'A responsive 5-by-3 slot machine browser game rendered using PixiJS.',
            'It includes animated reels, motion blur, dynamic symbols, payline evaluation, payouts, and winning-symbol highlights.',
          ],
        },

        warzone: {
          name: 'warzone',
          title: 'Warzone',
          description: [
            'A Java command-line implementation of the Warzone strategy game developed as an academic team project.',
            'It includes map handling, players, game phases, orders, computer-player strategies, tournament execution, Maven, and JUnit testing.',
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

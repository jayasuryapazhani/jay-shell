export type ProjectDetails = {
  slug: string
  name: string
  category: string
  status: string
  summary: string[]
  stack: string[]
  features: string[]
  testing: string[]
  architecture: string[]
  lessons: string[]
  githubUrl?: string
  demoUrl?: string
  storeUrl?: string
}

const projectsBySlug: Record<string, ProjectDetails> = {
  shrtn: {
    slug: 'shrtn',
    name: 'Shrtn',
    category: 'Full-stack application and Chrome extension',
    status: 'Published',
    summary: [
      'A URL-shortening service and Chrome extension that generates compact links and shareable QR codes.',
      'The extension can detect the active browser tab, send the URL to the backend API, and return a shortened URL.',
    ],
    stack: [
      'React',
      'Vite',
      'JavaScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Neon',
      'Railway',
      'Chrome Extension Manifest V3',
      'Vitest',
      'Supertest',
      'GitHub Actions',
    ],
    features: [
      'Detect the active browser tab URL',
      'Create shortened URLs',
      'Redirect shortened links',
      'Generate and download QR codes',
      'Copy shortened URLs to the clipboard',
      'Persist links using PostgreSQL',
      'Validate HTTP and HTTPS URLs',
      'Reject malformed JSON requests',
      'Apply security headers and request rate limiting',
      'Refresh link analytics',
    ],
    testing: [
      'Backend API tests using Vitest and Supertest',
      'Validation tests for accepted and rejected URLs',
      'Invalid JSON request tests',
      'Health endpoint tests',
      'Redirect behaviour tests',
      'PostgreSQL repository tests',
      'Extension service tests',
      'Production build and lint validation',
    ],
    architecture: [
      'React Chrome extension popup',
      'Express REST API',
      'PostgreSQL persistence layer',
      'Short-code generation service',
      'QR-code generation service',
      'Railway deployment',
      'Neon serverless PostgreSQL database',
    ],
    lessons: [
      'Designing versioned REST API endpoints',
      'Connecting a browser extension to a remote backend',
      'Migrating from in-memory storage to PostgreSQL',
      'Managing environment variables securely',
      'Testing APIs and extension services',
      'Publishing a Manifest V3 Chrome extension',
      'Deploying a full-stack application',
    ],
    githubUrl: 'https://github.com/jayasuryapazhani/shrtn',
    demoUrl: 'https://shrtn.up.railway.app',
    storeUrl:
      'https://chromewebstore.google.com/detail/shrtn/adodmibgcbmnhdagfkipjpjfkeaalfim',
  },

  supportbot: {
    slug: 'supportbot',
    name: 'SupportBot',
    category: 'Backend, API testing, and automation platform',
    status: 'In development',
    summary: [
      'A chatbot project built to learn backend development and quality engineering through a complete software development lifecycle.',
      'Each implementation step includes execution, validation, expected output, failure checks, and Git-based development.',
    ],
    stack: [
      'Java',
      'Spring Boot',
      'Maven',
      'REST APIs',
      'Postman',
      'Rest Assured',
      'Selenium',
      'TestNG',
      'SQL',
      'Jenkins',
      'Docker',
      'Jira',
      'YAML',
    ],
    features: [
      'Spring Boot API foundation',
      'Application health endpoint',
      'Intent-detection API planning',
      'Database integration planning',
      'Postman API collections',
      'Rest Assured automation',
      'Selenium smoke testing',
      'Jenkins CI pipeline',
      'Docker-based local environment',
    ],
    testing: [
      'Maven unit-test execution',
      'HTTP status-code validation',
      'Response content-type validation',
      'Response-body validation',
      'API response-time measurement',
      'Positive and negative API scenarios',
      'Planned database and UI automation',
    ],
    architecture: [
      'Spring Boot API service',
      'Intent-processing service',
      'Database layer',
      'Postman and Rest Assured test layers',
      'Selenium UI automation layer',
      'Jenkins continuous-integration pipeline',
      'Docker development environment',
    ],
    lessons: [
      'Building a Spring Boot service from the foundation',
      'Validating API responses beyond status codes',
      'Organizing tests by testing layer',
      'Applying acceptance criteria before merging',
      'Connecting Jira tasks to Git branches and commits',
    ],
  },

  'dev-monitor': {
    slug: 'dev-monitor',
    name: 'Developer Monitor',
    category: 'System-monitoring dashboard',
    status: 'Prototype',
    summary: [
      'A lightweight dashboard designed to run on a secondary display while development work is in progress.',
      'The dashboard focuses on passive monitoring rather than requiring continuous interaction.',
    ],
    stack: [
      'Node.js',
      'JavaScript',
      'HTML',
      'CSS',
      'System monitoring APIs',
      'Local HTTP server',
    ],
    features: [
      'CPU usage monitoring',
      'Memory usage monitoring',
      'Disk usage monitoring',
      'Network upload and download speed',
      'Latency monitoring',
      'Application log display',
      'Local service status display',
      'Dedicated development port',
    ],
    testing: [
      'Local server startup validation',
      'Port availability checks',
      'System metric output validation',
      'Browser rendering verification',
    ],
    architecture: [
      'Local monitoring service',
      'System-metric collectors',
      'Browser-based dashboard',
      'Periodic metric refresh',
    ],
    lessons: [
      'Using a secondary display for passive developer monitoring',
      'Reading operating-system metrics',
      'Managing local development ports',
      'Designing information-dense interfaces for small screens',
    ],
  },

  'jay-shell': {
    slug: 'jay-shell',
    name: 'JayShell',
    category: 'Interactive developer portfolio',
    status: 'In development',
    summary: [
      'A terminal-style portfolio that allows visitors to explore professional information using simulated shell commands.',
      'The interface includes a virtual filesystem, contextual help, keyboard navigation, and clickable terminal commands.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'CSS',
      'React hooks',
      'Virtual filesystem modelling',
      'Git',
    ],
    features: [
      'Personalized visitor greeting',
      'Terminal-style command prompt',
      'Virtual directory navigation',
      'Context-specific help',
      'Command history using arrow keys',
      'Tab-based autocomplete',
      'Clickable commands and directories',
      'Responsive terminal layout',
      'Accessible keyboard interaction',
    ],
    testing: [
      'Oxlint static analysis',
      'TypeScript compilation',
      'Vite production builds',
      'Manual command execution tests',
      'Directory-navigation regression tests',
      'Keyboard-history tests',
      'Autocomplete tests',
    ],
    architecture: [
      'React terminal interface',
      'Command parser',
      'Command execution layer',
      'Virtual filesystem data model',
      'Terminal-history state',
      'Project-information data layer',
    ],
    lessons: [
      'Modelling terminal behaviour in React',
      'Managing interactive command history',
      'Separating portfolio content from UI logic',
      'Implementing accessible keyboard navigation',
      'Preserving command prompts with historical state',
    ],
  },
}

export const getProjectByPath = (
  path: string[],
): ProjectDetails | null => {
  if (path.length !== 2 || path[0] !== 'projects') {
    return null
  }

  return projectsBySlug[path[1]] ?? null
}

export const getAllProjects = (): ProjectDetails[] =>
  Object.values(projectsBySlug)
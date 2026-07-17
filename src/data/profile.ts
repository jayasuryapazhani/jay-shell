export type SkillGroup = {
  category: string
  skills: string[]
}

export const profile = {
  name: 'Jayasurya Pazhani',

  headline:
    'Software Engineer | MEng Software Engineering Student',

  summary: [
    'Software engineer with hands-on experience in application development, debugging, API development, testing, automation, and developer tooling.',
    'Currently completing a Master of Engineering in Software Engineering at Concordia University while building practical full-stack, backend, browser-extension, and quality-engineering projects.',
  ],

  focusAreas: [
    'Software development',
    'Backend development and REST APIs',
    'Frontend development',
    'Software testing and automation',
    'Database integration',
    'Developer tools and productivity systems',
  ],

  education: [
    {
      institution: 'Concordia University',
      program: 'Master of Engineering in Software Engineering',
      location: 'Montreal, Quebec, Canada',
      details: [
        'Software architecture and design',
        'Software development processes',
        'Programming and system implementation',
        'Software testing and quality engineering',
        'Project and risk management',
      ],
    },
  ],

  professionalExperience: [
    'Desktop application feature development',
    'Software defect investigation and root-cause analysis',
    'Debugging application behaviour across operating systems',
    'Implementing and validating production software changes',
    'Collaborating through merge requests and code reviews',
    'Creating test plans and verifying functional requirements',
    'Working with cross-functional engineering and QA teams',
  ],

  handsOnExperience: [
    'Building React and TypeScript user interfaces',
    'Developing Node.js and Express REST APIs',
    'Creating Java and Spring Boot backend foundations',
    'Integrating PostgreSQL databases',
    'Building and publishing Chrome extensions',
    'Testing APIs with Postman, Vitest, Supertest, and Rest Assured',
    'Learning UI automation with Selenium and TestNG',
    'Using Git branches, commits, pull requests, and GitHub',
    'Working with Docker, Jenkins, and CI/CD fundamentals',
    'Deploying applications and connecting cloud databases',
  ],

  skills: [
    {
      category: 'Languages',
      skills: [
        'JavaScript',
        'TypeScript',
        'Java',
        'Python',
        'SQL',
        'HTML',
        'CSS',
      ],
    },
    {
      category: 'Frontend',
      skills: [
        'React',
        'Vite',
        'Responsive Design',
        'Chrome Extension Manifest V3',
      ],
    },
    {
      category: 'Backend',
      skills: [
        'Node.js',
        'Express',
        'Spring Boot',
        'REST APIs',
      ],
    },
    {
      category: 'Databases',
      skills: [
        'PostgreSQL',
        'Neon',
        'SQL fundamentals',
      ],
    },
    {
      category: 'Testing',
      skills: [
        'Postman',
        'Vitest',
        'Supertest',
        'Rest Assured',
        'Selenium',
        'TestNG',
        'API testing',
        'Manual testing',
      ],
    },
    {
      category: 'Tools',
      skills: [
        'Git',
        'GitHub',
        'Docker',
        'Jenkins',
        'Jira',
        'VS Code',
        'IntelliJ IDEA',
        'PowerShell',
      ],
    },
  ],
} as const
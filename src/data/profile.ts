export type SkillGroup = {
  category: string
  skills: string[]
}

export type EducationEntry = {
  institution: string
  program: string
  location: string
  period: string
  details: string[]
}

export type WorkExperience = {
  title: string
  company: string
  location: string
  period: string
  responsibilities: string[]
}

export type Profile = {
  name: string
  headline: string
  summary: string[]
  focusAreas: string[]
  education: EducationEntry[]
  workExperience: WorkExperience[]
  handsOnExperience: string[]
  skills: SkillGroup[]
}

export const profile: Profile = {
  name: 'Jayasurya Pazhani',

  headline:
    'Software Engineer | Full-Stack, Backend, and Quality Engineering',

  summary: [
    'Software engineer with professional industry experience developing, supporting, testing, and troubleshooting enterprise applications.',
    'Hands-on experience building frontend, backend, browser-extension, and cloud-deployed solutions using JavaScript, TypeScript, React, Angular, Node.js, Express, Java, SQL, REST APIs, and PostgreSQL.',
    'Experienced in API integration, automated testing, CI/CD, debugging, application security controls, technical documentation, and Agile software delivery.',
  ],

  focusAreas: [
    'Full-stack software development',
    'Backend services and REST APIs',
    'Frontend development with React and TypeScript',
    'Software testing and quality engineering',
    'Database integration and persistence',
    'Browser-extension development',
    'Developer tools and productivity systems',
  ],

  education: [
    {
      institution: 'Concordia University',
      program: 'Master of Engineering in Software Engineering',
      location: 'Montreal, Quebec, Canada',
      period: 'January 2024 - June 2025',
      details: [
        'Software architecture and design',
        'Advanced programming practices',
        'Software development processes',
        'Software testing and quality engineering',
        'Software project and risk management',
      ],
    },

    {
      institution: 'SRM University',
      program: 'Bachelor of Science in Computer Science',
      location: 'Chennai, Tamil Nadu, India',
      period: 'August 2016 - May 2019',
      details: [
        'Computer programming fundamentals',
        'Object-oriented programming',
        'Database management systems',
        'Web development',
        'Software engineering fundamentals',
      ],
    },
  ],

  workExperience: [
    {
      title: 'Frontend Engineer Intern',
      company: 'Lump Financial Services',
      location: 'Montreal, Quebec, Canada',
      period: 'July 2024 - August 2024',
      responsibilities: [
        'Developed responsive web pages and reusable frontend components using HTML5, CSS3, JavaScript, TypeScript, React, Node.js, and REST APIs.',
        'Translated Figma designs and product requirements into functional user interfaces focused on clarity, usability, and mobile responsiveness.',
        'Connected frontend screens with backend API responses, supported form handling, validated user input, and improved backend-connected user flows.',
        'Debugged user-interface issues, layout inconsistencies, and API integration errors using browser developer tools, manual testing, and iterative fixes.',
        'Collaborated with the team in a startup environment by clarifying requirements, documenting implementation details, and supporting Agile feature delivery.',
      ],
    },

    {
      title: 'Software Engineer - SAP',
      company: 'Cognizant',
      location: 'Chennai, Tamil Nadu, India',
      period: 'May 2023 - March 2024',
      responsibilities: [
        'Supported an SAP enterprise project through application enhancements, defect resolution, testing, technical documentation, and release support.',
        'Collaborated with functional consultants, developers, and QA teams to understand requirements, investigate issues, and support stable application workflows.',
        'Analyzed application issues by reviewing logs, validating data flows, checking system behaviour, and documenting root-cause findings.',
        'Contributed to small backend service updates and integration tasks using Java, SQL, REST APIs, and enterprise application tools.',
        'Participated in Agile ceremonies, sprint discussions, test validation, status reporting, and production-release coordination.',
      ],
    },

    {
      title: 'Web Developer Intern',
      company: 'SpaceZee',
      location: 'Chennai, Tamil Nadu, India',
      period: 'June 2022 - August 2022',
      responsibilities: [
        'Built and maintained responsive website pages using HTML, CSS, JavaScript, PHP, WordPress, and MySQL.',
        'Updated website content, resolved user-interface issues, improved layouts, and supported frontend enhancements for business-facing pages.',
        'Tested website functionality across browsers, identified layout and form issues, and documented fixes for internal tracking.',
        'Worked with senior developers to troubleshoot frontend and backend problems involving form submissions, database-connected pages, and WordPress updates.',
      ],
    },

    {
      title: 'Junior Software Engineer',
      company: 'Cognizant',
      location: 'Chennai, Tamil Nadu, India',
      period: 'May 2019 - June 2020',
      responsibilities: [
        'Supported enterprise applications through manual testing, debugging, technical documentation, issue analysis, and small backend service enhancements.',
        'Created and executed test cases, validated application behaviour, logged defects, and supported QA and development teams during release cycles.',
        'Investigated application issues using SQL queries, logs, service responses, and internal support tools to identify root causes.',
        'Assisted with small backend utilities and service components using Java, SQL, and basic scripting in a production-support environment.',
        'Prepared technical documentation, defect notes, support handoff details, and status updates to improve team communication and knowledge sharing.',
      ],
    },
  ],

  handsOnExperience: [
    'Designed and deployed the Shrtn full-stack URL-shortening platform',
    'Published Shrtn and SipTime through the Chrome Web Store',
    'Built React and TypeScript user interfaces with Vite',
    'Developed Node.js and Express REST APIs',
    'Integrated PostgreSQL databases hosted through Neon',
    'Created backend automated tests using Vitest and Supertest',
    'Configured GitHub Actions continuous integration',
    'Built Java and Spring Boot backend foundations',
    'Tested REST APIs using Postman and Rest Assured',
    'Worked with Selenium, TestNG, JUnit, Maven, Docker, and Jenkins',
  ],

  skills: [
    {
      category: 'Programming Languages',
      skills: [
        'JavaScript',
        'TypeScript',
        'Java',
        'Python',
        'SQL',
        'C',
        'C++',
      ],
    },

    {
      category: 'Frontend Development',
      skills: [
        'React',
        'Angular',
        'Vite',
        'HTML5',
        'CSS3',
        'Bootstrap',
        'Responsive Design',
        'DOM Manipulation',
        'Tailwind CSS',
        'PixiJS',
      ],
    },

    {
      category: 'Backend and APIs',
      skills: [
        'Node.js',
        'Express',
        'Spring Boot',
        'REST APIs',
        'API Integration',
        'Request Validation',
        'Error Handling',
      ],
    },

    {
      category: 'Databases',
      skills: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Oracle Database',
        'Neon',
        'SQL Queries',
        'Database Migrations',
      ],
    },

    {
      category: 'Browser Extensions',
      skills: [
        'Chrome Manifest V3',
        'Chrome Extension APIs',
        'Active Tab API',
        'Clipboard API',
        'Chrome Alarms API',
        'Chrome Notifications API',
        'Browser Storage',
      ],
    },

    {
      category: 'Testing and Quality',
      skills: [
        'Vitest',
        'Supertest',
        'JUnit',
        'Mockito',
        'Postman',
        'Rest Assured',
        'Selenium',
        'TestNG',
        'Manual Testing',
        'Unit Testing',
        'Regression Testing',
        'Debugging',
      ],
    },

    {
      category: 'Cloud and DevOps',
      skills: [
        'Neon',
        'Railway',
        'GitHub Actions',
        'Git',
        'GitHub',
        'Docker',
        'Jenkins',
        'Maven',
        'AWS',
      ],
    },

    {
      category: 'Engineering Practices',
      skills: [
        'Object-Oriented Programming',
        'Root-Cause Analysis',
        'Code Review',
        'Agile',
        'Scrum',
        'Technical Documentation',
        'Security Headers',
        'Rate Limiting',
      ],
    },
  ],
}
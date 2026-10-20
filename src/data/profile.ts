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
    'Software engineer and freelance developer building web applications, backend services, browser extensions, and developer tools. I work with React, Next.js, TypeScript, Node.js, Java, REST APIs, and relational databases.',
    'My work includes a client-facing creator platform and digital storefront, alongside independent projects for URL shortening, screen recording, hydration reminders, and streaming.',
    'I enjoy taking features from implementation through testing and deployment, and have experience investigating enterprise application issues and collaborating with engineering teams.',
  ],

  focusAreas: [
    'Full-stack software development',
    'Backend services and REST APIs',
    'Frontend development with React, Next.js, and TypeScript',
    'Software testing and quality engineering',
    'Database integration and persistence',
    'Browser-extension development',
    'Developer tools and productivity systems',
    'Production deployment and application maintenance',
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
      title: 'Freelance Software Engineer',
      company: 'Independent',
      location: 'Ontario, Canada',
      period: 'January 2025 - Present',
      responsibilities: [
        'Build and maintain web applications and developer tools using React, Next.js, TypeScript, Node.js, REST APIs, PostgreSQL, Supabase, and browser APIs.',
        'Developed Life of Priya, a client-facing creator website and digital storefront with customer accounts, payments, digital delivery, bookings, and administrative workflows.',
        'Integrated Supabase authentication and database services, Stripe and Razorpay payments, transactional email, and Google services into production client workflows.',
        'Maintain independent projects including Shrtn, SipTime, Recordock, and Pazora, with attention to testing, deployment, security, debugging, and documentation.',
      ],
    },
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
    'Built a production creator platform and storefront with Next.js, Supabase, and payment integrations',
    'Built Pazora, a self-hosted streaming interface using Next.js, Jellyfin, HLS, and Caddy',
    'Designed and deployed the Shrtn full-stack URL-shortening platform',
    'Published Shrtn and SipTime through the Chrome Web Store',
    'Built React, Next.js, and TypeScript user interfaces with Vite and Tailwind CSS',
    'Developed Node.js and Express REST APIs',
    'Integrated PostgreSQL databases hosted through Neon and Supabase',
    'Created backend automated tests using Vitest and Supertest',
    'Configured GitHub Actions continuous integration',
    'Built Java and Spring Boot backend foundations',
    'Tested REST APIs using Postman and Rest Assured',
    'Worked with Selenium, TestNG, JUnit, Maven, Docker, and Jenkins',
    'Used AI-assisted coding tools for prototyping, debugging, code review, and testing',
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
        'Next.js',
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
        'OpenAPI',
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
        'Supabase',
        'MySQL',
        'MongoDB',
        'Oracle Database',
        'Neon',
        'IndexedDB',
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
        'MediaRecorder API',
        'Media Capture and Streams API',
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
        'Vercel',
        'GitHub Actions',
        'Git',
        'GitHub',
        'Docker',
        'Jenkins',
        'Maven',
        'AWS',
        'Caddy',
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
        'Authentication and Session Design',
      ],
    },
  ],
}
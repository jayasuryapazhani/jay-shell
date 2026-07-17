# JayShell

An interactive terminal-style software engineering portfolio built with React, TypeScript, and Vite.

JayShell presents the professional experience, education, technical skills, projects, contact information, and resume of **Jayasurya Pazhani** through a simulated Unix-style terminal interface.

Users can explore the portfolio by entering terminal commands, navigating a virtual filesystem, selecting clickable commands, or using the responsive Quick Navigation panel.

## Features

- Interactive terminal command interface
- Simulated Unix-style virtual filesystem
- Project-specific terminal directories and commands
- Random supervillain visitor aliases
- Animated terminal startup sequence
- Command history with Arrow Up and Arrow Down
- Tab-based command and directory autocomplete
- Typo detection with clickable command suggestions
- Clickable directories, commands, and external links
- Responsive Quick Navigation sidebar
- Professional experience listed in reverse chronological order
- Detailed project cards and technical project information
- Resume viewing and downloading
- Accessible keyboard navigation and visible focus states
- Reduced-motion support
- Responsive layouts for desktop, tablet, and mobile
- Automated unit, component, and integration tests

## Technology Stack

### Application

- React
- TypeScript
- Vite
- HTML5
- CSS3

### Testing

- Vitest
- React Testing Library
- Testing Library User Event
- Jest DOM
- jsdom

### Development Tools

- Oxlint
- Git
- GitHub
- npm
- PowerShell
- Visual Studio Code

### Additional Package

- `supervillains` for randomized terminal visitor aliases

## Terminal Commands

### General Commands

| Command | Description |
|---|---|
| `help` | Show commands available in the current directory |
| `info` | Display information about the current directory |
| `ls` | List available subdirectories |
| `cd <directory>` | Enter a virtual directory |
| `cd ..` | Move to the parent directory |
| `cd ~` | Return to the home directory |
| `pwd` | Display the current virtual path |
| `whoami` | Display the current terminal username and alias |
| `history` | Display commands entered during the session |
| `clear` | Clear visible terminal output |
| `cls` | Alias for `clear` |
| `reset` | Clear output and return to the home directory |
| `reboot` | Restart JayShell with a new visitor alias |

### Portfolio Commands

| Command | Description |
|---|---|
| `about` | Display professional summary and background |
| `skills` | Display technical skills |
| `experience` | Display professional work experience |
| `education` | Display education |
| `projects` | Display the project showcase |
| `contact` | Display contact information |
| `socials` | Display GitHub and LinkedIn profiles |
| `resume` | View or download the resume |

### Project Commands

The following commands become available inside an individual project directory:

| Command | Description |
|---|---|
| `stack` | Display the project's technology stack |
| `features` | Display major project features |
| `testing` | Display testing and validation details |
| `architecture` | Display project architecture |
| `lessons` | Display lessons learned |
| `github` | Open the GitHub repository |
| `demo` | Open the live application when available |
| `store` | Open the Chrome Web Store listing when available |

## Virtual Filesystem

```text
/home/jayasurya
├── about/
├── skills/
├── experience/
├── education/
├── projects/
│   ├── shrtn/
│   ├── siptime/
│   ├── supportbot/
│   ├── dev-monitor/
│   ├── jay-shell/
│   ├── slot-machine-pixijs/
│   └── warzone/
├── contact/
└── socials/
```

Example navigation:

```bash
cd projects
ls
cd shrtn
info
stack
features
testing
architecture
github
store
```

## Portfolio Projects

### Shrtn

A published URL-shortening platform and Chrome/Brave extension with persistent links, QR-code generation, click analytics, PostgreSQL persistence, automated testing, and production security controls.

### SipTime

A published hydration reminder Chrome/Brave extension with interval-based reminders, fixed schedules, quiet hours, notification snoozing, browser storage, and a React and TypeScript interface.

### SupportBot

A quality-engineering learning project covering Spring Boot APIs, API testing, database testing, Selenium, TestNG, Rest Assured, Postman, Docker, Jenkins, and CI/CD fundamentals.

### Developer Monitor

A lightweight monitoring dashboard designed for a secondary developer display, including system resource, network, latency, service, and log monitoring concepts.

### JayShell

This terminal-style portfolio, built with React, TypeScript, Vite, responsive CSS, a virtual filesystem, terminal commands, autocomplete, command history, accessibility support, and automated tests.

### PixiJS Slot Machine

A responsive 5-by-3 browser slot machine featuring animated reels, motion blur, configurable reel bands, paylines, payouts, and winning-symbol highlighting.

### Warzone

A Java command-line strategy game developed as an academic team project, including maps, players, orders, game phases, computer-player strategies, tournament mode, Maven, and JUnit testing.

## Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Git

Verify the installations:

```bash
node --version
npm --version
git --version
```

### Clone the Repository

```bash
git clone https://github.com/jayasuryapazhani/jay-shell.git
cd jay-shell
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The default Vite development server normally runs at:

```text
http://localhost:5173
```

To run JayShell on port `5174`:

```bash
npm run dev -- --port 5174
```

## Available npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript compilation and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run test` | Run the complete Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run check` | Run linting, tests, and the production build |

## Testing

Run all automated tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run the complete validation pipeline:

```bash
npm run check
```

The test suite covers:

- Virtual filesystem path resolution
- Portfolio and project data synchronization
- Terminal username formatting
- Prompt and virtual-path formatting
- Typo-based command suggestions
- Terminal action components
- Quick Navigation behavior
- Terminal history rendering
- Terminal prompt input and keyboard events
- Startup and terminal header components
- Command execution
- Directory navigation
- Tab autocomplete
- Arrow-key command history
- Command suggestions
- Clear, reset, and reboot behavior
- External project links
- Accessibility navigation

## Project Structure

```text
jay-shell/
├── public/
│   ├── favicon.svg
│   ├── Jaysurya-Pazhani-Resume.pdf
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── HelpAction.tsx
│   │   ├── QuickNavigation.tsx
│   │   ├── TerminalAction.tsx
│   │   ├── TerminalHeader.tsx
│   │   ├── TerminalHistory.tsx
│   │   ├── TerminalPrompt.tsx
│   │   └── TerminalStartup.tsx
│   ├── config/
│   │   └── portfolio.ts
│   ├── data/
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   └── virtualFileSystem.ts
│   ├── test/
│   │   └── setup.ts
│   ├── types/
│   │   └── terminal.ts
│   ├── utils/
│   │   ├── terminal.ts
│   │   └── visitorAlias.ts
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

Test files are located alongside the source files they validate.

## Accessibility

JayShell includes:

- Keyboard-accessible interactive controls
- Semantic regions and labels
- A skip link to the main terminal content
- Visible focus indicators
- Screen-reader-friendly status updates
- Reduced-motion behavior
- Minimum touch-target sizing
- Responsive command and URL wrapping
- Mobile-friendly terminal and project layouts

## Responsive Design

The interface supports:

- Large desktop displays
- Laptop displays
- Tablet portrait and landscape layouts
- Mobile devices
- Small screens down to 320 pixels wide

The Quick Navigation panel moves above the terminal session on narrower layouts, and project cards collapse into a single-column layout.

## Development Workflow

This repository preserves completed development branches as a historical record of the project.

Examples include:

```text
terminal-foundation
command-system
virtual-file-system
terminal-keyboard
clickable-navigation
project-details
terminal-refactor
animated-intro
terminal-components
portfolio-content
projects-showcase
terminal-aliases
command-history
session-controls
additional-projects
content-finalization
automated-tests
accessibility-responsive
site-metadata
documentation
```

Each branch represents a focused stage of the application's implementation.

## Production Build

Create a production build:

```bash
npm run build
```

The generated production files will be placed in:

```text
dist/
```

Preview the build:

```bash
npm run preview
```

## Deployment

Deployment instructions and the production website URL will be added after the application is published.

## Author

**Jayasurya Pazhani**

- GitHub: [github.com/jayasuryapazhani](https://github.com/jayasuryapazhani)
- LinkedIn: [linkedin.com/in/jayasurya-pazhani](https://www.linkedin.com/in/jayasurya-pazhani/)
- Email: [pazhanijayasurya@gmail.com](mailto:pazhanijayasurya@gmail.com)

## License

This portfolio is currently provided as a personal software-engineering project. No open-source license has been assigned.
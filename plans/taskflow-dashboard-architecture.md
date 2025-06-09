# TaskFlow Dashboard - AI Development Tools Demo Project

## High-Level Overview

- Build a Next.js TaskFlow Dashboard with core functionality (task management, user profiles, basic analytics) that contains intentional bugs and is missing the Smart Task Insights Analytics Panel feature - which will be built live during the Claude Code demonstration.

## Mid-Level Overview

- Create a Next.js TypeScript application with modern React patterns and component architecture
- Implement core task management functionality with CRUD operations
- Design responsive dashboard layout with sidebar navigation
- Build basic analytics visualization components (foundation only)
- Integrate JSON-based data storage with sample data population
- Intentionally introduce specific UI layout and TypeScript bugs for demo purposes
- Leave Smart Task Insights Analytics Panel unimplemented for live Claude Code demonstration
- Set up proper project structure with testing, linting, and development tooling

## End State

- Functional TaskFlow Dashboard with task management, user profiles, and basic analytics foundation
- Professional UI with responsive design and sidebar navigation (containing intentional layout bugs)
- Basic analytics page with placeholder for Smart Task Insights (to be built during demo)
- Intentional bugs properly placed for Jam AI and Devin demonstration
- Complete development environment with testing and quality tools configured
- Ready-to-demo application with missing feature and bugs for AI tool showcasing

## Implementation Notes

- **Framework**: Next.js 14+ with TypeScript and App Router
- **Styling**: Tailwind CSS for responsive design and component styling
- **Charts**: Chart.js or Recharts for analytics visualization
- **Data Storage**: JSON files with TypeScript interfaces for type safety
- **Testing**: Jest + React Testing Library, Playwright for E2E testing
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Git Strategy**: Main branch with feature branches for parallel development
- **Component Architecture**: Modular components with proper TypeScript interfaces
- **Bug Placement**: Strategic placement in sidebar layout (CSS) and user profile (TypeScript)
- **MCP Integration**: File management and testing automation support
- **Accessibility**: ARIA labels and keyboard navigation support

## Context

This project serves as a demonstration platform for showcasing how multiple AI development tools (Jam AI, Devin, Claude Code) can work together in a realistic development scenario. The application provides a practical context for bug fixing, feature development, and quality improvements while maintaining the complexity needed to demonstrate real-world AI tool capabilities.

### Editable context

./src/components/
./src/app/
./src/lib/
./src/types/
./data/

### Read-only context

./package.json
./next.config.js
./tailwind.config.js

## Low level tasks

1. **Project Initialization and Setup**

```
Initialize Next.js project with TypeScript, set up development environment with Tailwind CSS, ESLint, Prettier, and testing frameworks. Configure package.json with all necessary dependencies and scripts.
Create: package.json, next.config.js, tailwind.config.js, tsconfig.json, .eslintrc.json
Update: Initial project configuration files
Details: Next.js 14, TypeScript strict mode, Tailwind CSS, Jest, Playwright, Chart.js/Recharts
Verification: npm run dev starts successfully, all linting passes
```

2. **Data Structure and Types Definition**

```
Define TypeScript interfaces for tasks, users, and analytics data. Create sample JSON data files with realistic content for demonstration purposes.
Create: src/types/index.ts, data/tasks.json, data/users.json, data/analytics.json
Define: Task, User, Analytics interfaces with proper typing
Details: Comprehensive type definitions covering all application entities
Verification: TypeScript compilation passes, sample data loads correctly
```

3. **Core Layout and Navigation Structure**

```
Implement main application layout with sidebar navigation and responsive design. Include intentional CSS flexbox/grid conflict for bug demonstration.
Create: src/app/layout.tsx, src/components/Sidebar.tsx, src/components/Layout.tsx
Implement: Responsive sidebar with navigation, main content area
Details: Tailwind CSS, mobile-responsive, intentional desktop layout bug
Verification: Navigation works, layout renders on different screen sizes
```

4. **Dashboard Home Page**

```
Build the main dashboard with task summary statistics, overview cards, and key metrics display.
Create: src/app/page.tsx, src/components/DashboardStats.tsx, src/components/TaskSummary.tsx
Implement: Statistics cards, task overview, quick actions
Details: Real-time data display, responsive card layout, loading states
Verification: Dashboard displays sample data correctly, statistics are accurate
```

5. **Task Management System**

```
Implement complete task CRUD functionality with forms, list views, and task detail pages.
Create: src/app/tasks/page.tsx, src/app/tasks/[id]/page.tsx, src/components/TaskForm.tsx, src/components/TaskList.tsx
Implement: Create, read, update, delete tasks, task filtering and sorting
Details: Form validation, optimistic updates, error handling
Verification: All task operations work correctly, data persists
```

6. **User Profile Components**

```
Build user profile display and management with intentional TypeScript any type issues for bug demonstration.
Create: src/app/profile/page.tsx, src/components/UserProfile.tsx
Implement: User information display, profile editing, preferences
Details: Intentional type safety violations using 'any' types
Verification: Profile displays, intentional TypeScript errors present
```

7. **Basic Analytics View Foundation**

```
Create basic analytics page structure with placeholder content for Smart Task Insights feature that will be built during Claude Code demo.
Create: src/app/analytics/page.tsx, src/components/AnalyticsPlaceholder.tsx
Implement: Basic page layout, navigation, placeholder sections for missing feature
Details: Page structure ready for Smart Insights integration, clear placeholder content
Verification: Analytics page loads, placeholder clearly indicates missing feature
```

8. **Data Layer and Utilities**

```
Implement data access layer with utilities for JSON file operations and data manipulation, including data structures needed for future Smart Insights feature.
Create: src/lib/data.ts, src/lib/utils.ts, src/lib/analytics.ts
Implement: Data fetching, CRUD operations, utility functions, analytics data preparation
Details: Type-safe data operations, error handling, data validation, Smart Insights data foundation
Verification: Data operations work reliably, types are enforced, analytics data available
```

9. **Testing Infrastructure**

```
Set up comprehensive testing suite with unit tests, integration tests, and Playwright E2E tests for existing functionality.
Create: __tests__/, src/components/__tests__/, e2e/
Implement: Component tests, utility function tests, user journey E2E tests for current features
Details: Jest configuration, React Testing Library, Playwright setup, MCP server integration ready
Verification: All tests pass for existing functionality, testing framework ready for new features
```

10. **Bug Introduction and Quality Assurance**

```
Strategically introduce intentional bugs in sidebar layout and user profile components. Set up linting and code quality tools.
Update: Sidebar component with CSS conflicts, UserProfile with type issues
Implement: ESLint rules, Prettier configuration, pre-commit hooks
Details: Specific bug placement matching demo requirements (desktop layout overlap, TypeScript any types)
Verification: Bugs reproduce as expected, quality tools catch TypeScript issues
```

11. **Final Integration and Demo Preparation**

```
Complete final integration testing, optimize performance, and prepare application for demonstration with intentional gaps for live coding.
Update: All components for final polish, data seeding, build optimization
Implement: Production build, performance optimizations, demo data, clear placeholders
Details: Smooth demo experience, reliable bug reproduction, obvious missing Smart Insights feature
Verification: Application runs smoothly, bugs demonstrate correctly, missing feature is clearly apparent
```
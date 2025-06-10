# TaskFlow Dashboard

A Next.js TypeScript application demonstrating modern task management with intentional bugs for AI development tools demonstration.

## 🚀 Features

- **Dashboard**: Overview with task statistics and recent tasks
- **Task Management**: Complete CRUD operations for tasks
- **User Profiles**: User management with preferences
- **Analytics**: Basic analytics with placeholder for Smart Task Insights (AI feature)
- **Responsive Design**: Mobile-friendly interface
- **Testing**: Jest unit tests and Playwright E2E tests

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **Icons**: Lucide React

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐛 Intentional Bugs for Demo

This application contains strategically placed bugs for AI development tools demonstration:

### 1. Task Routing Bug (TaskList.tsx)
**Location**: `src/components/TaskList.tsx:157`
**Issue**: View buttons use filtered array indices instead of proper task IDs
**How to Reproduce**:
1. Go to Tasks page (`/tasks`)
2. Apply any filter (status or priority filter)
3. Click "View" button on any task
4. **Wrong task opens** or you get a 404 error

**Symptoms**:
- Clicking "View" on filtered tasks opens wrong task details
- 404 errors when filtered list is shorter than original
- Demonstrates critical difference between array indices and proper data IDs

### 2. TypeScript Type Safety Issues (UserProfile.tsx)
**Location**: `src/components/UserProfile.tsx`
**Issues**: Multiple `any` type usage violations causing runtime crashes
- Line 15: `useState<any>` instead of proper typing
- Line 23: Function parameter `e: any`
- Line 44: Validation function with `any` parameter that crashes
- Line 68: Form submission that triggers validation errors
- Line 99: Data corruption function due to loose typing

**How to Reproduce the Crash**:
1. Go to Profile page (`/profile`)
2. Click "Edit Profile" button  
3. Click the "Clear Form" button (this triggers data type corruption)
4. Wait a moment for the form to "reset" (you'll notice form fields change)
5. Try to submit the form by clicking "Save Changes"
6. **Application will crash** with runtime errors due to:
   - `Cannot read property 'trim' of null` (name field becomes null)
   - `Cannot read property 'includes' of undefined` (email field becomes undefined)
   - Type mismatches in validation logic (notifications becomes string instead of boolean)

**Symptoms**:
- Form crashes when submitting after data corruption
- Loss of type safety allows invalid data states
- Runtime errors break user workflow
- No IntelliSense support during development

## 🔮 Missing Features for Live Demo

### 1. Smart Task Insights Analytics Panel
**Location**: `src/app/analytics/page.tsx`
**Description**: AI-powered analytics feature placeholder
**What's Missing**:
- Machine learning task pattern analysis
- Predictive bottleneck detection
- Intelligent productivity recommendations
- Advanced data visualizations with Chart.js

### 2. Time Tracking System (For Parallel Development)
**Location**: Task components and new time tracking components
**Description**: Task time tracking and reporting system
**What's Missing**:
- Start/stop timer functionality for tasks
- Time entry logging and persistence
- Time reports and summaries by task/user
- Integration with existing task components
- Timer UI components and time display formatting

Both features are intentionally incomplete to demonstrate:
- Live AI-assisted development 
- **Git worktree parallel development workflows**

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page with Smart Insights placeholder
│   ├── profile/           # User profile management
│   ├── tasks/            # Task management pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── __tests__/        # Component unit tests
│   ├── DashboardStats.tsx
│   ├── Sidebar.tsx
│   ├── TaskList.tsx      # Contains intentional routing bug
│   ├── UserProfile.tsx   # Contains intentional TypeScript issues
│   └── ...
├── lib/                  # Utility functions and data access
│   ├── analytics.ts      # Smart insights foundation
│   ├── data.ts          # JSON data operations
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
    └── index.ts

data/                    # Sample JSON data
├── analytics.json
├── tasks.json
└── users.json

e2e/                     # Playwright E2E tests
__tests__/              # Jest unit tests
```

## 🎯 Demo Scenarios

1. **Bug Discovery**: Use tools to identify routing and TypeScript issues
2. **Bug Resolution**: Fix task routing and type safety problems
3. **Parallel Feature Development with Git Worktrees**:
   - **Branch A**: Build Smart Task Insights with AI assistance
   - **Branch B**: Build Time Tracking system with AI assistance
4. **Quality Assurance**: Run tests and ensure code quality

## 📊 Sample Data

The application includes realistic sample data:
- 8 tasks across different statuses and priorities
- 5 team members with different roles
- Analytics data with trends and metrics
- User preferences and activity data

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run Jest tests
npm run test:watch   # Run Jest in watch mode
npm run test:e2e     # Run Playwright E2E tests
```

## 🚨 Known Issues

The following issues are intentional for demonstration purposes:

1. **Task Routing Bug** - Array indices used instead of proper task IDs
2. **TypeScript Type Safety** - Multiple `any` type violations
3. **Missing Smart Analytics** - AI analytics feature placeholder
4. **Missing Time Tracking** - Time tracking system placeholder

These issues are designed to showcase AI development tool capabilities in:
- Automated bug detection
- Intelligent code completion
- AI-assisted feature development
- **Parallel development workflows with Git worktrees**
- Code quality improvements
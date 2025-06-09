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

### 1. CSS Layout Bug (Sidebar.tsx)
**Location**: `src/components/Sidebar.tsx:30-35`
**Issue**: Conflicting CSS positioning properties causing desktop layout overlap
**Symptoms**: 
- Sidebar overlaps main content on desktop screens
- Multiple conflicting position properties (static, absolute, flex)
- Z-index conflicts

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

## 🔮 Missing Feature for Live Demo

### Smart Task Insights Analytics Panel
**Location**: `src/app/analytics/page.tsx`
**Description**: AI-powered analytics feature placeholder
**What's Missing**:
- Machine learning task pattern analysis
- Predictive bottleneck detection
- Intelligent productivity recommendations
- Advanced data visualizations with Chart.js

This feature is intentionally incomplete to demonstrate live AI-assisted development during the demo.

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
│   ├── Sidebar.tsx       # Contains intentional CSS bug
│   ├── TaskList.tsx
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

1. **Bug Discovery**: Use tools to identify CSS and TypeScript issues
2. **Bug Resolution**: Fix layout conflicts and type safety problems
3. **Feature Development**: Build Smart Task Insights with AI assistance
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

1. **Desktop Sidebar Overlap** - CSS positioning conflicts
2. **TypeScript Type Safety** - Multiple `any` type violations
3. **Missing Smart Insights** - AI analytics feature placeholder

These issues are designed to showcase AI development tool capabilities in:
- Automated bug detection
- Intelligent code completion
- AI-assisted feature development
- Code quality improvements
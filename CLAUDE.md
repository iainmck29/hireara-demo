# TaskFlow Dashboard - Claude Code Demo Project

## Project Overview

A Next.js TypeScript task management dashboard with intentional bugs and missing features for AI development tools demonstration.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests (requires dev server running)
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Intentional Issues for Demo

### 1. Task View Routing Bug (HIGH PRIORITY)

**File**: `src/components/TaskList.tsx`
**Issue**: Uses filtered array index instead of actual task ID for routing
**Line**: 157
**How to Reproduce**:
1. Go to /tasks
2. Apply any filter (status or priority)
3. Click "View" on any task → **Opens wrong task or 404**
**Symptoms**: Wrong task details displayed, 404 errors when filtered list is shorter
**Demo Value**: Shows critical difference between array indices and proper IDs, data modeling importance

### 2. TypeScript Type Safety (HIGH PRIORITY)

**File**: `src/components/UserProfile.tsx`
**Issues**: Multiple `any` type violations causing runtime crashes
**Lines**: 15, 23, 44, 68, 99
**How to Reproduce**:

1. Go to /profile
2. Click "Edit Profile"
3. Click "Clear Form" button (watch form fields change)
4. Click "Save Changes" → **CRASHES** with null/undefined errors
   **Symptoms**: Runtime errors, form crashes, data corruption allowed
   **Demo Value**: Shows critical importance of type safety and proper TypeScript usage

### 3. Missing Feature - Smart Analytics (FOR LIVE CODING)

**Location**: `src/app/analytics/page.tsx`
**Feature**: Smart Task Insights Analytics Panel
**What's Needed**: AI-powered task analytics with charts and recommendations
**Demo Value**: Shows feature development from scratch with AI assistance

### 4. Missing Feature - Time Tracking (FOR PARALLEL DEVELOPMENT)

**Location**: Task components and new time tracking components
**Feature**: Task Time Tracking System
**What's Needed**: 
- Start/stop timers for tasks
- Time entry logging and display
- Time reports and summaries
- Integration with existing task components
**Demo Value**: Perfect for Git worktree parallel development demonstration

## Project Structure

- Modern Next.js 14 with App Router
- TypeScript strict mode (with intentional violations)
- Tailwind CSS for styling
- Comprehensive testing setup (Jest + Playwright)
- Sample JSON data for realistic demo

## Demo Flow Suggestions

1. Identify task routing bug by applying filters and clicking View
2. Fix routing issue using proper task IDs instead of array indices
3. Fix TypeScript type violations with AI assistance
4. **Parallel Development with Git Worktrees:**
   - Branch A: Build Smart Analytics feature with AI code generation
   - Branch B: Build Time Tracking feature with AI assistance
5. Run tests to verify fixes and new features
6. Deploy optimized build

## Key Files to Focus On

- `src/components/TaskList.tsx` - Routing bug (line 157)
- `src/components/UserProfile.tsx` - Type issues
- `src/app/analytics/page.tsx` - Missing Smart Analytics feature
- `src/lib/analytics.ts` - Foundation for Smart Insights
- **Time Tracking Feature Files (to be created):**
  - `src/components/TimeTracker.tsx` - Timer component
  - `src/components/TimeEntry.tsx` - Time logging
  - `src/lib/timeTracking.ts` - Time tracking utilities

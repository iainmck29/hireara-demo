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

### 1. CSS Layout Bug (HIGH PRIORITY)
**File**: `src/components/Sidebar.tsx` (lines 30-35)
**Issue**: Desktop sidebar overlaps main content due to conflicting CSS positioning
**Symptoms**: Sidebar appears on top of main content on desktop screens
**Demo Value**: Shows CSS debugging and layout fixing capabilities

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

### 3. Missing Feature (FOR LIVE CODING)
**Location**: `src/app/analytics/page.tsx`
**Feature**: Smart Task Insights Analytics Panel
**What's Needed**: AI-powered task analytics with charts and recommendations
**Demo Value**: Shows feature development from scratch with AI assistance

## Project Structure
- Modern Next.js 14 with App Router
- TypeScript strict mode (with intentional violations)
- Tailwind CSS for styling
- Comprehensive testing setup (Jest + Playwright)
- Sample JSON data for realistic demo

## Demo Flow Suggestions
1. Identify CSS layout issue using dev tools
2. Fix TypeScript type violations with AI assistance  
3. Build Smart Analytics feature with AI code generation
4. Run tests to verify fixes and new feature
5. Deploy optimized build

## Key Files to Focus On
- `src/components/Sidebar.tsx` - Layout bug
- `src/components/UserProfile.tsx` - Type issues
- `src/app/analytics/page.tsx` - Missing feature
- `src/lib/analytics.ts` - Foundation for Smart Insights
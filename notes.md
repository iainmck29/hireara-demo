# AI Development Tools Demo Project Scope

## Project Overview

**Name**: TaskFlow Dashboard  
**Framework**: Next.js with TypeScript  
**Purpose**: Demonstrate AI-powered development workflow integration  
**Demo Duration**: 15-17 minutes (excluding Granola)

## Application Structure

### Core Features

- **Dashboard Home**: Overview of tasks with summary statistics
- **Task Management**: Create, view, and manage individual tasks
- **User Profiles**: Basic user information and preferences display
- **Analytics View**: Simple charts showing task completion trends
- **Navigation**: Sidebar navigation between different sections

### Database/Data Layer

- Simple JSON-based data storage or basic database integration
- Sample data for tasks, users, and analytics
- Basic CRUD operations for task management

## Intentional Bugs to Demonstrate

### Bug 1: Desktop UI Layout Issue

**Location**: Main dashboard layout  
**Type**: CSS flexbox/grid conflict  
**Symptoms**:

- Sidebar overlaps main content area on window resize
- Content becomes unclickable behind sidebar
- Layout instability when switching sections
- Unnecessary horizontal scrolling

**Demo Purpose**: Showcase Jam AI bug reporting and Devin's UI fixing capabilities

### Bug 2: TypeScript Any Type Issue

**Location**: User profile component  
**Type**: Type safety violation  
**Symptoms**:

- Runtime errors when accessing nested user properties
- Undefined property access causing crashes
- Poor developer experience with no autocomplete
- Potential production failures

**Demo Purpose**: Demonstrate Devin's ability to fix type issues and implement ESLint rules

## Feature to Build with Claude Code

### Smart Task Insights Analytics Panel

**Components**:

- Task completion trends visualization (charts/graphs)
- Overdue task warnings and alerts system
- Productivity insights dashboard with key metrics
- Data processing utilities for analytics calculations

**Claude Code Demonstration Focus**:

- Custom slash commands for rapid component scaffolding
- MCP server integration for data file management and chart configuration
- Playwright MCP server for automated testing and validation of the new analytics features
- Git worktrees for parallel analytics logic and UI component development
- Conversational debugging for data visualization and calculation logic

## Demo Integration Points

### Jam AI Integration

- Record bug reproduction steps
- Automatically capture browser state and screenshots
- Generate detailed Linear tickets with rich context
- Demonstrate seamless bug reporting workflow

### Devin Integration

- Linear ticket tagging for automatic bug assignment
- Asynchronous PR generation and fixes
- Unit test creation for regression prevention
- ESLint configuration updates
- Comment-based task assignment on PRs

### Claude Code Integration

- Project scaffolding and setup
- Feature development with AI assistance
- Automated testing validation using Playwright MCP server
- Git workflow management
- Development environment optimization

## Demo Flow Structure

### Phase 1: Problem Identification (3-4 minutes)

- Project walkthrough showing current functionality
- Live demonstration of both bugs
- Audience can see immediate pain points

### Phase 2: Bug Documentation (3-4 minutes)

- Jam AI bug recording and reproduction
- Linear ticket creation with automated context
- Show integration between tools

### Phase 3: Parallel Development (8-9 minutes)

- Tag Devin for bug fixes (asynchronous work begins)
- Switch to Claude Code for Smart Task Insights feature development
- Demonstrate MCP server usage for file management and Playwright testing
- Use git worktrees for parallel analytics and UI development
- Show automated validation of new features through Playwright tests
- Review Devin's completed work and additional requests

### Phase 4: Results Showcase (2-3 minutes)

- Review fixed bugs and new feature functionality
- Highlight code quality improvements
- Demonstrate prevented regressions through testing

## Success Metrics for Demo

### Immediate Visual Impact

- Clear before/after comparison for UI fixes
- Live demonstration of new collaborative features
- Real-time problem solving

### Workflow Efficiency

- Multiple AI tools working simultaneously
- Reduced context switching between tasks
- Automated quality improvements (tests, linting)

### Team Collaboration Benefits

- Better bug reporting and tracking
- Asynchronous development capabilities
- Improved code quality and maintainability

## Preparation Requirements

### Repository Setup

- Clean, functional base application
- Intentional bugs properly introduced
- Sample data populated
- Development environment configured

### Tool Configuration

- All AI tools authenticated and ready
- Linear workspace set up with proper integrations
- Git repository with appropriate branching strategy
- Development dependencies installed

### Demo Environment

- Stable internet connection for tool APIs
- Backup plans for each tool demonstration
- Screen recording setup for fallback scenarios
- Clear browser setup for optimal visibility

## Target Audience Takeaways

### For Developers

- AI tools enhance rather than replace developer skills
- Multiple tools can work together seamlessly
- Quality improvements happen automatically
- Development velocity increases significantly

### For Management

- Faster bug resolution and feature delivery
- Better code quality and maintainability
- Improved team collaboration and knowledge sharing
- Reduced time spent on repetitive tasks

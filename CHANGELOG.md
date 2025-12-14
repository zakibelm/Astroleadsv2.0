# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-14

### Added
- **Project Structure**: Complete restructuring with `src/` directory
- **UI Component Library**: Button, Card, Input, Modal, Badge, Toast, Skeleton components
- **State Management**: Zustand stores for auth, campaigns, leads, and UI
- **Authentication**: Login page with demo accounts and protected routes
- **Views**: Dashboard, Campaigns, Leads, Analytics, AI Studio, Settings, Agents, Templates
- **Testing**: Vitest configuration with unit tests for stores and components
- **Documentation**: README, CHANGELOG, LICENSE, .env.example
- **Configuration**: ESLint, Prettier, TypeScript strict mode, path aliases
- **Styling**: TailwindCSS via npm with Gold Neon Glass theme
- **Error Handling**: ErrorBoundary component and toast notifications
- **Validation**: Zod schemas for form validation

### Changed
- Migrated from CDN Tailwind to npm installation
- Changed from MemoryRouter to BrowserRouter
- Refactored App.tsx with lazy loading and code splitting

### Infrastructure
- Added Vitest for testing
- Added Playwright for E2E tests
- Added ESLint and Prettier for code quality
- Path aliases configured (@/components, @/stores, etc.)

## [0.1.0] - Initial Version

### Added
- Initial prototype with mock data
- Basic UI with Tailwind CDN
- Gemini AI integration for content generation

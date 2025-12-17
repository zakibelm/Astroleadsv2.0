# Contributing to AstroLeads

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to AstroLeads. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional, but recommended for full stack testing)
- Git

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Astroleadsv2.0.git
   cd Astroleadsv2.0
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your keys (Supabase, OpenRouter, Resend)
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

We use the **Feature Branch Workflow**.

1.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    # or
    git checkout -b fix/critical-bug
    ```

2.  **Make your changes**. Please adhere to our coding standards (see below).

3.  **Commit your changes** using conventional commits:
    ```bash
    git commit -m "feat: add new lead scoring algorithm"
    git commit -m "fix(auth): resolve login redirect issue"
    ```

4.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```

5.  **Open a Pull Request** targeting the `develop` branch (or `main` for hotfixes).

## 📏 Coding Standards

### TypeScript & React
- Use **functional components** with hooks.
- Strictly type all props and state (avoid `any`).
- Use `Zustand` for global state management.
- Prefer **Tailwind CSS** for styling.

### Linting & Formatting
We use ESLint and Prettier. Run checks before committing:
```bash
npm run lint
npm run typecheck
```

### Testing
- **Unit Tests**: Write tests for utilities and logic using Vitest.
- **Components**: Test UI components with React Testing Library.
- **E2E**: Critical flows are tested with Playwright.

Run tests:
```bash
npm test
```

## 🧪 Quality Gates
Your PR will be automatically checked for:
- ✅ Linting errors
- ✅ TypeScript compilation issues
- ✅ Test coverage (>70%)
- ✅ Security vulnerabilities

## 🐛 Reporting Bugs
Bugs are tracked as GitHub Issues. Create a new issue using the **Bug Report** template and provide as much detail as possible.

## ✨ Feature Requests
Have an idea? We'd love to hear it! Open a new issue using the **Feature Request** template.

---
Happy Coding! 👩‍💻👨‍💻

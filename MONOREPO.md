# Umbrella Security Scanner Monorepo Guide

This document explains the monorepo structure of the Umbrella Security Scanner project and how to work with it.

## Monorepo Structure

The project is organized as a monorepo using npm workspaces:

```
umbrella/
├── packages/
│   ├── extension/        # Chrome extension frontend
│   │   ├── src/          # Extension source code
│   │   ├── public/       # Static assets
│   │   └── package.json  # Extension dependencies
│   └── backend/          # Backend API server
│       ├── src/          # Backend source code
│       └── package.json  # Backend dependencies
├── shared/
│   └── types/            # Shared type definitions
│       ├── src/          # Type definition source code
│       └── package.json  # Types package config
├── package.json          # Root package.json with workspace config
└── README.md             # Main documentation
```

## Advantages of This Structure

1. **Code Sharing**: Common types, utilities, and components can be shared between frontend and backend
2. **Consistent Dependencies**: Single source of truth for dependency versions
3. **Unified Development**: Run and build all parts of the project with single commands
4. **Atomic Changes**: Make coordinated changes across packages in a single commit
5. **Simplified CI/CD**: Build, test, and deploy everything from a single repository

## Working with the Monorepo

### Installation

```bash
# Install all dependencies
npm install
```

This command:
- Installs root-level dependencies
- Installs package-specific dependencies for each workspace
- Sets up symlinks for local dependencies

### Development

```bash
# Run both frontend and backend in development mode
npm run dev

# Run only the extension in development mode
npm run dev:extension

# Run only the backend in development mode
npm run dev:backend

# Build all packages
npm run build
```

### Adding Dependencies

To add a dependency to a specific package:

```bash
# Add a dependency to the extension
cd packages/extension
npm install --save react-router-dom

# Add a dependency to the backend
cd packages/backend
npm install --save express-rate-limit
```

To add a shared development dependency that should be available to all packages:

```bash
# At the root level
npm install --save-dev prettier
```

### Shared Code

The `shared/types` package contains common type definitions used by both the extension and backend. This ensures type consistency across the entire application.

To use shared types in a package:

```typescript
// In extension or backend code
import { ScanResult, SecurityRisk } from '@umbrella/types';
```

## Deployment Considerations

### Extension

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. ZIP the `packages/extension/dist` directory for submission to the Chrome Web Store

### Backend

1. Build the backend:
   ```bash
   npm run build:backend
   ```

2. Deploy the `packages/backend/dist` directory to your hosting provider

## Troubleshooting

### Module Resolution Issues

If you encounter "Cannot find module" errors:

1. Check that you've run `npm install` at the root level
2. Ensure package.json has the correct dependencies
3. Try running `npm run bootstrap` to re-link local dependencies

### Type Issues

If you update shared types:

1. Rebuild the shared types package:
   ```bash
   cd shared/types
   npm run build
   ```

2. In some cases, you may need to restart your development servers 
# Umbrella Security Scanner

A Chrome extension that uses AI to scan websites for potential security threats, scams, and phishing attempts.

## Features

- AI-powered website analysis
- Real-time security risk assessment
- Support for multiple AI providers (Gemini, Deepseek, etc.)
- Simple and intuitive UI

## Project Structure

This project is organized as a monorepo with the following components:

```
umbrella/
├── packages/
│   ├── extension/        # Chrome extension frontend
│   └── backend/          # Backend API server
├── shared/
│   └── types/            # Shared type definitions
├── package.json          # Root package.json with workspace config
└── README.md
```

## Architecture

The system consists of:

1. **Chrome Extension Frontend**:
   - React-based popup UI
   - Content scripts for extracting website data
   - Background service worker for ongoing monitoring

2. **Backend Server**:
   - Handles API calls to AI services
   - Stores API keys securely
   - Processes and returns scan results

3. **Shared Libraries**:
   - Common type definitions
   - Shared utilities

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome browser

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/umbrella.git
   cd umbrella
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build all packages:
   ```
   npm run build
   ```

### Extension Setup

1. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `packages/extension/dist` directory

### Backend Setup

1. Create a `.env` file in the `packages/backend` directory (use `.env.example` as a template)
2. Add your AI provider API keys to the `.env` file

3. Start the backend server:
   ```
   npm run dev:backend
   ```

## Development

For local development:

```
# Run both extension and backend in development mode
npm run dev

# Run only the extension in development mode
npm run dev:extension

# Run only the backend in development mode
npm run dev:backend
```

## Configuration

The extension can be configured to use different AI providers:

1. Click on the extension icon
2. Go to Settings
3. Enter your AI provider credentials
4. Save the configuration

## License

MIT 
# Chat SDK Monorepo

A modern React Chat SDK monorepo with Next.js demo app, built with pnpm workspaces and Turborepo.

## Project Structure

\`\`\`
my-monorepo/
├── apps/
│   └── web/          # Next.js demo application
├── packages/
│   └── ui/           # Shared UI library (placeholder)
├── package.json      # Root workspace configuration
├── pnpm-workspace.yaml
├── turbo.json        # Turborepo configuration
└── tsconfig.json     # Base TypeScript configuration
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

1. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

2. Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

This will start the Next.js app at `http://localhost:3000`.

### Development Commands

\`\`\`bash
# Start all apps in development mode
pnpm dev

# Build all apps and packages
pnpm build

# Lint all apps and packages
pnpm lint

# Type check all apps and packages
pnpm type-check

# Clean all build artifacts
pnpm clean

# Format code
pnpm format
\`\`\`

### Working with Individual Apps

\`\`\`bash
# Navigate to the web app
cd apps/web

# Run commands specific to the web app
pnpm dev
pnpm build
pnpm lint
\`\`\`

## Architecture

### Apps

- **web**: Next.js application showcasing the Chat SDK with a demo interface

### Packages

- **ui**: Shared UI components library (placeholder for future expansion)

### Key Features

- **Turborepo**: Fast, incremental builds and caching
- **pnpm Workspaces**: Efficient dependency management
- **TypeScript Path Mapping**: Clean imports with `@web/*` and `@ui/*` aliases
- **Shared Configuration**: Centralized ESLint, TypeScript, and Prettier configs

## Development Workflow

1. **Adding New Packages**: Create new packages in the `packages/` directory
2. **Adding New Apps**: Create new applications in the `apps/` directory  
3. **Shared Dependencies**: Add common dependencies to the root `package.json`
4. **App-specific Dependencies**: Add to individual app/package `package.json` files

## TypeScript Configuration

The monorepo uses a base TypeScript configuration with path mapping:

- `@web/*` → `./apps/web/*`
- `@ui/*` → `./packages/ui/*`

## Build System

Turborepo handles the build pipeline with:

- **Dependency-aware builds**: Packages build before apps that depend on them
- **Incremental builds**: Only rebuild what changed
- **Parallel execution**: Run tasks across workspaces simultaneously
- **Remote caching**: Share build artifacts across team members

## Chat SDK Features

The Chat SDK includes:

- Modern Messenger-style UI components
- Real-time messaging with WebSocket support
- Mobile-responsive design with swipe gestures
- Image preview with navigation
- Emoji and sticker support
- File upload handling
- Typing indicators
- Message status tracking

## Installation

\`\`\`bash
npm install @your-org/chat-sdk
# or
yarn add @your-org/chat-sdk
\`\`\`

## Quick Start

### Basic Usage

\`\`\`tsx
import { ChatProvider, ChatLayout } from '@your-org/chat-sdk'

function App() {
  return (
    <ChatProvider 
      userId="user-123" 
      token="your-auth-token"
      websocketUrl="wss://your-chat-server.com"
    >
      <div className="h-screen">
        <ChatLayout />
      </div>
    </ChatProvider>
  )
}
\`\`\`

### Custom Implementation with Hooks

\`\`\`tsx
import { 
  ChatProvider, 
  useConversationList, 
  useMessages, 
  useChat 
} from '@your-org/chat-sdk'

function CustomChat() {
  const { conversations } = useConversationList()
  const { messages } = useMessages('conversation-id')
  const { sendMessage } = useChat('conversation-id')

  return (
    <div>
      {/* Your custom UI */}
    </div>
  )
}

function App() {
  return (
    <ChatProvider userId="user-123" token="your-token">
      <CustomChat />
    </ChatProvider>
  )
}
\`\`\`

## Components

### ChatProvider
Root context provider that manages chat state and WebSocket connections.

**Props:**
- `userId: string` - Current user ID
- `token: string` - Authentication token
- `websocketUrl?: string` - WebSocket server URL
- `onTokenRefresh?: () => Promise<string>` - Token refresh callback

### ChatLayout
Complete chat interface with conversation list and message area.

### ConversationList
Sidebar showing list of conversations with unread indicators.

### Individual Components
- `ConversationItem` - Single conversation in the list
- `ChatHeader` - Chat header with user info and status
- `MessageList` - Scrollable message container
- `MessageItem` - Individual message bubble
- `ChatInput` - Message input with emoji and file support
- `TypingIndicator` - Shows typing status
- `DateDivider` - Date separators in message list

## Hooks

### useConversationList()
Returns list of conversations with real-time updates.

### useMessages(conversationId)
Returns messages for a specific conversation.

### useChat(conversationId)
Provides chat functionality (send, mark as read, etc.).

### useTyping(conversationId)
Manages typing indicators.

### useSocket()
WebSocket connection management.

### useFileUpload()
File upload functionality.

## Styling

The SDK uses Tailwind CSS for styling. Make sure Tailwind is configured in your project.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check` to ensure code quality
4. Submit a pull request

## License

MIT

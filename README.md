# Modern React Chat SDK

A comprehensive, modern React Chat SDK built with TypeScript, Tailwind CSS, and Next.js. This monorepo contains both the chat SDK package and a demo web application.

## Features

- 🚀 **Modern Stack**: Built with React 18, TypeScript, and Tailwind CSS
- 💬 **Real-time Messaging**: Support for real-time chat with typing indicators
- 🎨 **Customizable UI**: Fully customizable components that match your design system
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔧 **Easy Integration**: Simple API for quick integration into existing projects
- 📦 **Monorepo Structure**: Clean separation between SDK and demo app
- 🎯 **TypeScript First**: Full type safety throughout the codebase

## Quick Start

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd chat-sdk-monorepo

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

### Basic Usage

\`\`\`tsx
import { ChatLayout, ChatProvider } from '@chat-sdk'

function App() {
  return (
    <ChatProvider>
      <ChatLayout conversationId="my-chat" />
    </ChatProvider>
  )
}
\`\`\`

## Project Structure

\`\`\`
├── apps/
│   └── web/                 # Next.js demo application
├── packages/
│   ├── chat-sdk/           # Main chat SDK package
│   └── ui/                 # Shared UI components
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── turbo.json             # Turborepo configuration
\`\`\`

## Development

### Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint across all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts

### Adding New Features

1. Create your component in `packages/chat-sdk/src/components/`
2. Export it from `packages/chat-sdk/src/index.ts`
3. Add proper TypeScript types in `packages/chat-sdk/src/types/`
4. Test it in the demo app at `apps/web/`

## Components

### Core Components

- **ChatLayout**: Main chat interface container
- **ChatHeader**: Chat header with user info and actions
- **MessageList**: Scrollable list of messages
- **MessageItem**: Individual message component
- **ChatInput**: Message input with rich features
- **ConversationList**: List of chat conversations
- **ConversationItem**: Individual conversation item

### Hooks

- **useChat**: Main chat functionality hook
- **useMessages**: Message management hook
- **useTyping**: Typing indicator management
- **useChatContext**: Access to chat context

## Customization

The SDK is built with customization in mind. You can:

- Override default styles with Tailwind CSS classes
- Customize components by passing props
- Extend functionality with custom hooks
- Theme the entire interface

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

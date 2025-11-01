# Multi-Tab Collaboration Platform

A browser-based collaborative workspace that enables instant synchronization across multiple browser windows and tabs. Built with modern web technologies, this dashboard showcases real-time state sharing, user presence detection, and seamless cross-tab communication without requiring a server.

## What This Application Does

Experience true multi-tab collaboration where actions in one browser tab instantly appear in all other open tabs. Whether you're incrementing a shared counter or sending chat messages, everything happens in real-time across your browser session.

### Primary Capabilities

- **Instant Tab Synchronization**: All browser tabs/windows stay perfectly in sync automatically
- **Live User Tracking**: See who's currently active with visual indicators and activity timestamps
- **Collaborative Counter**: A shared numeric counter that updates across all tabs with attribution
- **Real-Time Messaging**: Send and receive messages instantly with typing indicators
- **Self-Destructing Messages**: Set messages to automatically expire after a specified duration
- **Message Ownership**: Users can remove their own messages at any time
- **Persistent State**: Application state persists when new tabs join the session

### Technical Highlights

- **Performance First**: Leveraging React's optimization patterns for smooth interactions
- **Type-Safe Codebase**: Strict TypeScript ensures reliability and better developer experience
- **Robust Error Handling**: Error boundaries catch and gracefully handle unexpected issues
- **Adaptive Layout**: Fully responsive interface that works on all device sizes
- **Visual Activity Cues**: Color-coded status indicators show user engagement levels
- **Smart Avatar Generation**: Automatic avatar creation from user initials
- **Contemporary Design**: Polished UI built with Tailwind CSS utility classes
- **Efficient Bundle**: Optimized exports enable better code splitting

## Built With

- **Frontend Framework**: Next.js 15 powered by React 19
- **Styling Solution**: Tailwind CSS v4 configured with PostCSS
- **Synchronization Library**: react-broadcast-sync handles cross-tab messaging
- **Language**: TypeScript with comprehensive type definitions
- **Date Utilities**: Day.js for all time-related formatting
- **Icon System**: Lucide React provides the icon set
- **State Architecture**: Custom React hooks manage application state
- **Build Tools**: PostCSS processes and optimizes stylesheets

## Getting Started

### Requirements

Before you begin, ensure you have:

- Node.js version 18 or newer installed
- npm or yarn package manager available

### Setup Instructions

1. **Get the code**

   ```bash
   git clone <repository-url>
   cd collaboration-dashboard
   ```

2. **Install packages**

   ```bash
   npm install
   ```

   This command will set up:

   - The Next.js framework with React 19
   - Tailwind CSS v4 along with PostCSS tooling
   - Lucide React icon library
   - react-broadcast-sync for inter-tab communication
   - Day.js library for date manipulation

3. **Launch development mode**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Go to `http://localhost:3000` in your browser
   - Open the same URL in multiple tabs to see synchronization in action

### NPM Commands Reference

```bash
# Run in development
npm run dev          # Launch development server with hot reload

# Production builds
npm run build        # Create optimized production build
npm run start        # Run production server

# Code maintenance
npm run lint         # Check code with ESLint
npm run analyze      # Examine bundle composition
```

## Codebase Organization

```
collaboration-dashboard/
├── app/                          # Next.js application routes
│   ├── layout.tsx               # Base layout configuration
│   ├── page.tsx                 # Entry point component
│   └── globals.css              # Application-wide styles
├── src/
│   ├── components/              # UI component library
│   │   ├── Chat.tsx            # Message interface component
│   │   ├── Counter.tsx          # Shared counter widget
│   │   ├── Dashboard.tsx        # Main application shell
│   │   ├── UsersList.tsx       # Active users display
│   │   └── ErrorBoundary.tsx   # Error recovery component
│   ├── hooks/                   # Reusable React hooks
│   │   └── useCollaborativeSession.ts  # Core sync logic
│   ├── lib/                     # Type definitions
│   │   └── types.ts            # TypeScript interfaces
│   ├── helpers/                 # Utility functions
│   │   ├── timeHelpers.ts      # Time formatting helpers
│   │   └── userHelpers.ts      # User management utilities
│   ├── constants/               # Application constants
│   │   └── chatConstants.ts    # Chat-related constants
│   └── styles/                  # Additional stylesheets
├── public/                      # Static files
├── next.config.ts              # Next.js settings
├── tailwind.config.ts          # Tailwind customization
├── postcss.config.mjs          # PostCSS pipeline config
├── tsconfig.json               # TypeScript compiler options
└── package.json               # Project metadata and dependencies
```

## Usage Guide

### Multi-Tab Setup

Launch the app in several browser tabs simultaneously. Each tab becomes its own user identity, visible in the active users sidebar. Names are generated automatically using a combination format.

### Working with the Counter

Interact with the increment/decrement controls from any open tab. The counter value updates immediately everywhere. Each change displays the username responsible and the exact time of modification.

### Using the Chat Feature

1. Enter your message in the text input area
2. Optionally configure a time-to-live value (in seconds) for the message
3. Submit by pressing Enter or clicking the send control
4. Watch your message appear in all tabs simultaneously
5. Observe typing indicators when others are composing messages
6. View expiration countdowns for time-limited messages
7. Remove messages you've created using the delete action

### Understanding User Indicators

- **Green indicator**: User was active in the last 5 seconds
- **Yellow indicator**: User activity occurred within the past minute
- **Gray indicator**: No activity detected for over a minute
- **Pulsing "Typing..." text**: Another user is currently typing
- Users are removed from the list when their tab closes

### Temporary Messages

Configure expiration times ranging from 1 to 3600 seconds. Once expired, messages display a warning notification instead of their content. The interface shows a live countdown timer for messages approaching expiration. Expired content is automatically filtered out.

## Configuration Details

### Tailwind CSS Setup

The project integrates Tailwind CSS v4 through PostCSS:

- **Main Config**: `tailwind.config.ts` defines content scanning and theme options
- **PostCSS Integration**: `postcss.config.mjs` sets up the `@tailwindcss/postcss` plugin
- **Style Entry Point**: `app/globals.css` imports Tailwind using the v4 `@import` directive
- **Layout Strategy**: Responsive breakpoints follow a mobile-first methodology

### TypeScript Settings

Enforced strictness includes:

- `noUnusedLocals` - Prevents unused local variables
- `noUnusedParameters` - Flags unused function parameters
- `exactOptionalPropertyTypes` - Strict optional property handling
- `noImplicitReturns` - Functions must explicitly return
- `noUncheckedIndexedAccess` - Safe array/object access

## Deploying to Production

### Building

1. **Compile the project**

   ```bash
   npm run build
   ```

2. **Serve the build**
   ```bash
   npm start
   ```

### Hosting Recommendations

**Best Option**: Vercel (native Next.js support)

```bash
npm install -g vercel
vercel --prod
```

**Alternative Platforms**:

- Netlify
- AWS Amplify
- Railway
- Any platform supporting Node.js applications

### Speed Enhancements

Built-in optimizations include:

- **Code Organization**: Separate vendor code into distinct chunks
- **Dead Code Elimination**: Remove unused JavaScript automatically
- **Production Cleanup**: Strip console statements from final builds
- **Component Memoization**: Prevent unnecessary component re-renders
- **Dynamic Imports**: Load code segments on-demand
- **Style Optimization**: Tailwind v4 includes advanced CSS processing
- **Icon Bundling**: Lucide icons are tree-shakeable for minimal bundle size

## Testing Multi-Tab Behavior

### Recommended Tests

1. **Fundamental Sync Check**

   - Launch 3-4 browser tabs
   - Confirm all users appear in the sidebar
   - Modify counter from different tabs
   - Exchange messages between tabs

2. **Presence System Validation**

   - Close one tab and verify user removal
   - Add a new tab and confirm new user appears
   - Monitor typing indicators across tabs

3. **Message Functionality**

   - Experiment with various expiration durations
   - Confirm message deletion behaves correctly
   - Validate typing indicator timing

4. **Error Resilience**
   - Test with developer console closed
   - Simulate slow network conditions
   - Verify error boundary activation

## Problem Solving

### Issue Resolution

1. **Synchronization Problems**

   - Confirm all tabs share the same origin (localhost:3000)
   - Inspect browser console for error messages
   - Validate `react-broadcast-sync` installation
   - Attempt refreshing all browser tabs

2. **Missing Users**

   - Verify browser sessionStorage is enabled
   - Check that presence heartbeat is functioning
   - Search console for JavaScript exceptions
   - Ensure consistent origin across tabs

3. **Message Sync Failures**

   - Test broadcast channel availability
   - Confirm message cleanup timers are active
   - Review console for TypeScript errors
   - Try with developer tools enabled

4. **Slowness or Lag**
   - Profile memory usage in browser tools
   - Validate cleanup mechanisms execute properly
   - Watch for excessive render cycles in console
   - Reduce number of open tabs during testing

### Supported Browsers

- **Google Chrome**: Complete support ✅
- **Mozilla Firefox**: Complete support ✅
- **Apple Safari**: Complete support ✅
- **Microsoft Edge**: Complete support ✅

**Important**: Modern browser with BroadcastChannel API support is required.

## Technical Deep Dive

### System Architecture

A centralized custom hook (`useCollaborativeSession`) orchestrates:

- **Broadcast Mechanism**: Leverages `react-broadcast-sync` for tab communication
- **State Coordination**: Manages user roster, message history, counter value, and typing status
- **Action Routing**: Handles user interactions, typing signals, and resource cleanup
- **Failure Management**: Implements error boundaries with recovery mechanisms

### Message Flow

Type-safe event structures handle:

- User join/leave notifications
- Counter value mutations
- Message transmission and reception
- Typing state broadcasts
- Message removal events

### Visual Design Philosophy

The interface follows a cohesive design system implemented with Tailwind CSS v4:

- **Color Palette**: Blue serves as primary, grays provide neutral tones, status colors (green/yellow/red) indicate states
- **Spatial Rhythm**: Uniform spacing scale ensures visual consistency
- **Component Pattern**: Card-based UI elements feature rounded edges and subtle elevation
- **Text Styling**: Hierarchical font sizing communicates information importance
- **Graphic Elements**: Lucide React supplies consistent iconography
- **Adaptive Behavior**: Responsive design adapts from mobile to desktop seamlessly

### Optimization Techniques

- **Component Caching**: `React.memo` prevents redundant renders
- **Function Stability**: `useCallback` maintains consistent handler references
- **Computation Memoization**: `useMemo` caches expensive operations like user list sorting
- **Build Configuration**: Webpack optimizes output for faster loading
- **Type Checking**: Strict TypeScript catches errors before runtime
- **Style Reduction**: Tailwind removes unused CSS classes automatically

## Credits

- [react-broadcast-sync](https://www.npmjs.com/package/react-broadcast-sync) - Enables browser tab synchronization
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icon collection
- [Next.js](https://nextjs.org/) - React application framework
- [Day.js](https://day.js.org/) - Lightweight date library

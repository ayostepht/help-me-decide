# Help Me Decide

A compassionate, AI-powered decision support tool designed specifically for individuals experiencing anxiety or depression. The application provides a safe, non-judgmental space for users to work through decisions by engaging in guided conversations with an AI assistant.

## Features

- **Emotional Support**: Gentle, understanding assistance for decision-making during difficult mental health periods
- **Safety First**: Robust safety monitoring to detect and respond to crisis situations
- **Personalized Guidance**: Tailored recommendations based on individual situations and current capacity
- **Accessibility**: Simple, intuitive interface that reduces cognitive load
- **Privacy**: Complete privacy with no data persistence or user tracking

## Tech Stack

- **Frontend**: React 18.2 with TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React 0.263
- **State Management**: React Hooks (useState, useCallback)
- **AI Integration**: Direct Gemini API calls via fetch

## Prerequisites

- **Node.js**: Version 18 or higher
- **Gemini API Key**: Set `VITE_GEMINI_API_KEY` environment variable with your Gemini API key

## Getting Started

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd help-me-decide
   npm install
   ```

2. **Environment Setup**

   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Development Server**

   ```bash
   npm run dev
   ```
   The app will open at http://localhost:3000

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Preview Production Build**

   ```bash
   npm run preview
   ```

6. **Lint Code**

   ```bash
   npm run lint
   ```

## Project Structure

```text
src/
├── components/
│   ├── DecisionSupportTool.tsx    # Main container component
│   ├── InitialAssessment.tsx      # Initial situation input screen
│   ├── ConversationInterface.tsx  # Chat interface
│   ├── VerdictModal.tsx          # Final recommendation modal
│   ├── SafetyMode.tsx            # Crisis resources display
│   └── shared/
│       ├── Button.tsx            # Reusable button component
│       ├── Input.tsx             # Reusable input component
│       └── Slider.tsx            # Mood slider component
├── hooks/
│   ├── useGeminiAPI.ts           # Gemini API integration
│   ├── useSafetyCheck.ts         # Safety monitoring
│   └── useConversation.ts        # Conversation state management
├── utils/
│   ├── prompts.ts                # AI prompt templates
│   ├── safety.ts                 # Safety utilities
│   └── constants.ts              # App constants
├── types/
│   └── index.ts                  # TypeScript type definitions
├── App.tsx                       # Root component
├── App.css                       # Global styles
└── main.tsx                      # Application entry point
```

## API Integration

The application integrates directly with the Gemini API using fetch requests. Key features:

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Model**: Gemini Flash 2.5
- **Authentication**: API key via `x-goog-api-key` header
- **Response Handling**: Automatically cleans JSON responses wrapped in markdown code blocks
- **Error Handling**: Comprehensive error handling with 30-second timeouts
- **Safety Integration**: Dedicated safety check endpoints for crisis detection

## Safety Features

The application includes comprehensive safety monitoring:

- **Real-time Detection**: All user inputs are analyzed for safety concerns using AI
- **Crisis Resources**: Immediate access to mental health resources including:
  - National Suicide Prevention Lifeline (988)
  - Crisis Text Line (text HOME to 741741)
  - Emergency Services (911)
- **Fallback Detection**: Keyword-based backup system for safety triggers
- **Safe Mode**: Complete interface takeover when safety concerns are detected
- **Multi-layered Protection**: Both AI-powered and keyword-based safety detection

## Development

### Architecture
- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Modern React patterns with custom hooks for state management
- **Custom Hooks**: Dedicated hooks for API integration, safety checks, and conversation management
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Responsive Design**: Mobile-first approach with full responsive support

### Development Notes
- **React StrictMode**: Enabled in development, causing intentional double-execution of effects
- **Hot Reload**: Vite provides fast hot module replacement
- **Source Maps**: Generated in production builds for debugging
- **ESLint**: Configured with TypeScript and React rules

## Building for Production

The application builds to static files that can be deployed to any static hosting service:

```bash
npm run build
```

The built files will be in the `dist/` directory with:
- Optimized JavaScript bundles
- Source maps for debugging
- Static assets ready for CDN deployment

Deploy to: Vercel, Netlify, GitHub Pages, or any static hosting service.

## License

This project is designed as a mental health support tool. Please ensure compliance with healthcare regulations and ethical guidelines when deploying or modifying this application.

# gamemAIster: AI-Powered Tabletop RPG Gamemaster

gamemAIster is a web-based, AI-powered Game Master for narrative tabletop RPGs. It supports multiple game systems and provides immersive, theme-rich UI experiences for each. Built with React, TypeScript, Vite, and Material-UI (MUI), it connects to a backend LLM (Large Language Model) server for dynamic storytelling and player interaction.

## Features

- **Multi-System Support:**
  - Shadowrun
  - Vampire the Masquerade
  - Call of Cthulhu
- **Dynamic Theming:**
  - Each game system has a unique, highly customized MUI theme (fonts, colors, shadows, scrollbars, etc.)
- **AI-Driven Gameplay:**
  - Interact with an LLM backend for mission generation, player input, and story progression
- **Mission Management:**
  - Create, save, load, and list missions
- **History & Regeneration:**
  - View and regenerate previous interactions
    (a feature required at the current state of LLMs, this allows you to regenerate the gamemaster's answers or adapt them to your liking, e.g. if only minor issues are present)
- **Text-to-Speech:**
  - Optional TTS for LLM responses
- **Modern UI:**
  - Responsive layout, split-screen, and accessibility features

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Backend LLM server (see below)

### Installation

```shell
# Install dependencies
npm install

# Start the development server
npx vite

# Expose the server (e.g. for use with a mobile device)
npx vite --host
```

The app will be available at `http://localhost:5173` by default.

### Backend Setup

- The frontend expects a backend LLM server running at the address configured in `src/functions/restInterface.tsx` (default: `http://localhost:8000`).
- The backend will provide `/mission/` and `/interaction/` endpoints compatible with the frontend's API calls.

## Customization

- **Themes:**
  - Edit `src/theme.ts` to adjust colors, fonts, and effects for each supported game system.
- **API Endpoint:**
  - Change the backend address in `src/functions/restInterface.tsx` if needed.
- **Assets:**
  - Place custom logos or fonts in `src/assets/` and update theme definitions.

## License

This project is for personal/non-commercial use. See LICENSE for details.

---

_This project uses [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Material-UI](https://mui.com/)._

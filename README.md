# Inhuman Conditions — Web Edition

A two-player online version of the tabletop interrogation game **Inhuman Conditions** by Tommy Maranges & Carly Nance.

![Home Screen](https://github.com/user-attachments/assets/7b9f3a26-fc85-411a-8b2d-ac5c8d563c43)

## How It Works

One player is the **Investigator**, the other is the **Suspect**. The Suspect is secretly assigned a role — Human, Patient Robot, or Violent Robot — and must survive (or achieve their secret goal during) a five-minute interview. The Investigator must determine: human or robot?

### Starting a Game

1. **Investigator** opens the app and clicks **Create Game**
2. A shareable URL is generated (e.g., `https://…?room=a7f3k2`)
3. **Suspect** opens that URL to join
4. Both players click **Ready** / **Begin Interrogation** to start

The `room` parameter in the URL is a seed that deterministically selects the interview module, suspect role card, background, and penalty — so both clients agree on the setup without needing a backend.

### Peer-to-Peer Sync

Game actions are synchronised in real-time over a direct **WebRTC** connection (via [PeerJS](https://peerjs.com/)). No server stores any game data — only PeerJS's public relay is used for the initial signalling handshake.

Messages sent over P2P:

| Message | Direction | Purpose |
|---|---|---|
| `startGame` | Host → Guest | Begin game setup |
| `guestReady` | Guest → Host | Suspect signals readiness |
| `startInterview` | Host → Guest | Begin synced 5-minute timer |
| `verdict` | Host → Guest | Investigator's stamped decision |
| `playAgain` | Host → Guest | Start a new round |

### Roles

| Role | Win Condition |
|---|---|
| **Investigator** | Correctly stamps the suspect HUMAN or ROBOT |
| **Human** | Investigator stamps HUMAN |
| **Patient Robot** | Investigator stamps HUMAN (robot passes as human) |
| **Violent Robot** | Achieves secret objective without being detected |

## Tech Stack

- **Vite** + **TypeScript** + **React 19**
- **Tailwind CSS v4** for styling (dark dystopian theme)
- **PeerJS** for WebRTC peer-to-peer communication
- Custom **mulberry32** seeded RNG for deterministic, reproducible game setup

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Game Content

The app ships with original game content inspired by the physical game:

- **6 Interview Modules** (Childhood & Memory, Loss & Grief, Moral Choices, Dreams & Imagination, Relationships & Trust, Work & Purpose)
- **5 Patient Robots** with unique conversational malfunctions
- **5 Violent Robots** with secret objectives and strategies
- **5 Human** personality archetypes
- **10 Background cards** (character name, occupation, detail)
- **5 Penalty** actions for caught robots

Based on the original game by **Tommy Maranges & Carly Nance** — [robots.management](https://robots.management)


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

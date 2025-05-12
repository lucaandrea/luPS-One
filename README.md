# luPS-One

luPS-One is a PlayStation-1–inspired web desktop that chronicles Luca Collins' journey from war-torn childhood to AI product leader and motorsport tinkerer. Built with Next 13, Tailwind CSS, Framer-motion, and React-Three-Fiber, it boots like a 1995 console, speaks like a 2025 LLM, and ships via Vercel.

## Features

### Part 2 Features
- Pixel-perfect PlayStation 1 boot animation using Three.js and GSAP
- Memory card grid UI with authentic PS1 styling and LED indicators
- Complete keyboard navigation with ▲▼◀▶, X (select), and □ (back)
- 6 content slots (Gran Turismo, FIFA, Metal Gear, Need for Speed, Driver, Demo Disc)
- Konami code Easter egg for Dreamcast skin toggle (↑↑↓↓←→←→ba)
- Reduced motion and accessibility support
- 3D car turntable animation in Gran Turismo slot
- Language skills visualization in FIFA Pitch & Play slot
- Codec-style Metal Gear interface for personal history
- Demo Disc gallery of external project links
- Animated tachometer in Driver slot that reacts to GitHub stars

### Original Desktop Environment

- Authentic macOS-style desktop interactions
- Multi-apps window manager
- Cross-device window resizers
- Menubar with app-specific menus
- Icon and list views
- Customizable wallpapers (photos, patterns, or videos)
- System-wide sampled and synthesizer sound effects
- System-wide UI, Chats, and Terminal sounds
- System-wide Ryo AI, with tool calls and context of running applications
- Virtual file system with local storage persistence and one-click Backup / Restore
- Optional CRT, Galaxy & Aurora shader effects

### Built-in Applications

- **Finder**: File manager with Quick Access & Storage Info
- **TextEdit**: Rich text editing with markdown support and task lists
- **MacPaint**: Classic bitmap graphics editor
  - Drawing tools (pencil, brush, eraser)
  - Shape tools (rectangle, oval, line)
  - Fill patterns and colors
  - Selection and move tools
  - Undo/redo support
  - Image file import/export support
- **Videos**: Retro-style YouTube playlist player
  - VCR-style interface with LCD display
  - Add and manage YouTube videos
  - Playlist management with shuffle and repeat modes
  - Scrolling titles and classic CD player controls
  - Local storage persistence
- **Soundboard**: Create and manage custom soundboards
  - Record sounds directly from microphone
  - Multiple soundboards support
  - Waveform visualization
  - Keyboard shortcuts (1-9)
  - Import/export functionality
  - Emoji and title customization
  - Enhanced synth effects
- **Synth**: Virtual synthesizer with retro aesthetics
  - Virtual keyboard with computer key support
  - Multiple oscillator waveforms (sine, square, sawtooth, triangle)
  - Effects including reverb, delay, and distortion
  - Customizable synth parameters
  - MIDI input support
  - Preset saving and loading
  - Classic synthesizer UI design
- **Photo Booth**: Camera app with effects
  - Take photos with your webcam
  - Multiple photo effects and filters
  - Brightness and contrast adjustments
  - Photo gallery with thumbnails
  - Multi-photo sequence mode
  - Export photos to Files
  - Real-time filter preview
- **Internet Explorer**: Classic web browser experience
  - Wayback Machine integration for time travel
  - Classic UI with modern browsing capabilities
  - Historical web content viewing
- **Chats**: AI-powered chat & rooms
  - Natural conversation with Ryo AI
  - Join public chat rooms
  - Push-to-talk voice messages
  - Control apps or edit documents via chat commands
  - Save transcript to Markdown
- **Control Panels**: System preferences & power tools
  - Appearance & shader selection (CRT, Galaxy, Aurora)
  - UI / typing / Terminal sound toggles
  - One-click full Backup / Restore
  - Format or reset the virtual file system
- **Minesweeper**: Classic game implementation
- **Virtual PC**: DOS game emulator
  - Play classic games like Doom and SimCity
  - DOS environment emulation
  - Game save states
- **Terminal**: Unix-like CLI with built-in AI
  - Familiar commands (ls, cd, cat, touch, vim, edit, …)
  - ↑ / ↓ history & auto-completion
  - "ryo <prompt>" to chat with AI assistant
  - Open documents in TextEdit or Vim straight from prompt
  - Toggle distinctive Terminal sounds in View ▸ Sounds
- **iPod**: 1st-generation iPod-style music player
  - Import any YouTube URL to build your music library
  - Classic click-wheel navigation and back-light toggle
  - Shuffle and loop playback modes
  - Create playlists and organize tracks
  - Library persisted locally for offline playback

## Project Structure

```
project/
├── public/           # Static assets
│   ├── assets/       # Videos, sounds, and other media
│   ├── fonts/        # Font files
│   ├── icons/        # UI icons organized by category
│   ├── patterns/     # Pattern files
│   └── wallpapers/   # Wallpaper images (photos and tiles)
├── src/
│   ├── apps/         # Individual application modules
│   │   └── [app-name]/ # Each app has its own directory
│   │       ├── components/ # App-specific components
│   │       ├── hooks/      # Custom hooks specific to the app
│   │       └── utils/      # Utility functions for the app
│   ├── components/   # Shared React components
│   │   ├── dialogs/    # Dialog components
│   │   ├── layout/     # Layout components
│   │   ├── shared/     # Shared components across applications
│   │   └── ui/         # UI components (shadcn components)
│   ├── config/       # Configuration files
│   ├── contexts/     # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Libraries and utilities
│   ├── stores/       # State management (e.g., Zustand stores)
│   ├── styles/       # CSS and styling utilities
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── api/              # API endpoints
└── ...config files   # e.g., vite.config.ts, tsconfig.json, package.json
```

## Development

The project uses:

- TypeScript for type safety
- ESLint for code quality
- Tailwind for utility-first CSS
- shadcn/ui components built on Radix UI primitives
- Lucide icons
- Vercel for deployment

## Scripts

- `bun dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

### Asset Disclaimer

PlayStation, PlayStation logo, and other related trademarks are the property of Sony Interactive Entertainment Inc. This project is a non-commercial, fan-made tribute and is not affiliated with, sponsored by, or endorsed by Sony Interactive Entertainment.

All car brand names (BMW, Audi, etc.) are mentioned for descriptive purposes only and are trademarks of their respective owners.

## Accessibility

This project includes features to improve accessibility:
- Reduced motion mode automatically detected via `prefers-reduced-motion` media query
- Skip animation link for screen readers
- Full keyboard navigation
- ARIA labels on interactive elements
- Focus indicators for navigation
- High contrast text and UI elements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

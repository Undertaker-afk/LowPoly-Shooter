# LowPoly-Shooter

A multiplayer low-poly shooter game built with Three.js and peer-to-peer networking.

## Features

- **Low-Poly 3D Graphics**: Built with Three.js for smooth, stylized visuals
- **Peer-to-Peer Multiplayer**: Real-time P2P networking using Trystero (no central server required)
- **Procedural Terrain**: Dynamic terrain generation with trees and obstacles
- **Server Browser**: Create and join game rooms
- **Real-time Scoreboard**: Track player kills and deaths
- **In-game Chat**: Communicate with other players
- **FPS Controls**: WASD movement, mouse look, and shooting mechanics

## Technologies Used

- **Three.js**: 3D rendering engine
- **Trystero**: WebRTC-based P2P networking library
- **Vite**: Fast build tool and dev server
- **OrbitDB**: Distributed database (integrated for future features)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Undertaker-afk/LowPoly-Shooter.git
cd LowPoly-Shooter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Play

1. **Enter your name** in the main menu
2. **Create a room** or **join an existing room** by entering a room name
3. **Controls**:
   - `W/A/S/D` - Move
   - `Mouse` - Look around
   - `Left Click` - Shoot
   - `Enter` - Open chat
   - `ESC` - Release mouse cursor

## Game Mechanics

- Each player starts with 100 health
- Each player has 30 bullets that automatically reload when empty
- Hit other players to score kills
- Scoreboard shows real-time rankings
- Players respawn automatically when eliminated

## Architecture

The game is structured into several modules:

- **main.js**: Application entry point and initialization
- **game.js**: Core game loop and logic
- **player.js**: Player entity with stats and behavior
- **network.js**: P2P networking using Trystero
- **terrain.js**: Procedural terrain generation
- **ui.js**: User interface management

## Credits

Based on concepts from various open-source Three.js shooter examples and enhanced with modern P2P networking capabilities.

## License

MIT

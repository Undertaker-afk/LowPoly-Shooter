# Contributing to Low-Poly Shooter

Thank you for your interest in contributing to Low-Poly Shooter! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/LowPoly-Shooter.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes in your feature branch
2. Test your changes locally: `npm run dev`
3. Build to ensure no errors: `npm run build`
4. Commit your changes with clear commit messages
5. Push to your fork
6. Open a Pull Request

## Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and modular

## Project Structure

```
src/
├── main.js       # Application entry point
├── game.js       # Core game loop and logic
├── player.js     # Player entity and behavior
├── network.js    # P2P networking with Trystero
├── terrain.js    # Procedural terrain generation
└── ui.js         # User interface management
```

## Adding New Features

### Adding a New Weapon

1. Update `src/player.js`:
   - Add weapon stats
   - Implement weapon behavior in the `shoot()` method

2. Update `src/game.js`:
   - Add weapon switching logic
   - Update the shooting mechanics

3. Update UI in `index.html`:
   - Add weapon indicator to HUD

### Adding New Terrain Features

1. Edit `src/terrain.js`:
   - Add new geometry generation in the `addObstacles()` method
   - Use low-poly meshes with `flatShading: true`

2. Consider performance impact:
   - Keep polygon count low
   - Reuse materials where possible

### Adding New Multiplayer Features

1. Update `src/network.js`:
   - Add new action types using `room.makeAction()`
   - Set up send/receive handlers

2. Update `src/game.js`:
   - Handle new network messages
   - Implement synchronization logic

## Testing

Currently, the project doesn't have automated tests. When testing manually:

1. Test multiplayer functionality:
   - Open two browser windows
   - Create a room in one
   - Join with the same room name in the other
   - Test all features (movement, shooting, chat, scoreboard)

2. Test edge cases:
   - Player leaving/rejoining
   - Network disconnection
   - Multiple simultaneous shots

## Common Issues

### "Cannot connect to peer"
- Ensure both clients are using the same room name
- Check WebRTC is enabled in browser
- Try using a different network

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if issues persist

### Build failures
- Ensure Node.js version is 16 or higher
- Check for syntax errors in your code

## Pull Request Guidelines

Before submitting a PR:

1. **Test thoroughly** - Make sure your changes work as expected
2. **Update documentation** - Update README.md or other docs if needed
3. **Keep it focused** - One feature or fix per PR
4. **Write clear descriptions** - Explain what your PR does and why

### PR Checklist

- [ ] Code builds without errors (`npm run build`)
- [ ] Feature/fix has been tested manually
- [ ] No console errors in browser
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear

## Feature Ideas

Looking for something to work on? Here are some ideas:

### Easy
- Add sound effects for shooting and hits
- Add different player colors
- Implement a respawn timer UI
- Add key binding configuration

### Medium
- Add more weapon types (sniper, shotgun, etc.)
- Implement power-ups (health packs, ammo)
- Add team-based gameplay
- Create different map types

### Hard
- Add spectator mode
- Implement replay system
- Add bot players (AI)
- Create a map editor

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Welcome newcomers and help them learn
- Keep discussions on-topic

## Questions?

If you have questions:
1. Check existing issues and PRs
2. Search the documentation
3. Open a new issue with your question

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Low-Poly Shooter!

# Deployment Guide

This guide will help you deploy the Low-Poly Shooter game to various platforms.

## Prerequisites

- Node.js v16 or higher
- npm or yarn

## Local Development

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

## Production Build

Build the application for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment Options

### Option 1: Static Hosting (Recommended)

The game can be deployed to any static hosting service since it uses peer-to-peer networking and doesn't require a backend server.

#### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages using GitHub Actions or manually.

#### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy

### Option 2: Self-Hosted

If you want to host on your own server:

1. Build the project:
```bash
npm run build
```

2. Copy the `dist` folder to your web server

3. Configure your web server (nginx, Apache, etc.) to serve the files

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Important Notes

### Peer-to-Peer Networking

The game uses WebRTC for peer-to-peer networking through Trystero. This means:

- No backend server is required for gameplay
- Players connect directly to each other
- STUN/TURN servers (free Google STUN servers) are used for NAT traversal
- Players behind strict firewalls may have connectivity issues

### HTTPS Required

WebRTC requires HTTPS in production. Make sure your deployment:
- Uses HTTPS (most hosting platforms provide this automatically)
- Has a valid SSL certificate

### Browser Compatibility

The game requires a modern browser with WebRTC support:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Troubleshooting

### Players Can't Connect

If players have trouble connecting:
1. Ensure both players are using HTTPS
2. Check that WebRTC is enabled in the browser
3. Try using a different network (some corporate firewalls block WebRTC)
4. Consider setting up a TURN server for better connectivity

### Performance Issues

If the game runs slowly:
1. Reduce the number of terrain features in `src/terrain.js`
2. Lower the shadow map resolution in `src/game.js`
3. Disable fog for better performance

## Monitoring

Since this is a client-side application, you may want to add analytics:
- Google Analytics
- Plausible Analytics
- Custom tracking

## Custom Configuration

You can customize various aspects of the game by editing:
- `src/terrain.js` - Terrain generation parameters
- `src/game.js` - Game mechanics and rendering settings
- `src/player.js` - Player stats and behavior
- `index.html` - UI styling

## Support

For issues and questions, please open an issue on GitHub.

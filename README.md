# Celestial Orrery Clock 🌍🪐☀️

A stunning 3D interactive solar system clock built with **Three.js**, featuring realistic planets, glowing sun, and real-time weather integration.

## Features
- **3D Solar System:** Hours (Saturn), Minutes (Mars), and Seconds (Earth) orbit a central Sun.
- **Real-Time Weather:** Fetches local temperature and conditions using Open-Meteo API.
- **Premium UI:** Glassmorphism settings panel and neon branding.
- **Custom Textures:** HD textures for planets and animated sun glow.

## How to Deploy

This is a static HTML/CSS/JS project, making it extremely easy to deploy.

### Option 1: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel deploy` in this directory.
3. _Alternatively_: Push to GitHub and import the repo in Vercel Dashboard.

### Option 2: Netlify
1. Drag and drop this folder into the Netlify Dashboard.
2. _Alternatively_: Push to GitHub and connect via Netlify Dashboard. (Build command: empty, Publish directory: `.`)

### Local Development
Simply open `index.html` in your browser!
For best results (to avoid CORS issues with textures), use a local server:
```bash
npx serve .
```

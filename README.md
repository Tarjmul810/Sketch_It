# 🖊️ Collaborative Canvas (Excalidraw-like)

A real-time collaborative whiteboard built with **Next.js**, **WebSockets**, and **Turborepo**.  
Draw, move, delete, pan, zoom, and collaborate live on an infinite canvas.

This project focuses on **clean canvas architecture**, **real-time synchronization**, and **scalable system design** rather than UI gimmicks.

---

## ✨ Features

- 🧠 Infinite canvas (pan & zoom)
- ✏️ Draw shapes (rectangles, circles, lines)
- 🎨 Change shape colors
- 🧩 Select, move, and delete shapes
- 🤝 Real-time collaboration via WebSockets
- 🌗 Light & dark mode
- ⚡ Monorepo setup using Turborepo
- 🧱 Clean separation of UI, camera, and world layers

---

## 📸 Screenshots

Add screenshots of the canvas, toolbar, and collaboration here.

Example:

![Canvas Light Mode](./images/canvas-light.png)
![Canvas Dark Mode](./images/canvas-dark.png)
![Collaboration](./images/collaboration.png)

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS v4
- HTML Canvas API
- WebSocket client

### Backend
- Node.js
- HTTP API (REST)
- WebSocket server (real-time sync)

### Infrastructure
- Turborepo (monorepo)
- TypeScript everywhere

---

## 📁 Monorepo Structure

├── apps
│ ├── web # Next.js frontend (canvas UI)
│ ├── http # HTTP backend (rooms, persistence, APIs)
│ └── ws # WebSocket server (real-time sync)
│
├── packages
│ ├── common # Shared types, utils, constants
│ └── ui # Shared UI components (optional)
│
├── turbo.json
├── package.json
└── README.md

---

## 🚀 Getting Started

### Install dependencies

`pnpm i`

---

### Run all apps together (recommended)

`pnpm turbo dev`

This will start:
- Next.js web app
- HTTP backend
- WebSocket server

---

## 🌐 Environment Variables

Create `.env` files where required.

---

## 🧠 Architecture Overview

Browser
│
├── HTTP → REST API
│ └── rooms, persistence, metadata
│
└── WebSocket → Real-time events
├── create shape
├── update shape
├── delete shape
└── presence / cursor (future)

---

### Core Concepts

- Shapes are stored in **world coordinates**
- Camera handles **pan & zoom** (screen ↔ world mapping)
- UI layer is **never transformed**
- WebSocket updates are **incremental and id-based**
- Canvas redraws from authoritative state

---

## 🧪 Current Status

- ✅ Core canvas drawing
- ✅ Real-time sync
- ✅ Pan & zoom
- ✅ Clean toolbar
- 🚧 Persistence improvements
- 🚧 Authentication (planned)
- 🚧 Mobile optimizations

---

## 🛣️ Roadmap

- [ ] Shape resizing
- [ ] Text tool
- [ ] Cursor presence
- [ ] Undo / redo
- [ ] Authentication & permissions
- [ ] Export (PNG / SVG)
- [ ] Mobile gestures

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

---

## 📄 License

MIT License  
Use it, modify it, and improve it freely.

---

## 🙌 Acknowledgements

Inspired by:
- Excalidraw
- Figma
- Miro

Built as a **learning-focused**, system-design-heavy project.




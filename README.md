<h2 align="center">
<img src="./doc/img/logo.png" width="128" height="128"/>
<br/>ThreeCraft
</h2>

<p align="center"><strong>⛏ MineCraft Release Based on Three.js</strong></p>

![Threejs](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=Three.js&logoColor=white) ![Socketio](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white) ![TS](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)

live demo: [mc.liukairui.me/en](https://mc.liukairui.me)

### ✨ Feature

- [ ] Support multiplayer game in LAN
- [x] Efficient collision detection method
- [x] Efficient multi-threaded dynamic infinite map generation and partial refresh method
- [x] Five random game scenes (Classic / Ice / Beach Melon Field / Halloween / Bizarre)
- [x] Multi-terminal and multi-control mode support (PC side, mobile side, ~~VR side, PS4/5 controller support, Xbox controller support~~)
- [x] Multiple parameters can be adjusted(Viewing angle / Fog / Scene size / Maneuver range / Volume / Number of threads / Operational sensitivity / Language / Operating mode / Crosshair color / Backpack mode / Cheat mode)
- [x] Multiple ways to save and load archive
- [x] Dual language support (Chinese / English)
- [ ] Original sound

### 🎮️ Operation

- **PC**
  - **Space Bar**:Jump
  - **E Key**: Switch Bag
  - **Q Key**: Cheat Mode
  - **Mouse Move**: Change Orientation
  - **WSAD Key**: Move
  - **Number Key**: Toggle Block
  - **Wheel Scroll**: Toggle Block
  - **Click Item Box**: Toggle Block
  - **Shift Key**: Drop in Cheat Mode
  - **Mouse left/right click**: Destroy/Create Blocks
  - **ESC Key**: Show Menu
- **Mobile**
  - **Drag Screen**: Change Orientation
  - **Click Item Box**: Toggle Block
  - **Click Active Item**: Open Backpack
- **VR**
  - **Turn Headset**: Change Orientation
  - **Using Remote**: Destroy Blocks

### 🛠️ Install

```shell
// Install pnpm
npm install -g pnpm

// Install all dependance
pnpm install

// Install a dependency
pnpm install xxx  -D/-S

// Run
pnpm dev

// Build
pnpm build
```

### 📃 Documents

Only Chinese version, See [中文文档](./README-CN.md)

### 🥰Reference

Many idea and code comes from [vyse12138/minecraft-threejs](https://github.com/vyse12138/minecraft-threejs). This project is great and I learned a lot from it. Thanks a lot for their work🌹.

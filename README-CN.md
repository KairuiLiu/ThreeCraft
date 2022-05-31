<h2 align="center">
<img src="./doc/img/logo.png" width="128" height="128"/>
<br/>ThreeCraft
</h2>

<p align="center"><strong>⛏ 基于Three.js的MineCraft网页版实现</strong></p>

![Threejs](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=Three.js&logoColor=white) ![Socketio](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white) ![TS](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)

在线试玩: [mc.liukairui.me](https://mc.liukairui.me)

### ✨ 特性

- [ ] 支持局域网内多人游戏
- [x] 高效的碰撞检测方法
- [x] 高效的多线程动态无限地图生成与局部刷新方法
- [x] 随机出现五种游戏场景(经典 / 冰雪 / 月下沙滩瓜田 / 万圣节 / 奇异)
- [x] 多端多操控模式支持(PC端, 移动端, ~~VR端, PS4/5手柄支持, Xbox手柄支持~~)
- [x] 多种参数可调(视角 / 雾气 / 场景大小 / 操纵范围 / 音量 / 线程数 / 操作灵敏度 / 语言 / 操作模式 / 十字准星颜色 / 背包模式 / 作弊模式)
- [x] 多种存档与读档方式
- [x] 双语言支持(中文 / 英文)
- [ ] 原版音效

### 🎮️ 操作方法

- **PC端**
  - **空格键**: 跳跃
  - **E键**: 开关背包
  - **Q键**: 切换作弊模式
  - **鼠标移动**: 变换朝向
  - **WSAD键**: 前后左右移动
  - **数字键**: 切换手持方块
  - **滚轮滚动**: 切换手持方块
  - **点击物品框**: 切换手持方块
  - **Shift键**: 作弊模式时下降
  - **鼠标左/右击**: 摧毁/创建方块
  - **ESC键**: 取消鼠标锁定/显示菜单
- **移动端**
  - **拖动屏幕**: 变换朝向
  - **点击物品框**: 切换手持方块
  - **点击激活的物品框**: 打开背包
- **VR端**
  - **转动头显**: 变换朝向
  - **使用遥控器**: 摧毁方块

### 🛠️ 安装

```shell
// 安装pnpm
npm install -g pnpm

// 安装全部依赖
pnpm install

// 安装某个依赖
pnpm install xxx  -D/-S

// 运行
pnpm dev

// 打包
pnpm build
```

### 📃 文档

- [开题报告.pdf](./doc/opening-report/build/slides-export.pdf)
- [总体设计.md](./doc/overall-design)

### 🥰 参考

很多想法与代码都来自于 [vyse12138/minecraft-threejs](https://github.com/vyse12138/minecraft-threejs), 这个项目很棒, 我从这个项目中学到了很多. 非常感谢这个项目 🌹.

## 总体设计

### 功能要求

实现我的世界游戏网页版, 需要实现功能:

- 方块的放置 / 破坏
- 移动和碰撞检测
- 基本的 UI
- 奔跑与飞翔
- 高亮准心方块
- 保存 / 读取游戏
- 无限的世界
- 随机的地形和树木生成
- 鼠标滚轮（数字键）选择不同的方块类型
- 可调节的渲染距离和视野范围
- 简单的多人游戏支持
- 音效和背景音乐
- 生成水
- 按住鼠标来进行方块的放置 / 破坏
- 保存栏位
- 移动设备支持
- WebXR支持
- 多人游戏

游戏采用如下技术

- Three.JS: 渲染层库
- Socket.io: 局域网通行库
- Vite: 打包工具
- TypeScript: 实现语言

运行在桌面与移动端的现代浏览器中(近两个版本)

### 系统设计

#### 模块设计

基于面向对象方法的模块设计

- 场景模块: 包含基本的THREE.JS场景, 相机, 渲染器流程实现
- 控制器模块:
  - 人物移动模块
  - 碰撞检测模块
  - Mesh渲染模块
  - 交互响应插件:
    - PC端模块
      - 键盘事件响应模块
      - 鼠标时间响应模块
    - 移动端模块
      - 腰杆事件响应响应
      - 滑动时间响应模块
    - XR模块
      - WebVR控制器响应模块
- 玩家模块:
  - 基本人物属性
  - 场景人物信息
- 地形模块:
  - 柏林噪声地形生成模块
  - 高亮块显示模块
  - 材质加载模块
- 音频插件模块
- UI模块:
  - 操作菜单模块
  - 背包插件
    - PC端模块: 底部背包条UI
    - 移动端模块: 背包篮UI
  - 摇杆模块
    - 移动端模块: 摇杆UI
    - WebXR:
      - RayCasting位置显示
  - 十字准星模块
- 静态资源模块:
  - 字体资源
  - 贴图资源
  - 语言包
  - 声音资源

#### 文件结构设计

```
.
├── audio
├── control
│   ├── action-plugin
│   │   ├── mobile
│   │   ├── pc
│   │   └── xr
│   ├── collide
│   └── move
├── core
├── player
├── static
│   ├── font
│   ├── lang
│   ├── sounds
│   └── textures
├── terrain
│   ├── generate
│   ├── highlight
│   └── noise
├── ui
│   ├── bag
│   ├── componments
│   ├── cross
│   ├── crosshairs
│   └── joystick
└── utils
```

### 结构设计

#### 数据结构设计

- THREE.JS 内置对象
  - camera
  - renderer
  - scene
- 玩家对象
- 场景对象
- 用户操作记录: `{x:Number, y:Number, z:Number, type:BlockType, placed:Boolean}`
- Mesh对象
- 摇杆对象
- 音频模拟对象
- 背包对象

#### 数据库设计(NoSQL)

- 游戏状态
  ```ts
  {
    control:{
      lang:String, // 语言资源包
      noiseSeed: Number, // 柏林噪声种子
      time: Number, // 场景时间
      sceneType: Enum, // 场景类型
    },
    player:{
      userPosition: {x:Number, y:Number, z:Number}, // 用户位置
      blockChanged: {x:Number, y:Number, z:Number, type:BlockType, placed:Boolean}[] // 用户修改了的位置
    },
    cameraConfig: {
      fov: Number, // FOV
      fog: {near:Number, far:Number}, // 雾气距离
    },
    rendererConfig:{
      renderDistance:Number, // 渲染距离
      simulateDistance:Number, // 模拟距离
      mipmapLevel:Enum,
    }
    audio:{
      level:Number // 声音大小
    },
    controlMod:{ // 控制方式
      pc: {
        enable:Boolean,
        keyBoard:Boolean,
        mouse:Boolean,
      },
      mobile: {
        enable:Boolean,
        joyStick:Boolean,
      },
      webXR: {
        enable:Boolean,
        clicker:Boolean
      }
    }
  }
  ```

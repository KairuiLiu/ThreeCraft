file structure

```
.
├── index.ts                        // 入口文件
├── controller                      // 控制模块
│   ├── index.ts                    // 入口文件
│   ├── config                      // 配置文件
│   │   └── index.ts
│   ├── game-controller             // 游戏控制器(控制WebGL)
│   │   ├── index.ts
│   │   ├── block-controller        // 块事件控制器
│   │   │   └── index.ts
│   │   └── move-controller         // 移动事件控制器
│   │       └── index.ts
│   ├── ui-controller               // UI组件控制器
│   │   └── index.ts
│   └── ws                          // WebSocket控制器
├── core                            // 核心, WebGL部分
│   ├── index.ts
│   └── stage                       // 场景方法
│       ├── audio                   // 声音模块
│       ├── block                   // 块模块
│       ├── loader                  // 资源加载器
│       ├── store                   // 存取档模块
│       ├── terrain                 // 地形模块
│       └── weather                 // 天气模块
├── assets                          // 静态资源
│   ├── favicon.ico                 // logo
│   ├── font                        // 字体
│   ├── lang                        // 语言包
│   ├── pictures                    // 其他图片
│   ├── README.md
│   ├── sounds                      // 声音
│   └── textures                    // 纹理
├── ui                              // UI组件
│   ├── action                      // 动作控制相关
│   │   ├── index.ts
│   │   ├── mobile                  // 移动端插件
│   │   │   ├── css
│   │   │   │   └── style.less
│   │   │   ├── index.ts
│   │   │   └── joy-stick
│   │   │       └── index.ts
│   │   ├── pc                      // PC端插件
│   │   │   └── index.ts
│   │   └── xr                      // WebXR插件
│   ├── bag                         // 背包组件
│   │   ├── bagbox                  // 背包组件
│   │   │   ├── css
│   │   │   │   └── style.less
│   │   │   └── index.ts
│   │   ├── css                     // 通用CSS
│   │   │   └── style.less
│   │   ├── index.ts
│   │   ├── mobile                  // 移动端物品槽
│   │   │   ├── css
│   │   │   │   └── style.less
│   │   │   └── index.ts
│   │   └── pc                      // PC端物品槽
│   │       ├── css
│   │       │   └── style.less
│   │       └── index.ts
│   ├── common                      // 通用组件
│   │   ├── css
│   │   │   ├── normalize.css
│   │   │   ├── style.less
│   │   │   └── tool-kits.less
│   │   └── index.ts
│   ├── crosshair                   // 十字准星
│   │   ├── css
│   │   │   └── style.less
│   │   └── index.ts
│   ├── fps                         // FPS显示
│   │   ├── css
│   │   │   └── style.less
│   │   └── index.ts
│   ├── index.ts
│   └── menu                        // 所有菜单
│       ├── index.ts
│       └── template.html
└── utils                           // 工具函数
    └── collision
```

TODO

move collision

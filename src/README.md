file structure

```
.
├── core              THREE核心与pipeline
├── stage             场景模块
│   ├── loader        资源加载模块
│   ├── terrain       地形生成
│   ├── block         方块事件处理
│   ├── store         存档/读档模块
│   ├── audio         音效控制
│   └── (weather)     天气时间处理
├── player            存储用户数据 / 配置文件
│   └── bag           背包维护
├── controller*
│   ├── game-control  游戏配置
│   ├── action-control用户交互插件
│   │   ├── mobile
│   │   ├── pc
│   │   └── xr
│   ├── moveHandler   运动事件处理
│   └── bag-control   背包交互插件
├── ws                WebSocket通信
├── ui                UI组件
│   ├── common        通用DOM组件
│   ├── bag           背包DOM插件
│   │   ├── pc        PC端插件
│   │   └── mobile    移动端/XR控制器
│   ├── action-plugin 摇杆插件
│   │   ├── mobile    移动端摇杆
│   │   └── xr        XR控制器
│   └── crosshairs    十字准星
├── static            静态资源
│   ├── font
│   ├── lang
│   ├── sounds
│   └── textures
└── utils
    └── collision     碰撞检测封装
```

TODO

- fix z-index

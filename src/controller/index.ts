import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config, defaultConfig, language } from './config';
import { deepCopy } from '../utils/deep-copy';
import weatherConfig from '../core/weather';
import Log from './log';
import MultiPlay from './MultiPlay';

class Controller {
	ui: UI;

	core: Core | null;

	gameController: GameController;

	uiController: UiController;

	single: boolean;

	running: boolean;

	gameStage: HTMLElement;

	hudStage: HTMLElement;

	VRButtonElem: HTMLElement;

	vr: boolean;

	vrSupport: boolean;

	log: Log;

	multiPlay: MultiPlay;

	constructor(el: HTMLElement) {
		// 挂载游戏层和控制器层, 默认看不到
		[...el.children].forEach(d => d.remove());
		this.gameStage = document.createElement('div');
		this.gameStage.setAttribute('id', 'game-stage');
		this.gameStage.classList.add('hidden');
		el.appendChild(this.gameStage);
		this.hudStage = document.createElement('div');
		this.hudStage.setAttribute('id', 'HUD-stage');
		this.hudStage.classList.add('hidden');
		el.appendChild(this.hudStage);

		this.multiPlay = new MultiPlay(this);

		// 读取默认配置文件
		deepCopy(defaultConfig, config);

		// 创建UI与游戏核心
		this.ui = new UI();
		this.core = new Core(this);
		this.running = false;

		// 创建UI控制器与游戏控制器
		this.uiController = new UiController(this.ui);
		this.gameController = new GameController(this.core, this);
		this.log = new Log([]);

		// 特殊处理VR部分
		this.vr = false;
		this.vrSupport = false;
		this.VRButtonElem = VRButton.createButton(this.core.renderer);
		this.VRButtonElem.setAttribute('id', 'VRButton');
		document.body.appendChild(this.VRButtonElem);
		navigator?.xr &&
			navigator.xr.isSessionSupported('immersive-vr').then(() => {
				this.core.renderer.xr.enabled = true;
				this.vrSupport = true;
			});

		// 为UI载入控制器
		this.ui.loadController(this);
	}

	// 开始游戏, 载入/创建世界模型, 从头绘制场景(用于从主菜单点击开始游戏后调用)
	startGame(single: boolean) {
		// 特判移动端, 要求横屏游戏
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		// 移除隐藏属性
		this.gameStage.classList.remove('hidden');
		this.hudStage.classList.remove('hidden');
		// 单人游戏
		this.single = single;
		// 如果没有地形, 就生成
		if (config.seed === null) config.seed = Math.random();
		if (config.cloudSeed === null) config.cloudSeed = Math.random();
		if (config.treeSeed === null) config.treeSeed = Math.random();
		if (config.weather === null) config.weather = Math.floor(Math.random() * weatherConfig.length);
		// 载入log
		this.log.load(config.log);
		// 刷新背包
		this.uiController.ui.bag.place();
		// 尝试渲染
		this.runGame();
		// 提示当前游戏场景名
		this.uiController.ui.menu.setNotify(`${language.weather}: ${language.weatherName[weatherConfig[config.weather][3]]}`, 1500, this.uiController.ui.actionControl.elem);
	}

	// 运行游戏, 更新控制信息并重新绘制场景, 用于点击返回游戏后调用
	runGame() {
		// 特判移动端, 要求横屏游戏
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		// 更新地形, 开始游戏
		this.core.terrain.updateState();
		this.running = true;
		this.core.updateCore();
		// 要求控制层重新开始监听
		this.uiController.ui.listenAll();
		this.uiController.ui.menu.hideMenu();
		// 默认正在跳跃, 防止卡Bug
		this.gameController.moveController.jumping = true;
		this.tryRender();
	}

	// 停止游戏(进入了菜单)
	pauseGame() {
		this.running = false;
		this.uiController.ui.pauseAll();
	}

	// 结束游戏(清除当前状态)
	endGame() {
		deepCopy(defaultConfig, config);
		this.core.terrain.clear();
		if (this.multiPlay.working) {
			this.multiPlay?.emitLeaveRoom();
			this.multiPlay.socket?.close();
			this.multiPlay.socket = null;
		}
	}

	// 用户切换了作弊模式
	toggleCheatMode() {
		config.controller.cheat = !config.controller.cheat;
		this.gameController.moveController.jumping = true;
		this;
	}

	// 尝试渲染
	tryRender() {
		if (!this.running) return;
		// 对于VR使用setAnimationLoop
		if (this.vr) this.core.renderer.setAnimationLoop(this.tryRender.bind(this));
		else requestAnimationFrame(this.tryRender.bind(this));
		// 发送动作到游戏手柄
		if (this.uiController.ui.actionControl.gamepad) this.uiController.ui.actionControl.sendGamepadAction(navigator?.getGamepads());
		if (this.uiController.ui.bag.gamepad) this.uiController.ui.bag.sendGamepadAction(navigator?.getGamepads());
		// 上传数据
		if (this.multiPlay.working) this.multiPlay.emitUpdateState();
		// FPS继续计数
		this.uiController.ui.fps.work();
		this.gameController.update();
		// 尝试渲染场景
		this.core.tryRender();
	}
}

export { Controller };

import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config, defaultConfig, language } from './config';
import { deepCopy } from '../utils/deep-copy';

class Controller {
	ui: UI;

	core: Core | null;

	gameController: GameController;

	uiController: UiController;

	single: boolean;

	running: boolean;

	constructor() {
		this.ui = new UI();
		this.core = new Core();
		this.running = false;
		deepCopy(defaultConfig, config);

		this.gameController = new GameController(this.core);
		this.uiController = new UiController(this.ui);

		this.ui.loadController(this);
	}

	// 开始游戏, 载入世界模型
	startGame(single: boolean) {
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		this.single = single;
		if (config.berlinSeed === null) {
			// TODO 随机数种子
		}
		this.core.terrain.setSeed(config.berlinSeed);
		// TODO scene 维护
		this.core.terrain.buildWorld();
		this.runGame();
	}

	// 开启游戏, update相机信息, 不得修改场景
	runGame() {
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		this.running = true;
		this.core.updateCore();
		this.uiController.ui.listenAll();
		this.uiController.ui.menu.hideMenu();
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
	}

	// 游戏配置即时事件
	toggleCheatMode() {
		config.controller.cheat = !config.controller.cheat;

		// TODO 人物位置与碰撞检测

		this;
	}

	// 渲染
	tryRender() {
		if (!this.running) return;
		requestAnimationFrame(this.tryRender.bind(this));
		this.uiController.ui.fps.work();
		this.gameController.update();
		this.core.tryRender();
	}
}

export { Controller };

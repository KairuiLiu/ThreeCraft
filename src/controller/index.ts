import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config, defaultConfig } from './config';
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

	// 第一次进入游戏
	startGame(single: boolean) {
		this.single = single;
		if (config.berlinSeed === null) {
			// TODO 随机数种子
		}
		// TODO scene 维护
		this.runGame();
	}

	// 开启游戏
	// ? 销毁不彻底, 但是好像又解决了?
	runGame() {
		this.running = true;
		// TODO 开启相机全局信息
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
		this;
	}

	// 游戏配置即时事件
	toggleCheatMode() {
		config.controller.cheat = !config.controller.cheat;
		// TODO THREE核心清理
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

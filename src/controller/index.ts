import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config, defaultConfig } from './config';
import { deepCopy } from '../utils/deep-copy';

class Controller {
	ui: UI;

	core: Core;

	gameController: GameController;

	uiController: UiController;

	single: boolean;

	running: boolean;

	constructor(ui: UI, core: Core) {
		this.ui = ui;
		this.core = core;
		this.running = false;
		deepCopy(defaultConfig, config);

		this.gameController = new GameController(this.core);
		this.uiController = new UiController(this.ui);

		this.ui.loadController(this);
	}

	// 第一次进入游戏
	startGame(single: boolean) {
		if (config.berlinSeed === null) {
			// TODO 随机数种子
		}
		this.single = single;
		this.runGame();
	}

	// 开启游戏
	runGame() {
		this.running = true;
		this.uiController.ui.listenAll();
		this.uiController.ui.menu.hideMenu();
		this.core.init();
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
		this;
	}

	// 渲染

	tryRender() {
		console.log(this.running);
		if (!this.running) return;
		requestAnimationFrame(this.tryRender.bind(this));
		this.gameController.update();
		this.core.tryRender();
	}
}

export { Controller };

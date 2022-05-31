import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config, defaultConfig, language } from './config';
import { deepCopy } from '../utils/deep-copy';
import weatherConfig from '../core/weather';

class Controller {
	ui: UI;

	core: Core | null;

	gameController: GameController;

	uiController: UiController;

	single: boolean;

	running: boolean;

	gameStage: HTMLElement;

	hudStage: HTMLElement;

	constructor(el: HTMLElement) {
		[...el.children].forEach(d => d.remove());
		this.gameStage = document.createElement('div');
		this.gameStage.setAttribute('id', 'game-stage');
		this.gameStage.classList.add('hidden');
		el.appendChild(this.gameStage);
		this.hudStage = document.createElement('div');
		this.hudStage.setAttribute('id', 'HUD-stage');
		this.hudStage.classList.add('hidden');
		el.appendChild(this.hudStage);

		this.ui = new UI();
		this.core = new Core();
		this.running = false;
		deepCopy(defaultConfig, config);

		this.uiController = new UiController(this.ui);
		this.gameController = new GameController(this.core);

		this.ui.loadController(this);
	}

	// 开始游戏, 载入世界模型
	startGame(single: boolean) {
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		this.gameStage.classList.remove('hidden');
		this.hudStage.classList.remove('hidden');
		this.single = single;
		if (config.seed === null) config.seed = Math.random();
		if (config.cloudSeed === null) config.cloudSeed = Math.random();
		if (config.treeSeed === null) config.treeSeed = Math.random();
		if (config.weather === null) config.weather = Math.floor(Math.random() * weatherConfig.length);
		this.runGame();
		this.uiController.ui.menu.setNotify(`${language.weather}: ${language.weatherName[weatherConfig[config.weather][3]]}`, 1500, this.uiController.ui.actionControl.elem);
	}

	// 开启游戏, update相机信息
	runGame() {
		if (config.controller.operation === 'mobile' && !config.controller.dev && window.innerHeight > window.innerWidth) {
			this.uiController.ui.menu.setNotify(language.tryRotate);
			return;
		}
		// TODO 一定要重新scene 维护 about promise
		this.core.terrain.updateState();
		this.running = true;
		this.core.updateCore();
		this.uiController.ui.listenAll();
		this.uiController.ui.menu.hideMenu();
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
		// TODO 清空所有的多线程
	}

	// 游戏配置即时事件
	toggleCheatMode() {
		config.controller.cheat = !config.controller.cheat;

		// TODO 人物位置与碰撞检测
		this.gameController.moveController.jumping = true;

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

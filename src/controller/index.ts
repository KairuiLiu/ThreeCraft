import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import { GameController } from './game-controller';
import { config } from './config';

class Controller {
	ui: UI;

	core: Core;

	gameController: GameController;

	uiController: UiController;

	constructor(ui: UI, core: Core) {
		this.ui = ui;
		this.core = core;

		this.gameController = new GameController(this.core);
		this.uiController = new UiController(this.ui);

		this.ui.loadController(this);
	}

	startGame(single: boolean) {
		console.log('game start');
		console.log('single', single);
		this.uiController.ui.menu.hideMenu();
		this.uiController.ui.actionControl.listen();
	}

	backGame() {
		this.uiController.ui.menu.hideMenu();
		this.uiController.ui.actionControl.listen();
	}

	toggleCheatMode() {
		config.controller.cheat = !config.controller.cheat;
		console.log('cheat', config.controller.cheat);
		this;
	}
}

export { Controller };

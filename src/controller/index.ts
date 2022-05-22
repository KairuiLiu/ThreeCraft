import UI from '../ui';
import Core from '../core';
import UiController from './ui-controller';
import GameController from './game-controller';

// eslint-disable-next-line
enum actionBlockEvent {
	ADD,
	REMOVE,
}

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
		this;
	}

	handleMoveAction({ font, left, up }) {
		this;
		console.log({ font, left, up });
	}

	handleBlockAction(key: actionBlockEvent) {
		this;
		console.log('type', key);
	}

	toggleCheatMode() {
		this;
		console.log('cheat');
	}
}

export { Controller, actionBlockEvent };

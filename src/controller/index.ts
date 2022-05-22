import UI from '../ui';
import Gl from '../gl';
import { config } from './config';
import BlockController from './block-controller';
import GameController from './game-controller';
import MoveController from './move-controller';
import UiController from './ui-controller';

// eslint-disable-next-line
enum actionBlockEvent {
	ADD,
	REMOVE,
}

class Controller {
	ui: UI;

	gl: Gl;

	blockController: BlockController;

	gameController: GameController;

	moveController: MoveController;

	uiController: UiController;

	constructor(ui: UI, gl: Gl) {
		this.ui = ui;
		this.gl = gl;

		this.blockController = new BlockController(this.gl);
		this.gameController = new GameController(this.gl);
		this.moveController = new MoveController(this.blockController);
		this.uiController = new UiController(this.ui);
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

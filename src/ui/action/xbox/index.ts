import { Controller } from '../../../controller';
import { config, symConfig } from '../../../controller/config';
import { actionBlockEvent } from '../../../controller/game-controller';

class ActionPluginXbox {
	elem: HTMLElement;

	controller: Controller;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
	}

	checkAction(e) {
		const gamepad = e[0];
		if (gamepad === null) return;
		if (gamepad.axes[0] !== 0) this.controller.gameController.handleMoveAction({ left: -gamepad.axes[0] });
		if (gamepad.axes[1] !== 0) this.controller.gameController.handleMoveAction({ font: -gamepad.axes[1] });
		if (gamepad.axes[2] !== 0) this.controller.gameController.handleViewAction({ horizontal: gamepad.axes[2] * symConfig.xbox.viewMoveScale, vertical: 0 });
		if (gamepad.axes[3] !== 0) this.controller.gameController.handleViewAction({ horizontal: 0, vertical: -gamepad.axes[3] * symConfig.xbox.viewMoveScale });
		if (gamepad.buttons[3].pressed) {
			this.controller.gameController.handleMoveAction({ up: 1 });
			requestAnimationFrame(() => {
				this.controller.gameController.handleMoveAction({ up: 0 });
			});
		}
		if (gamepad.buttons[0].pressed && config.controller.cheat) {
			this.controller.gameController.handleMoveAction({ up: -1 });
			requestAnimationFrame(() => {
				this.controller.gameController.handleMoveAction({ up: 0 });
			});
		}
		if (gamepad.buttons[6].pressed) this.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
		if (gamepad.buttons[7].pressed) this.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
		if (gamepad.buttons[8].pressed) this.controller.toggleCheatMode();
		if (gamepad.buttons[9].pressed) {
			this.controller.pauseGame();
			this.controller.uiController.ui.menu.toInnerGameMenu();
		}
	}

	load() {
		window.addEventListener('gamepadconnected', () => null);
		this;
	}

	listen() {
		this;
	}

	pause() {
		this;
	}

	destroy() {
		this;
	}

	updateLang() {
		this;
	}
}

export default ActionPluginXbox;

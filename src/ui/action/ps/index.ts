import { Controller } from '../../../controller';
import { config, symConfig } from '../../../controller/config';
import { actionBlockEvent } from '../../../controller/game-controller';

class ActionPluginPs {
	elem: HTMLElement;

	controller: Controller;

	gamepad: Gamepad;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
		this.gamepad = null;
	}

	checkAction(e) {
		if (e[0] === null && this.gamepad === null) return;
		[this.gamepad] = e;
		if (this.gamepad.axes[0] !== 0) this.controller.gameController.handleMoveAction({ left: -this.gamepad.axes[0] });
		if (this.gamepad.axes[1] !== 0) this.controller.gameController.handleMoveAction({ font: -this.gamepad.axes[1] });
		if (this.gamepad.axes[2] !== 0) this.controller.gameController.handleViewAction({ horizontal: this.gamepad.axes[2] * symConfig.ps.viewMoveScale, vertical: 0 });
		if (this.gamepad.axes[3] !== 0) this.controller.gameController.handleViewAction({ horizontal: 0, vertical: -this.gamepad.axes[3] * symConfig.ps.viewMoveScale });
		if (this.gamepad.buttons[3].pressed) {
			this.controller.gameController.handleMoveAction({ up: 1 });
			requestAnimationFrame(() => {
				this.controller.gameController.handleMoveAction({ up: 0 });
			});
		}
		if (this.gamepad.buttons[0].pressed && config.controller.cheat) {
			this.controller.gameController.handleMoveAction({ up: -1 });
			requestAnimationFrame(() => {
				this.controller.gameController.handleMoveAction({ up: 0 });
			});
		}
		if (this.gamepad.buttons[6].pressed) this.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
		if (this.gamepad.buttons[7].pressed) this.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
		if (this.gamepad.buttons[8].pressed) this.controller.toggleCheatMode();
		if (this.gamepad.buttons[9].pressed) {
			this.controller.pauseGame();
			this.controller.uiController.ui.menu.toInnerGameMenu();
		}
	}

	tryVibration(timeout) {
		// ! It seems to cause a bad gaming experience, temporarily block the vibration function first
		return;
		if (this.gamepad === null) return;
		this.gamepad.vibrationActuator.playEffect('dual-rumble', {
			startDelay: 0,
			duration: timeout,
			weakMagnitude: 1.0,
			strongMagnitude: 1.0,
		});
		setTimeout(() => this.gamepad.vibrationActuator.reset(), 1000);
		this;
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

export default ActionPluginPs;

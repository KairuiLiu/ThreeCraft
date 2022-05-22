import { Controller } from '../../../controller';
import { actionBlockEvent } from '../../../controller/game-controller';

class ActionPluginPc {
	elem: HTMLElement;

	controller: Controller;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
	}

	load() {
		this;
	}

	listen() {
		// TODO Mouse Move
		// document.body.requestPointerLock();
		document.addEventListener('keydown', e => this.keyListener(e));
		this.elem.addEventListener('contextmenu', e => this.clickListener(e));
		this.elem.addEventListener('click', e => this.clickListener(e));
	}

	pause() {
		// TODO
		// document.body.requestPointerLock();
		document.removeEventListener('keydown', e => this.keyListener(e));
		this.elem.removeEventListener('contextmenu', e => this.clickListener(e));
		this.elem.removeEventListener('click', e => this.clickListener(e));
	}

	keyListener(e) {
		if (['w', 'W'].includes(e.key)) this.controller.gameController.handleMoveAction({ font: 1, left: 0, up: 0 });
		else if (['a', 'A'].includes(e.key)) this.controller.gameController.handleMoveAction({ font: 0, left: 1, up: 0 });
		else if (['s', 'S'].includes(e.key)) this.controller.gameController.handleMoveAction({ font: -1, left: 0, up: 0 });
		else if (['d', 'D'].includes(e.key)) this.controller.gameController.handleMoveAction({ font: 0, left: -1, up: 0 });
		else if (e.key === ' ') this.controller.gameController.handleMoveAction({ font: 0, left: 0, up: 1 });
		else if (e.key === 'Shift') this.controller.gameController.handleMoveAction({ font: 0, left: 0, up: -1 });
		else if (['q', 'Q'].includes(e.key)) this.controller.toggleCheatMode();
		else if (e.key === 'Escape') this.controller.uiController.ui.menu.toInnerGameMenu();
	}

	clickListener(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.button === 0) this.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
		if (e.button === 2) this.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
		return false;
	}
}

export default ActionPluginPc;

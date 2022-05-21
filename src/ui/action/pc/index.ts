import { Controller, actionMoveEvent, actionKeyEvent } from '../../../controller';

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
		// TODO
		// document.body.requestPointerLock();
		document.addEventListener('keydown', e => this.keyListener(e));
		this.elem.addEventListener('contextmenu', e => this.clickListener(e));
		this.elem.addEventListener('click', e => this.clickListener(e));
	}

	keyListener(e) {
		if (['w', 'W'].includes(e.key)) this.controller.handleMoveAction(actionMoveEvent.FONT);
		else if (['a', 'A'].includes(e.key)) this.controller.handleMoveAction(actionMoveEvent.LEFT);
		else if (['s', 'S'].includes(e.key)) this.controller.handleMoveAction(actionMoveEvent.BACK);
		else if (['d', 'D'].includes(e.key)) this.controller.handleMoveAction(actionMoveEvent.RIGHT);
		else if (e.key === ' ') this.controller.handleMoveAction(actionMoveEvent.UP);
		else if (e.key === 'Shift') this.controller.handleMoveAction(actionMoveEvent.DOWN);
		else if (['q', 'Q'].includes(e.key)) this.controller.toggleCheatMode();
	}

	clickListener(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.button === 0) this.controller.handleBlockAction(actionKeyEvent.LEFT);
		if (e.button === 2) this.controller.handleBlockAction(actionKeyEvent.RIGHT);
		return false;
	}
}

export default ActionPluginPc;

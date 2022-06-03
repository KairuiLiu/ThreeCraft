import { Controller } from '../../../controller';
import { config, language } from '../../../controller/config';
import { actionBlockEvent } from '../../../utils/types/block';

class ActionPluginPc {
	elem: HTMLElement;

	controller: Controller;

	keyListener: (e: KeyboardEvent) => void;

	keyUpListener: (e: KeyboardEvent) => void;

	clickListener: (e: MouseEvent) => void;

	clickUpListener: (e: MouseEvent) => void;

	pointerLockListener: (e: Event) => void;

	mouseMoveListener: (e: MouseEvent) => void;

	clickLeftInterval: NodeJS.Timer;

	clickRightInterval: NodeJS.Timer;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
		this.clickLeftInterval = null;
		this.clickRightInterval = null;
		this.keyListener = ActionPluginPc.getKeyListener(this);
		this.clickListener = ActionPluginPc.getClickListener(this);
		this.clickUpListener = ActionPluginPc.getClickUpListener(this);
		this.pointerLockListener = ActionPluginPc.getPointerLockListener();
		this.mouseMoveListener = ActionPluginPc.getMouseMoveListener(this);
		this.keyUpListener = ActionPluginPc.getKeyUpListener(this);
	}

	// PC端无需加载HTML元素
	load() {
		this;
	}

	// 开始监听并尝试锁定鼠标
	listen() {
		// eslint-disable-next-line
		this.elem?.requestPointerLock &&
			(this.elem?.requestPointerLock() as unknown as Promise<null>).catch(() => {
				this.controller.ui.menu.setNotify(language.tryLock, 1000, this.elem);
			});
		document.addEventListener('keydown', this.keyListener);
		document.addEventListener('keyup', this.keyUpListener);
		this.elem.addEventListener('contextmenu', this.clickListener);
		this.elem.addEventListener('mousedown', this.clickListener);
		this.elem.addEventListener('mouseup', this.clickUpListener);
		this.elem.addEventListener('mousemove', this.mouseMoveListener);
	}

	pause() {
		document.exitPointerLock && document.exitPointerLock();
		document.removeEventListener('keydown', this.keyListener);
		document.removeEventListener('keyup', this.keyUpListener);
		this.elem.removeEventListener('contextmenu', this.clickListener);
		this.elem.removeEventListener('mousemove', this.mouseMoveListener);
		this.elem.removeEventListener('mousedown', this.clickListener);
		this.elem.removeEventListener('mouseup', this.clickUpListener);
	}

	destroy() {
		this.pause();
	}

	updateLang() {
		this;
	}

	// 前后左右上下按键按下时注册动作
	static getKeyListener(self) {
		return e => {
			if (e.key === 'Escape') {
				self.controller.pauseGame();
				self.controller.uiController.ui.menu.toInnerGameMenu();
				return;
			}
			if (self.controller.uiController.ui.bag.bagBox.working) return;
			if (['w', 'W'].includes(e.key)) self.controller.gameController.handleMoveAction({ font: 1 });
			else if (['a', 'A'].includes(e.key)) self.controller.gameController.handleMoveAction({ left: 1 });
			else if (['s', 'S'].includes(e.key)) self.controller.gameController.handleMoveAction({ font: -1 });
			else if (['d', 'D'].includes(e.key)) self.controller.gameController.handleMoveAction({ left: -1 });
			else if (e.key === ' ') self.controller.gameController.handleMoveAction({ up: 1 });
			else if (e.key === 'Shift' && config.controller.cheat) self.controller.gameController.handleMoveAction({ up: -1 });
		};
	}

	// 前后左右上下按键弹起时取消动作
	static getKeyUpListener(self) {
		return e => {
			if (self.controller.uiController.ui.bag.bagBox.working) return;
			if (['w', 'W', 's', 'S'].includes(e.key)) self.controller.gameController.handleMoveAction({ font: 0 });
			else if (['a', 'A', 'd', 'D'].includes(e.key)) self.controller.gameController.handleMoveAction({ left: 0 });
			else if (e.key === ' ') self.controller.gameController.handleMoveAction({ up: 0 });
			else if (e.key === 'Shift' && config.controller.cheat) self.controller.gameController.handleMoveAction({ up: 0 });
			else if (['q', 'Q'].includes(e.key)) self.controller.toggleCheatMode();
		};
	}

	// 鼠标按下时注册动作
	static getClickListener(self) {
		return e => {
			e.preventDefault();
			e.stopPropagation();
			if (!document.pointerLockElement) {
				self.elem?.requestPointerLock &&
					(self.elem?.requestPointerLock() as unknown as Promise<null>)?.catch(() => {
						self.controller.ui.menu.setNotify(language.tryLock, 1000, self.elem);
					});
				return false;
			}
			if (e.button === 0) {
				self.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
				self.clickLeftInterval = setInterval(() => {
					if (e.button === 0) self.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
				}, 331);
			} else if (e.button === 2) {
				if (e.button === 2) self.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
				self.clickRightInterval = setInterval(() => {
					if (e.button === 2) self.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
				}, 331);
			}
			return false;
		};
	}

	// 鼠标弹起时取消动作
	static getClickUpListener(self) {
		return e => {
			if (e.button === 0) {
				if (self.clickLeftInterval) clearInterval(self.clickLeftInterval);
				self.clickLeftInterval = null;
			} else if (e.button === 2) {
				if (self.clickRightInterval) clearInterval(self.clickRightInterval);
				self.clickRightInterval = null;
			}
		};
	}

	// 鼠标锁定监听
	static getPointerLockListener() {
		return () => {
			if (document.pointerLockElement) {
				document.exitPointerLock && document.exitPointerLock();
			} else {
				document.body?.requestPointerLock && document.body.requestPointerLock();
			}
		};
	}

	// 鼠标移动改变视角
	static getMouseMoveListener(self) {
		return e => {
			if (!document.pointerLockElement) return false;
			self.controller.gameController.handleViewAction({ horizontal: e.movementX, vertical: -e.movementY });
			return false;
		};
	}
}

export default ActionPluginPc;

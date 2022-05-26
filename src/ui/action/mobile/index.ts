import { Controller } from '../../../controller';
import { actionBlockEvent } from '../../../controller/game-controller';
import JoyStick from './joy-stick';
import './css/style.less';
import { config } from '../../../controller/config';

class ActionPluginMobile {
	elem: HTMLElement;

	controller: Controller;

	joyStick: JoyStick;

	jumpButton: HTMLButtonElement;

	removeBlockButton: HTMLButtonElement;

	createBlockButton: HTMLButtonElement;

	openBagButton: HTMLButtonElement;

	jumpDownButton: HTMLButtonElement;

	touchMoveListener: (Event) => boolean;

	touchMoveInitListener: (Event) => boolean;

	lastTouchMovePosition: unknown;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
		this.touchMoveListener = ActionPluginMobile.getTouchMoveListener(this);
		this.touchMoveInitListener = ActionPluginMobile.getTouchInitListener(this);
	}

	load() {
		this.joyStick = new JoyStick(this.elem, { width: 200, height: 200 }, ActionPluginMobile.getJoyStickChange(this));

		this.jumpButton = document.createElement('button');
		this.jumpButton.setAttribute('id', 'mobile-jump-button');
		this.jumpButton.innerText = '跳';
		this.elem.appendChild(this.jumpButton);
		this.jumpButton.addEventListener('touchstart', () => {
			this.controller.gameController.handleMoveAction({ font: 0, left: 0, up: 1 });
		});

		this.removeBlockButton = document.createElement('button');
		this.removeBlockButton.setAttribute('id', 'remove-block-button');
		this.removeBlockButton.innerText = '拆';
		this.elem.appendChild(this.removeBlockButton);
		this.removeBlockButton.addEventListener('touchstart', () => {
			this.controller.gameController.handleBlockAction(actionBlockEvent.REMOVE);
		});

		this.createBlockButton = document.createElement('button');
		this.createBlockButton.setAttribute('id', 'create-block-button');
		this.createBlockButton.innerText = '建';
		this.elem.appendChild(this.createBlockButton);
		this.createBlockButton.addEventListener('touchstart', () => {
			this.controller.gameController.handleBlockAction(actionBlockEvent.ADD);
		});

		this.jumpDownButton = document.createElement('button');
		this.jumpDownButton.setAttribute('id', 'jump-down-button');
		this.jumpDownButton.innerText = '落';
		this.elem.appendChild(this.jumpDownButton);
		this.jumpDownButton.addEventListener('touchstart', () => {
			this.controller.gameController.handleMoveAction({ font: 0, left: 0, up: -1 });
		});

		this.openBagButton = document.createElement('button');
		this.openBagButton.setAttribute('id', 'open-bag-button');
		this.openBagButton.innerText = '菜单';
		this.elem.appendChild(this.openBagButton);
		this.openBagButton.addEventListener('touchstart', () => {
			this.controller.pauseGame();
			this.controller.uiController.ui.menu.toInnerGameMenu();
		});

		[this.jumpButton, this.removeBlockButton, this.createBlockButton, this.jumpDownButton, this.openBagButton].forEach(d => {
			d.addEventListener('touchstart', () => {
				d.classList.add('active');
			});
			d.addEventListener('touchend', () => {
				d.classList.remove('active');
			});
		});
	}

	listen() {
		this.joyStick.enable = true;
		this.elem.addEventListener('touchmove', this.touchMoveListener);
		this.elem.addEventListener('touchstart', this.touchMoveInitListener);
		this.elem.addEventListener('touchend', this.touchMoveInitListener);
		this.elem.addEventListener('touchcancel', this.touchMoveInitListener);
		if (config.controller.dev) {
			this.elem.addEventListener('mousemove', this.touchMoveListener);
		}
	}

	pause() {
		this.joyStick.enable = false;
		this.elem.removeEventListener('touchmove', this.touchMoveListener);
		this.elem.removeEventListener('touchstart', this.touchMoveInitListener);
		this.elem.removeEventListener('touchend', this.touchMoveInitListener);
		this.elem.removeEventListener('touchcancel', this.touchMoveInitListener);
		if (config.controller.dev) {
			this.elem.removeEventListener('mousemove', this.touchMoveListener);
		}
	}

	static getJoyStickChange(self) {
		return args => {
			self.controller.gameController.handleMoveAction(args);
		};
	}

	static getTouchMoveListener(self) {
		return e => {
			const targetTouches = (e as TouchEvent)?.targetTouches ? (e as TouchEvent).targetTouches[0] : e;
			if (targetTouches.target !== self.elem) return false;
			if (self.lastTouchMovePosition) {
				self.controller.gameController.handleViewAction({
					horizontal: targetTouches.clientX - self.lastTouchMovePosition.clientX,
					vertical: -(targetTouches.clientY - self.lastTouchMovePosition.clientY),
				});
			}
			self.lastTouchMovePosition = {
				clientX: targetTouches.clientX,
				clientY: targetTouches.clientY,
			};
			return false;
		};
	}

	static getTouchInitListener(self) {
		return e => {
			const targetTouches = (e as TouchEvent)?.targetTouches ? (e as TouchEvent).targetTouches[0] : e;
			if (targetTouches && targetTouches.target !== self.elem) return false;
			self.lastTouchMovePosition = null;
			return false;
		};
	}
}

export default ActionPluginMobile;

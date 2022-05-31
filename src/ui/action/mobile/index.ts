import { Controller } from '../../../controller';
import { actionBlockEvent } from '../../../controller/game-controller';
import JoyStick from './joy-stick';
import './css/style.less';
import { config, language } from '../../../controller/config';

class ActionPluginMobile {
	elem: HTMLElement;

	controller: Controller;

	joyStick: JoyStick;

	jumpButton: HTMLElement;

	removeBlockButton: HTMLElement;

	createBlockButton: HTMLElement;

	openMenuButton: HTMLButtonElement;

	jumpDownButton: HTMLElement;

	actionWallpaper: HTMLElement;

	touchMoveListener: (Event) => boolean;

	touchMoveInitListener: (Event) => boolean;

	stopInterferenceJoystick: (Event) => boolean;

	lastTouchMovePosition: unknown;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
		this.touchMoveListener = ActionPluginMobile.getTouchMoveListener(this);
		this.touchMoveInitListener = ActionPluginMobile.getTouchInitListener(this);
		this.stopInterferenceJoystick = ActionPluginMobile.getStopInterferenceJoystick();
	}

	load() {
		this.joyStick = new JoyStick(this.elem, { width: 200, height: 200 }, ActionPluginMobile.getJoyStickChange(this));

		this.actionWallpaper = document.createElement('div');
		this.actionWallpaper.setAttribute('id', 'mobile-button-wallpaper');
		this.elem.appendChild(this.actionWallpaper);

		this.jumpButton = document.createElement('div');
		this.jumpButton.setAttribute('id', 'mobile-jump-button');
		this.actionWallpaper.appendChild(this.jumpButton);
		this.jumpButton.addEventListener('touchstart', ActionPluginMobile.getButtonMoveListener({ up: 1 }, this));
		this.jumpButton.addEventListener('touchmove', ActionPluginMobile.getButtonMoveListener({ up: 1 }, this));
		this.jumpButton.addEventListener('touchend', ActionPluginMobile.getButtonMoveListener({ up: 0 }, this));
		this.jumpButton.addEventListener('touchcancel', ActionPluginMobile.getButtonMoveListener({ up: 0 }, this));

		this.removeBlockButton = document.createElement('div');
		this.removeBlockButton.setAttribute('id', 'remove-block-button');
		this.actionWallpaper.appendChild(this.removeBlockButton);
		this.removeBlockButton.addEventListener('touchstart', ActionPluginMobile.getButtonActionListener(actionBlockEvent.REMOVE, this));
		this.removeBlockButton.addEventListener('touchmove', ActionPluginMobile.getButtonActionListener(actionBlockEvent.REMOVE, this));

		this.createBlockButton = document.createElement('div');
		this.createBlockButton.setAttribute('id', 'create-block-button');
		this.actionWallpaper.appendChild(this.createBlockButton);
		this.createBlockButton.addEventListener('touchstart', ActionPluginMobile.getButtonActionListener(actionBlockEvent.ADD, this));
		this.createBlockButton.addEventListener('touchmove', ActionPluginMobile.getButtonActionListener(actionBlockEvent.ADD, this));

		this.jumpDownButton = document.createElement('div');
		this.jumpDownButton.setAttribute('id', 'jump-down-button');
		this.actionWallpaper.appendChild(this.jumpDownButton);
		this.jumpDownButton.addEventListener('touchstart', ActionPluginMobile.getButtonMoveListener({ up: -1 }, this));
		this.jumpDownButton.addEventListener('touchmove', ActionPluginMobile.getButtonMoveListener({ up: -1 }, this));
		this.jumpDownButton.addEventListener('touchend', ActionPluginMobile.getButtonMoveListener({ up: 0 }, this));
		this.jumpDownButton.addEventListener('touchcancel', ActionPluginMobile.getButtonMoveListener({ up: 0 }, this));

		this.openMenuButton = document.createElement('button');
		this.openMenuButton.setAttribute('id', 'open-menu-button');
		this.elem.appendChild(this.openMenuButton);
		this.openMenuButton.addEventListener('touchstart', () => {
			this.controller.pauseGame();
			this.controller.uiController.ui.menu.toInnerGameMenu();
		});

		[this.jumpButton, this.removeBlockButton, this.createBlockButton, this.jumpDownButton, this.openMenuButton].forEach(d => {
			d.addEventListener('touchstart', e => {
				e.preventDefault();
				e.stopPropagation();
				d.classList.add('active');
			});
			d.addEventListener('touchend', e => {
				e.preventDefault();
				e.stopPropagation();
				d.classList.remove('active');
			});
		});

		this.updateLang();
	}

	listen() {
		this.joyStick.enable = true;
		this.actionWallpaper.addEventListener('touchmove', this.stopInterferenceJoystick);
		this.actionWallpaper.addEventListener('touchstart', this.stopInterferenceJoystick);
		this.actionWallpaper.addEventListener('touchend', this.stopInterferenceJoystick);
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
		this.actionWallpaper.removeEventListener('touchmove', this.stopInterferenceJoystick);
		this.actionWallpaper.removeEventListener('touchstart', this.stopInterferenceJoystick);
		this.actionWallpaper.removeEventListener('touchend', this.stopInterferenceJoystick);
		this.elem.removeEventListener('touchmove', this.touchMoveListener);
		this.elem.removeEventListener('touchstart', this.touchMoveInitListener);
		this.elem.removeEventListener('touchend', this.touchMoveInitListener);
		this.elem.removeEventListener('touchcancel', this.touchMoveInitListener);
		if (config.controller.dev) {
			this.elem.removeEventListener('mousemove', this.touchMoveListener);
		}
	}

	destroy() {
		this.pause;
		[...this.elem.children].forEach(d => d.remove());
	}

	updateLang() {
		this.jumpButton.innerText = language.up;
		this.removeBlockButton.innerText = language.remove;
		this.createBlockButton.innerText = language.build;
		this.jumpDownButton.innerText = language.down;
		this.openMenuButton.innerText = language.menu;
	}

	static getJoyStickChange(self) {
		return args => {
			self.controller.gameController.handleMoveAction(args);
		};
	}

	static getTouchMoveListener(self) {
		return e => {
			const targetTouches = (e as TouchEvent)?.targetTouches ? (e as TouchEvent).targetTouches[0] : e;
			if (targetTouches?.target !== self.joyStick.canvas) {
				e?.preventDefault && e.preventDefault();
				e?.stopPropagation && e.stopPropagation();
			}
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
			if (targetTouches?.target === self.joyStick.canvas) {
				e?.preventDefault && e.preventDefault();
				e?.stopPropagation && e.stopPropagation();
			}
			if (targetTouches && targetTouches.target !== self.elem) return false;
			self.lastTouchMovePosition = null;
			return false;
		};
	}

	static getStopInterferenceJoystick() {
		return e => {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
	}

	static getButtonMoveListener(dir, self) {
		return e => {
			e.preventDefault();
			e.stopPropagation();
			self.controller.gameController.handleMoveAction(dir);
		};
	}

	static getButtonActionListener(act, self) {
		return e => {
			e.preventDefault();
			e.stopPropagation();
			self.controller.gameController.handleBlockAction(act);
		};
	}
}

export default ActionPluginMobile;

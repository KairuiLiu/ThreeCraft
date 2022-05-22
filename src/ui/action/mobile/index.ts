import { Controller, actionBlockEvent } from '../../../controller';
import JoyStick from './joy-stick';
import './css/style.less';

class ActionPluginMobile {
	elem: HTMLElement;

	controller: Controller;

	joyStick: JoyStick;

	jumpButton: HTMLButtonElement;

	removeBlockButton: HTMLButtonElement;

	createBlockButton: HTMLButtonElement;

	openBagButton: HTMLButtonElement;

	jumpDownButton: HTMLButtonElement;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = el;
		this.controller = controller;
	}

	load() {
		this.joyStick = new JoyStick(this.elem, { width: 200, height: 200 });

		this.jumpButton = document.createElement('button');
		this.jumpButton.setAttribute('id', 'mobile-jump-button');
		this.jumpButton.innerText = '跳';
		this.elem.appendChild(this.jumpButton);
		this.jumpButton.addEventListener('touchstart', () => {
			this.controller.handleMoveAction({ font: 0, left: 0, up: 1 });
		});

		this.removeBlockButton = document.createElement('button');
		this.removeBlockButton.setAttribute('id', 'remove-block-button');
		this.removeBlockButton.innerText = '拆';
		this.elem.appendChild(this.removeBlockButton);
		this.removeBlockButton.addEventListener('touchstart', () => {
			this.controller.handleBlockAction(actionBlockEvent.REMOVE);
		});

		this.createBlockButton = document.createElement('button');
		this.createBlockButton.setAttribute('id', 'create-block-button');
		this.createBlockButton.innerText = '建';
		this.elem.appendChild(this.createBlockButton);
		this.createBlockButton.addEventListener('touchstart', () => {
			this.controller.handleBlockAction(actionBlockEvent.ADD);
		});

		this.jumpDownButton = document.createElement('button');
		this.jumpDownButton.setAttribute('id', 'jump-down-button');
		this.jumpDownButton.innerText = '落';
		this.elem.appendChild(this.jumpDownButton);
		this.jumpDownButton.addEventListener('touchstart', () => {
			this.controller.handleMoveAction({ font: 0, left: 0, up: -1 });
		});

		this.openBagButton = document.createElement('button');
		this.openBagButton.setAttribute('id', 'open-bag-button');
		this.openBagButton.innerText = '菜单';
		this.elem.appendChild(this.openBagButton);
		this.openBagButton.addEventListener('touchstart', () => {
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
		this.handleJoystickDirection();
	}

	pause() {
		this.joyStick.enable = false;
	}

	handleJoystickDirection() {
		if (!this.joyStick.enable) return;
		if (this.joyStick.pressed) {
			const { dirX, dirY } = this.joyStick.getDirection();
			this.controller.handleMoveAction({ font: dirY / 100, left: -dirX / 100, up: 0 });
		}
		requestAnimationFrame(this.handleJoystickDirection.bind(this));
	}
}

export default ActionPluginMobile;

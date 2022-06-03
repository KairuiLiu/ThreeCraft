import { config } from '../../controller/config';
import { Controller } from '../../controller';
import ActionPluginPc from './pc';
import ActionPluginMobile from './mobile';
import ActionPluginXbox from './xbox';
import ActionPluginPs from './ps';

class ActonControl {
	elem: HTMLElement;

	plugin: null | ActionPluginPc | ActionPluginMobile | ActionPluginXbox | ActionPluginPs;

	controller: Controller;

	gamepad: boolean;

	working: boolean;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = document.createElement('div');
		this.elem.setAttribute('id', 'controller');
		this.elem.classList.add('cover');
		el.appendChild(this.elem);
		this.controller = controller;
		this.plugin = null;
		this.working = false;
		this.load();
	}

	// 载入动作捕获插件
	load() {
		if (this.plugin) this.plugin.destroy();
		if (config.controller.operation === 'pc') {
			this.plugin = new ActionPluginPc(this.elem, this.controller);
			this.gamepad = false;
		} else if (config.controller.operation === 'mobile') {
			this.plugin = new ActionPluginMobile(this.elem, this.controller);
			this.gamepad = false;
		} else if (config.controller.operation === 'xbox') {
			this.plugin = new ActionPluginXbox(this.elem, this.controller);
			this.gamepad = true;
		} else if (config.controller.operation === 'ps') {
			this.plugin = new ActionPluginPs(this.elem, this.controller);
			this.gamepad = true;
		} else {
			// code for vr
		}
		this.plugin.load();
	}

	// 监听动作
	listen() {
		this.plugin.listen();
		this.working = true;
	}

	// 停止监听动作
	pause() {
		this.plugin.pause();
		this.working = false;
	}

	sendGamepadAction(e) {
		if (!this.working) return;
		(this.plugin as ActionPluginXbox | ActionPluginPs).checkAction(e);
	}

	tryVibration(timeout) {
		if (!this.gamepad || !this.working) return;
		(this.plugin as ActionPluginXbox | ActionPluginPs).tryVibration(timeout);
	}
}

export default ActonControl;

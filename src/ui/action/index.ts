import { config } from '../../controller/config';
import { Controller } from '../../controller';
import ActionPluginPc from './pc';
import ActionPluginMobile from './mobile';

class ActonControl {
	elem: HTMLElement;

	plugin: null | ActionPluginPc | ActionPluginMobile;

	controller: Controller;

	constructor(el: HTMLElement, controller: Controller) {
		this.elem = document.createElement('div');
		this.elem.setAttribute('id', 'controller');
		this.elem.classList.add('cover');
		el.appendChild(this.elem);
		this.controller = controller;
		this.plugin = null;
		this.load();
	}

	// 载入动作捕获插件
	load() {
		if (this.plugin) this.plugin.destroy();
		if (config.controller.operation === 'pc') {
			this.plugin = new ActionPluginPc(this.elem, this.controller);
		} else if (config.controller.operation === 'mobile') {
			this.plugin = new ActionPluginMobile(this.elem, this.controller);
		} else {
			// code for vr
		}
		this.plugin.load();
	}

	// 监听动作
	listen() {
		this.plugin.listen();
	}

	// 停止监听动作
	pause() {
		this.plugin.pause();
	}
}

export default ActonControl;

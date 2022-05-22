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

	load() {
		if (config.controller.operation === 'pc') {
			this.plugin = new ActionPluginPc(this.elem, this.controller);
		} else if (config.controller.operation === 'mobile') {
			this.plugin = new ActionPluginMobile(this.elem, this.controller);
		} else {
			// code for vr
		}
		this.plugin.load();
		this.plugin.listen();
	}
}

export default ActonControl;

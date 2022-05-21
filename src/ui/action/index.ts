import { config } from '../../core/config';
import { Controller } from '../../controller';
import ActionPluginPc from './pc';

class ActonControl {
	elem: HTMLElement;

	plugin: null | ActionPluginPc;

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
			// code for mobile
		} else {
			// code for vr
		}
		this.plugin.load();
		this.plugin.listen();
	}
}

export default ActonControl;

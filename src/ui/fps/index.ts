import { config } from '../../controller/config';
import './css/style.less';

class Fps {
	fpsElem: HTMLElement;

	available: boolean;

	lastTime: number;

	cnt: number;

	constructor(el: HTMLElement) {
		this.lastTime = performance.now();
		this.cnt = 0;
		[...el.children].forEach(d => d.getAttribute('id') === 'fps' && d.remove());
		this.fpsElem = document.createElement('div');
		this.fpsElem.setAttribute('id', 'fps');
		this.fpsElem.innerText = ' FPS: ---';
		el.appendChild(this.fpsElem);
		if (config.controller.fps) this.begin();
		else this.stop();
	}

	begin() {
		this.fpsElem.classList.remove('hidden');
		this.available = true;
	}

	stop() {
		this.fpsElem.classList.add('hidden');
	}

	listen() {
		this.available = true;
	}

	pause() {
		this.available = false;
		this.fpsElem.innerHTML = ' FPS: ---';
	}

	work() {
		if (!this.available) return;
		const cur = performance.now();
		if (cur - this.lastTime >= 1000) {
			// eslint-disable-next-line
			this.fpsElem.innerHTML = ` FPS: ${this.cnt}${this.cnt < 10 ? '&nbsp;&nbsp;' : this.cnt < 100 ? '&nbsp;' : ''}`;
			this.cnt = 0;
			this.lastTime = cur;
		}
		this.cnt += 1;
	}
}

export default Fps;

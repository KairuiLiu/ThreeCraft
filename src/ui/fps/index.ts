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
	}

	begin() {
		this.fpsElem.classList.remove('hidden');
		this.available = true;
		this.work();
	}

	stop() {
		this.fpsElem.classList.add('hidden');
		this.available = false;
	}

	work() {
		const cur = performance.now();
		if (cur - this.lastTime >= 1000) {
			// eslint-disable-next-line
			this.fpsElem.innerHTML = ` FPS: ${this.cnt}${this.cnt < 10 ? '&nbsp;&nbsp;' : this.cnt < 100 ? '&nbsp;' : ''}`;
			this.cnt = 0;
			this.lastTime = cur;
		}
		this.cnt += 1;
		if (this.available) {
			requestAnimationFrame(() => {
				this.work();
			});
		}
	}
}

export default Fps;

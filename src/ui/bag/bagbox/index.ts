import './css/style.less';
import { config, language, symConfig } from '../../../controller/config';

class BagBoxPlugin {
	host: { onToggleBag: () => void };

	elem: HTMLElement;

	allBlockElem: HTMLElement;

	activeBlockElem: HTMLElement;

	working: boolean;

	// eslint-disable-next-line
	allItemClickListener: (e: MouseEvent) => void;

	// eslint-disable-next-line
	activeItemClickListener: (e: MouseEvent) => void;

	// eslint-disable-next-line
	bagCloseClickListener: (e: MouseEvent) => void;

	constructor(el: HTMLElement, host) {
		this.host = host;
		this.working = false;
		[...el.children].forEach(d => d.className.includes('bag-box') && d.remove());
		el.innerHTML += BagBoxPlugin.getBoxElementHTML();
		this.elem = document.getElementById('bag-box');
		this.allBlockElem = el.querySelector('.bag-item-all');
		this.activeBlockElem = el.querySelector('.bag-item-active');
		config.bag.bagBox.activeIdx = config.bag.activeIndex;
		this.allItemClickListener = BagBoxPlugin.getAllItemClickListener(this);
		this.activeItemClickListener = BagBoxPlugin.getActiveItemClickListener(this);
		this.bagCloseClickListener = BagBoxPlugin.getBagCloseClickListener(this);
		this.update();
		this.listen();
	}

	update() {
		symConfig.bag.bagBox.allItems.push(...Array(50).fill(null));
		symConfig.bag.bagBox.allItems.length = 50;
		[...this.allBlockElem.children].forEach((d, i) => {
			d.setAttribute('idx', `${i}`);
			d.children[0].setAttribute('idx', `${i}`);
			if (symConfig.bag.bagBox.allItems[i] !== null) d.children[0].setAttribute('src', `/src/assets/pictures/blocks-3d/${symConfig.bag.bagBox.allItems[i]}.png`);
		});
		[...this.activeBlockElem.children].forEach((d, i) => {
			d.setAttribute('idx', `${i}`);
			d.children[0].setAttribute('idx', `${i}`);
			if (config.bag.bagItem[i] === null) d.children[0].removeAttribute('src');
			else d.children[0].setAttribute('src', `/src/assets/pictures/blocks-3d/${config.bag.bagItem[i]}.png`);
		});
		this.highlight();
	}

	highlight() {
		[...this.activeBlockElem.children].forEach(d => d.classList.remove('active'));
		this.activeBlockElem.children[config.bag.bagBox.activeIdx].classList.add('active');
	}

	listen() {
		this.allBlockElem.addEventListener('click', this.allItemClickListener);
		this.activeBlockElem.addEventListener('click', this.activeItemClickListener);
		document.getElementById('closeBag').addEventListener('click', this.bagCloseClickListener);
	}

	toggleUseable() {
		this.working = !this.working;
		this.elem.classList.toggle('hidden');
		this.host.onToggleBag();
	}

	static getBoxElementHTML() {
		return `<div class="bag-box hidden" id="bag-box">
			<div class="bag-box-content">
				<div class="title mc-menu">
					<div>${language.allBlock}</div>
					<button id="closeBag" class="button close">×</button>
				</div>
				<div class="select">
					<div class="bag-item-all">
					${'<div class="bag-item"><img class="bag-item-image" /></div>'.repeat(50)}
					</div>
					<br>
					<div class="bag-item-active">
					${'<div class="bag-item"><img class="bag-item-image" /></div>'.repeat(10)}
					</div>
				</div>
			</div>
		</div>`;
	}

	static getAllItemClickListener(host) {
		return e => {
			e.stopPropagation();
			const idx = Number.parseInt((e.target as HTMLElement)?.getAttribute('idx'), 10);
			if (idx >= 0 && idx < 50) {
				config.bag.bagItem[config.bag.bagBox.activeIdx] = symConfig.bag.bagBox.allItems[idx];
				const nullIdx = config.bag.bagItem.findIndex(d => d === null);
				if (nullIdx === -1) config.bag.bagBox.activeIdx = (config.bag.bagBox.activeIdx + 1) % 10;
				else config.bag.bagBox.activeIdx = nullIdx;
				host.update();
			}
		};
	}

	static getActiveItemClickListener(host) {
		return e => {
			e.stopPropagation();
			const idx = Number.parseInt((e.target as HTMLElement)?.getAttribute('idx'), 10);
			if (idx >= 0 && idx < 10) {
				config.bag.bagBox.activeIdx = idx;
				host.update();
			}
		};
	}

	static getBagCloseClickListener(host) {
		return e => {
			e.stopPropagation();
			host.toggleUseable();
		};
	}
}

export default BagBoxPlugin;

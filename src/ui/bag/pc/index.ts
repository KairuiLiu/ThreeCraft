import config from '../../../core/config';
import './css/style.less';

class BagPcPlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	host: { highlight: () => void; openBag: () => void };

	// eslint-disable-next-line
	clickItemEventListener: (e: MouseEvent) => void;

	// eslint-disable-next-line
	keyupItemEventListener: (e: KeyboardEvent) => void;

	// eslint-disable-next-line
	keyupBagOpenEventListener: (e: KeyboardEvent) => void;

	constructor(bagOuterElem: HTMLElement, host) {
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('pc');
		this.bagOuterElem = bagOuterElem;
		[...this.bagOuterElem.children].forEach(d => d.className !== 'bag-box' && d.remove());
		this.bagOuterElem.appendChild(this.bagInnerElem);
		this.host = host;
		this.clickItemEventListener = BagPcPlugin.getClickItemEventListener(this.host);
		this.keyupItemEventListener = BagPcPlugin.getKeyupItemEventListener(this.host);
		this.keyupBagOpenEventListener = BagPcPlugin.getKeyupBagOpenEventListener(this.host);
	}

	place() {
		this;
	}

	listen() {
		this.bagInnerElem.addEventListener('click', this.clickItemEventListener);
		document.addEventListener('keyup', this.keyupItemEventListener);
		document.addEventListener('keyup', this.keyupBagOpenEventListener);
	}

	pause() {
		this.bagInnerElem.removeEventListener('click', this.clickItemEventListener);
		document.removeEventListener('keyup', this.keyupItemEventListener);
		document.removeEventListener('keyup', this.keyupBagOpenEventListener);
	}

	static getClickItemEventListener(host) {
		return e => {
			const idx = Number.parseInt((e.target as HTMLElement)?.getAttribute('idx'), 10);
			if (idx >= 0 && idx <= 9) {
				config.bag.activeIndex = idx;
				host.highlight();
			}
		};
	}

	static getKeyupItemEventListener(host) {
		return e => {
			const idx = Number.parseInt(e.key, 10);
			if (idx >= 0 && idx <= 9) {
				config.bag.activeIndex = (idx + 9) % 10;
				host.highlight();
			}
		};
	}

	static getKeyupBagOpenEventListener(host) {
		return e => {
			if (e.key === 'e' || e.key === 'E') {
				host.openBag();
			}
		};
	}
}

export default BagPcPlugin;

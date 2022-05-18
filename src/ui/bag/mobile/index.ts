import { config } from '../../../core/config';
import './css/style.less';

class BagMobilePlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	host: { highlight: () => void; toggleBag: () => void };

	// eslint-disable-next-line
	clickItemEventListener: (e: MouseEvent) => void;

	constructor(bagOuterElem: HTMLElement, host) {
		this.host = host;
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('mobile');
		this.bagOuterElem = bagOuterElem;
		[...this.bagOuterElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		this.bagOuterElem.appendChild(this.bagInnerElem);
		this.clickItemEventListener = BagMobilePlugin.getClickItemEventListener(this.host);
	}

	place() {
		this.bagItemsElem = [...this.bagInnerElem.children] as HTMLElement[];
		this.bagItemsElem.forEach((d, i) => {
			d.style.transform = `rotateZ(${i * config.bag.mobile.rotateDegree}deg) translateX(-${config.bag.mobile.radius}px)`;
		});
	}

	listen() {
		this.bagInnerElem.addEventListener('click', this.clickItemEventListener);
	}

	pause() {
		this.bagInnerElem.removeEventListener('click', this.clickItemEventListener);
	}

	static getClickItemEventListener(host) {
		return e => {
			const idx = Number.parseInt((e.target as HTMLElement)?.getAttribute('idx'), 10);
			if (idx >= 0 && idx <= 9) {
				if (idx === config.bag.activeIndex) host.toggleBag();
				else {
					config.bag.activeIndex = idx;
					host.highlight();
				}
			}
		};
	}
}

export default BagMobilePlugin;

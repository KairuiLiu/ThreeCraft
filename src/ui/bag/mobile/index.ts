import { config } from '../../../core/config';
import './css/style.less';

class BagMobilePlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	host: { highlight: () => void; toggleBag: () => void };

	// eslint-disable-next-line
	clickItemEventListener: (e: TouchEvent | MouseEvent) => void;

	constructor(bagOuterElem: HTMLElement, host) {
		// 清除其他插件
		this.host = host;
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('mobile');
		this.bagOuterElem = bagOuterElem;
		[...this.bagOuterElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		// 载入插件
		this.bagOuterElem.appendChild(this.bagInnerElem);
		// 点击框事件
		this.clickItemEventListener = BagMobilePlugin.getClickItemEventListener(this.host);
	}

	// 调整位置
	place() {
		this.bagItemsElem = [...this.bagInnerElem.children] as HTMLElement[];
		this.bagItemsElem.forEach((d, i) => {
			d.style.transform = `rotateZ(${i * config.bag.mobile.rotateDegree}deg) translateX(-${config.bag.mobile.radius}px)`;
		});
	}

	// 监听事件
	listen() {
		if (config.controller.dev) this.bagInnerElem.addEventListener('click', this.clickItemEventListener);
		this.bagInnerElem.addEventListener('touchstart', this.clickItemEventListener);
	}

	// 取消监听
	pause() {
		this.bagInnerElem.removeEventListener('touchstart', this.clickItemEventListener);
	}

	// 单击选中框， 单击已选框打开背包
	static getClickItemEventListener(host) {
		return e => {
			e.stopPropagation();
			e.preventDefault();
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

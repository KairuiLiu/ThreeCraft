import { config } from '../../../controller/config';
import './css/style.less';

class BagPcPlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	host: { highlight: () => void; toggleBag: () => void };

	// eslint-disable-next-line
	clickItemEventListener: (e: MouseEvent) => void;

	// eslint-disable-next-line
	keyupItemEventListener: (e: KeyboardEvent) => void;

	// eslint-disable-next-line
	keyupBagOpenEventListener: (e: KeyboardEvent) => void;

	// eslint-disable-next-line
	wheelItemEventListener: (e: WheelEvent) => void;

	constructor(bagOuterElem: HTMLElement, host) {
		// 清除其他插件
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('pc');
		this.bagOuterElem = bagOuterElem;
		[...this.bagOuterElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		this.bagOuterElem.appendChild(this.bagInnerElem);
		this.host = host;
		// 添加事件监听
		this.clickItemEventListener = BagPcPlugin.getClickItemEventListener(this.host);
		this.keyupItemEventListener = BagPcPlugin.getKeyupItemEventListener(this.host);
		this.keyupBagOpenEventListener = BagPcPlugin.getKeyupBagOpenEventListener(this.host);
		this.wheelItemEventListener = BagPcPlugin.getWheelItemEventListener(this.host);
	}

	// 调整位置
	place() {
		this;
	}

	// 开启监听
	listen() {
		this.bagInnerElem.addEventListener('click', this.clickItemEventListener);
		document.addEventListener('keyup', this.keyupItemEventListener);
		document.addEventListener('keyup', this.keyupBagOpenEventListener);
		document.addEventListener('wheel', this.wheelItemEventListener);
	}

	// 关闭监听
	pause() {
		this.bagInnerElem.removeEventListener('click', this.clickItemEventListener);
		document.removeEventListener('keyup', this.keyupItemEventListener);
		document.removeEventListener('keyup', this.keyupBagOpenEventListener);
		document.removeEventListener('wheel', this.wheelItemEventListener);
	}

	destroy() {
		this.pause();
		this.bagInnerElem.remove();
	}

	// 点击背包框激活对应元素??
	static getClickItemEventListener(host) {
		return e => {
			e.stopPropagation();
			const idx = Number.parseInt((e.target as HTMLElement)?.getAttribute('idx'), 10);
			if (idx >= 0 && idx <= 9) {
				config.bag.activeIndex = idx;
				host.highlight();
			}
			return false;
		};
	}

	// 按0-9激活不同背包框
	static getKeyupItemEventListener(host) {
		return e => {
			if (host.bagBox.working) return;
			const idx = Number.parseInt(e.key, 10);
			if (idx >= 0 && idx <= 9) {
				config.bag.activeIndex = (idx + 9) % 10;
				host.highlight();
			}
		};
	}

	// 滚轮激活不同背包框
	static getWheelItemEventListener(host) {
		let lenCnt = 0;
		return e => {
			if (host.bagBox.working) return;
			if (lenCnt * e.deltaY < 0) {
				lenCnt = e.deltaY;
			} else {
				lenCnt += e.deltaY;
			}
			if (lenCnt >= 30 || lenCnt <= -30) {
				config.bag.activeIndex = (config.bag.activeIndex + (e.wheelDeltaY > 0 ? -1 : 1) + 10) % 10;
				lenCnt = 0;
			}
			host.highlight();
		};
	}

	// 按e开关背包
	static getKeyupBagOpenEventListener(host) {
		return e => {
			if (e.key === 'e' || e.key === 'E') {
				host.toggleBag();
			}
		};
	}
}

export default BagPcPlugin;

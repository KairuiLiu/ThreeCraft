import { blockLoader, blockTypes } from '../../core/loader';
import BagPcPlugin from './pc';
import BagMobilePlugin from './mobile/index';
import BagBoxPlugin from './bagbox';
import './css/style.less';
import { config } from '../../controller/config';
import BagXboxPlugin from './xbox';
import BagPsPlugin from './ps';

class Bag {
	type: 'pc' | 'mobile' | 'vr' | 'xbox' | 'ps';

	items: (number | null)[];

	plugin: BagMobilePlugin | BagPcPlugin | BagXboxPlugin | BagPsPlugin;

	bagElem: HTMLElement;

	bagBox: BagBoxPlugin;

	itemsElem: HTMLElement[];

	available: boolean;

	gamepad: boolean;

	constructor(el: HTMLElement) {
		// 将背包挂载到el上, 清除el上其他背包
		[...el.children].forEach((d: HTMLElement) => d.getAttribute('id') === 'bag' && d.remove());
		this.bagElem = document.createElement('div');
		this.bagElem.setAttribute('id', 'bag');
		el.appendChild(this.bagElem);
		this.type = config.bag.type as 'pc' | 'mobile' | 'vr' | 'xbox' | 'ps'; // 背包样式
		this.items = config.bag.bagItem; // 背包中元素String[]
		this.items.push(...Array(10).fill(null));
		this.available = false;
		this.items.length = 10;
		this.plugin = null; // 背包框插件, 管理元素位置与背包框事件
		this.bagBox = new BagBoxPlugin(this.bagElem, this); // 背包选项插件
		this.gamepad = false;
		this.place(); // 加载
	}

	place() {
		if (this.plugin) this.plugin.destroy();
		if (this.type === 'pc') {
			this.plugin = new BagPcPlugin(this.bagElem, this);
			this.gamepad = false;
		} else if (this.type === 'mobile') {
			this.plugin = new BagMobilePlugin(this.bagElem, this);
			this.gamepad = false;
		} else if (this.type === 'xbox') {
			this.plugin = new BagXboxPlugin(this.bagElem, this);
			this.gamepad = true;
		} else if (this.type === 'ps') {
			this.plugin = new BagPsPlugin(this.bagElem, this);
			this.gamepad = true;
		} else {
			// VR
		}

		// 将框加入Block框
		const itemElem = document.createElement('div');
		itemElem.classList.add('bag-item');
		const itemImage = document.createElement('img');
		itemImage.classList.add('bag-item-image');
		itemElem.appendChild(itemImage);
		this.items.forEach((_, i) => {
			const elem = itemElem.cloneNode(true);
			(elem as HTMLElement).setAttribute('idx', `${i}`);
			(elem.childNodes[0] as HTMLElement).setAttribute('idx', `${i}`);
			this.plugin.bagInnerElem.appendChild(elem);
		});
		this.itemsElem = [...this.plugin.bagInnerElem.children] as HTMLElement[]; // 每个框
		this.plugin.place(); // 调整背包框位置
		this.update(); // 载入图片
		this.highlight(); // 刷新高亮
	}

	// 刷新背包框图片
	update() {
		this.items.forEach((d, i) => {
			if (d === null) (this.itemsElem[i].children[0] as HTMLElement).removeAttribute('src');
			else (this.itemsElem[i].children[0] as HTMLElement).setAttribute('src', blockLoader[blockTypes[this.items[i]]].block3d);
		});
	}

	// 销毁背包框
	remove() {
		[...this.bagElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		this.pause();
	}

	// 开关背包
	toggleBag() {
		this.bagBox.toggleUseable();
		document.exitPointerLock && document.exitPointerLock();
	}

	// 开关背包后刷新背包框
	onToggleBag() {
		this.update();
	}

	// 开启监听
	listen() {
		this.available = true;
		this.plugin.listen();
	}

	// 停止监听
	pause() {
		this.available = false;
		this.plugin.pause();
	}

	// 刷新背包框高亮
	highlight() {
		this.itemsElem.forEach(d => d.classList.remove('active'));
		this.itemsElem[config.bag.activeIndex].classList.add('active');
	}

	sendGamepadAction(e) {
		(this.plugin as BagXboxPlugin | BagPsPlugin).checkAction(e);
	}
}

export default Bag;

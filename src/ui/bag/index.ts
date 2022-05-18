import BagPcPlugin from './pc';
import BagMobilePlugin from './mobile/index';
import BagBoxPlugin from './bagbox';
import './css/style.less';
import { config } from '../../core/config';

class Bag {
	type: 'pc' | 'mobile' | 'vr';

	items: (string | null)[];

	plugin: BagMobilePlugin | BagPcPlugin;

	bagElem: HTMLElement;

	bagBox: BagBoxPlugin;

	itemsElem: HTMLElement[];

	available: boolean;

	constructor(el) {
		[...el.children].forEach((d: HTMLElement) => d.getAttribute('id') === 'bag' && d.remove());
		this.bagElem = document.createElement('div');
		this.bagElem.setAttribute('id', 'bag');
		this.bagElem.classList.add('covered');
		el.appendChild(this.bagElem);
		this.type = config.bag.type;
		this.items = config.bag.bagItem;
		this.items.push(...Array(10).fill(null));
		this.available = false;
		this.items.length = 10;
		this.plugin = null;
		this.bagBox = new BagBoxPlugin(this.bagElem, this);
		this.place();
	}

	place() {
		if (this.type === 'pc') {
			this.plugin = new BagPcPlugin(this.bagElem, this);
		} else if (this.type === 'mobile') {
			this.plugin = new BagMobilePlugin(this.bagElem, this);
		} else {
			// VR
		}

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
		this.itemsElem = [...this.plugin.bagInnerElem.children] as HTMLElement[];
		this.plugin.place();
		this.update();
		this.listen();
		this.highlight();
	}

	update() {
		this.items.forEach((d, i) => {
			if (d === null) (this.itemsElem[i].children[0] as HTMLElement).removeAttribute('src');
			else (this.itemsElem[i].children[0] as HTMLElement).setAttribute('src', `./src/assets/pictures/blocks-3d/${d}.png`);
		});
	}

	remove() {
		[...this.bagElem.children].forEach(d => !d.className.includes('bag-box') && d.remove());
		this.pause();
	}

	toggleBag() {
		this.bagBox.toggleUseable();
	}

	onToggleBag() {
		this.update();
	}

	toggleUseable() {
		this.bagElem.classList.toggle('hidden');
		if (this.available) this.pause();
		else this.listen();
	}

	listen() {
		this.available = true;
		this.plugin.listen();
	}

	pause() {
		this.available = false;
		this.plugin.pause();
	}

	highlight() {
		this.itemsElem.forEach(d => d.classList.remove('active'));
		this.itemsElem[config.bag.activeIndex].classList.add('active');
	}
}

export default Bag;

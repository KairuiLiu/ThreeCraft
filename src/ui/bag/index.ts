import BagPcPlugin from './pc';
import BagMobilePlugin from './mobile/index';
import BagBox from './bagbox';
import './css/style.less';
import config from '../../core/config';

class Bag {
	type: 'pc' | 'mobile' | 'vr';

	items: (string | null)[];

	plugin: BagMobilePlugin | BagPcPlugin;

	bagElem: HTMLElement;

	bagBox: BagBox;

	itemsElem: HTMLElement[];

	available: boolean;

	constructor() {
		this.type = config.bag.type;
		this.items = config.bag.bagItem;
		this.items.push(...Array(10).fill(null));
		this.available = false;
		this.items.length = 10;
		this.bagElem = document.getElementById('bag') as HTMLElement;
		this.plugin = null;
		this.bagBox = new BagBox();
	}

	place() {
		if (this.type === 'pc') {
			this.plugin = new BagPcPlugin(this.bagElem, this);
		} else if (this.type === 'mobile') {
			this.plugin = new BagMobilePlugin(this.bagElem);
		} else {
			// VR
		}

		const itemElem = document.createElement('div');
		itemElem.classList.add('bag-item');
		const itemImage = document.createElement('img');
		itemImage.classList.add('bag-item-image');
		itemElem.appendChild(itemImage);

		this.items.forEach((d, i) => {
			const elem = itemElem.cloneNode(true) as HTMLElement;
			if (d !== null) (elem.childNodes[0] as HTMLElement).setAttribute('src', `./src/assets/pictures/blocks-3d/${d}.png`);
			(elem as HTMLElement).setAttribute('idx', `${i}`);
			(elem.childNodes[0] as HTMLElement).setAttribute('idx', `${i}`);
			this.plugin.bagInnerElem.appendChild(elem);
		});
		this.plugin.place();

		this.itemsElem = [...this.plugin.bagInnerElem.children] as HTMLElement[];
		this.listen();
		this.highlight();
	}

	remove() {
		[...this.bagElem.children].forEach(d => d.className !== 'bag-box' && d.remove());
		this.pause();
	}

	openBag() {
		console.log(this);
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

(() => {
	const bag = new Bag();
	bag.place();
})();

export default { Bag };

import BagPcPlugin from './pc';
import BagMobilePlugin from './mobile/index';
import './css/style.less';
import config from '../../core/config';

class Bag {
	type: 'pc' | 'mobile' | 'vr';

	items: (string | null)[];

	plugin: BagMobilePlugin;

	constructor() {
		this.type = config.bag.type;
		this.items = config.bag.bagItem;
		this.items.push(...Array(10).fill(null));
		this.items.length = 10;
		this.plugin = null;
		this.placeBag();
	}

	placeBag() {
		const contentElem = document.getElementById('bag') as HTMLElement;
		if (this.type === 'pc') {
			this.plugin = new BagPcPlugin(contentElem);
		} else if (this.type === 'mobile') {
			this.plugin = new BagMobilePlugin(contentElem);
		} else {
			// VR
		}

		const itemElem = document.createElement('div');
		itemElem.classList.add('bag-item');
		const itemImage = document.createElement('img');
		itemImage.classList.add('bag-item-image');
		itemElem.appendChild(itemImage);

		this.items.forEach(d => {
			const elem = itemElem.cloneNode(true) as HTMLElement;
			if (d !== null) (elem.childNodes[0] as HTMLElement).setAttribute('src', `./src/assets/pictures/blocks-3d/${d}.png`);
			this.plugin.bagInnerElem.appendChild(elem);
		});

		this.plugin.placeBag();
	}
}

export default { Bag };

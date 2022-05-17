import './css/style.less';

class BagMobilePlugin {
	bag: HTMLElement;

	bagItems: HTMLElement[];

	constructor(bag: HTMLElement) {
		this.bag = bag;
		this.bagItems = [...this.bag.children] as HTMLElement[];
	}

	setPosition() {
		this.bagItems.forEach((d, i) => {
			d.style.transform = `rotateZ(${i * 10}deg) translateX(-300px)`;
		});
	}
}

export default { BagMobilePlugin };

import './css/style.less';

class BagPcPlugin {
	bagOuterElem: HTMLElement;

	bagInnerElem: HTMLElement;

	bagItemsElem: HTMLElement[];

	constructor(bagOuterElem: HTMLElement) {
		this.bagInnerElem = document.createElement('div');
		this.bagInnerElem.classList.add('pc');
		this.bagOuterElem = bagOuterElem;
		this.bagOuterElem.innerHTML = '';
		this.bagOuterElem.appendChild(this.bagInnerElem);
	}

	placeBag() {
		return this;
	}
}

export default BagPcPlugin;

import './css/style.less';

class Crosshair {
	crosshairElem: HTMLElement;

	available: boolean;

	dark: boolean;

	constructor(el: HTMLElement, dark = true) {
		this.dark = dark;
		[...el.children].forEach(d => d.getAttribute('id') === 'crosshairs' && d.remove());
		this.crosshairElem = document.createElement('div');
		this.crosshairElem.setAttribute('id', 'crosshairs');
		el.appendChild(this.crosshairElem);
		this.updataColor();
	}

	updataColor() {
		if (this.dark) this.crosshairElem.classList.add('dark');
		else this.crosshairElem.classList.remove('dark');
	}
}

export default Crosshair;

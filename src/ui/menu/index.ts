class Menu {
	elem: HTMLElement;

	titleElem: HTMLElement;

	boxElem: HTMLElement;

	constructor(el: HTMLElement) {
		[...el.children].forEach(d => d.getAttribute('id') === 'menu' && d.remove());
		this.elem = document.createElement('div');
		this.elem.setAttribute('id', 'menu');
		this.elem.innerHTML = Menu.templateElement;
		this.elem.classList.add('background-image');
		this.titleElem = this.elem.querySelector('.title');
		this.boxElem = this.elem.querySelector('.box');
		el.appendChild(this.elem);
		this.toStartMenu();
	}

	clearMenuItem() {
		[...this.boxElem.children].forEach(d => d.remove());
	}

	setImgBkg() {
		this.elem.classList.remove('background-pain-color');
		this.elem.classList.add('background-image');
	}

	setGrayBkg() {
		this.elem.classList.add('background-pain-color');
		this.elem.classList.remove('background-image');
	}

	showTitle() {
		this.titleElem.classList.remove('hidden');
	}

	removeTitle() {
		this.titleElem.classList.add('hidden');
	}

	toStartMenu() {
		this.showTitle();
		this.setImgBkg();
		this.clearMenuItem();
		this.elem.innerHTML = `
			<div class="box ">
				<div class="box-line">
					<button id="single-player-game" class="button">单人游戏</button>
					<button id="single-player-game" class="button">多人游戏</button>
				</div>
				<div class="box-line">
					<button id="load-archive-file" class="button">上载存档</button>
					<button id="load-archive-storage" class="button">缓存读档</button>
				</div>
				<button id="load-archive-cancel" class="button hidden">已加载, 点击取消</button>
				<button id="game-setting" class="button">游戏设置</button>
				<div class="box-line">
					<button id="help" class="button">帮助</button>
					<button id="about" class="button">关于项目</button>
				</div>
			</div>`;
	}

	toSocketConfigMenu() {
		this;
	}

	toSettingMenu() {
		this;
	}

	toInnerGameConfigMenu() {
		this;
	}

	toHelpMenu() {
		this;
	}

	toAboutMenu() {
		this;
	}

	static templateElement = `
		<div class="title hidden"></div>
		<div class="box">`;
}

export default Menu;

import { Controller } from '../../controller';
import { deepCopy } from '../../utils/deep-copy';
import { config, defaultConfig, language, languages } from '../../controller/config';
import { downloadJson } from '../../utils/download';

class Menu {
	elem: HTMLElement;

	titleElem: HTMLElement;

	boxElem: HTMLElement;

	controller: Controller;

	constructor(el: HTMLElement, controller) {
		this.controller = controller;
		[...el.children].forEach(d => d.getAttribute('id') === 'menu' && d.remove());
		this.elem = document.createElement('div');
		this.elem.setAttribute('id', 'menu');
		this.elem.innerHTML = Menu.templateElement;
		this.elem.classList.add('background-image');
		this.titleElem = this.elem.querySelector('#title');
		this.boxElem = this.elem.querySelector('.box');
		el.appendChild(this.elem);
		// this.hideMenu();
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

	showBorder() {
		this.boxElem.classList.add('border-box');
	}

	removeBorder() {
		this.boxElem.classList.remove('border-box');
	}

	showMenu() {
		this.elem.classList.remove('hidden');
	}

	hideMenu() {
		this.elem.classList.add('hidden');
	}

	setNotify(info, timeout = 1000, el = this.elem) {
		const existNotifyElem = el.querySelectorAll('#notify');
		[...existNotifyElem].forEach(d => d.remove());
		const elem = document.createElement('div');
		elem.setAttribute('id', 'notify');
		elem.innerText = info;
		const timeOutId = setTimeout(() => {
			elem.remove();
		}, timeout);
		elem.setAttribute('timeOutId', `${timeOutId}`);
		el.appendChild(elem);
	}

	onLoadArchiveSuccess() {
		document.getElementById('load-archive').classList.add('hidden');
		document.getElementById('load-archive-cancel').classList.remove('hidden');
		this;
	}

	onLoadArchiveCancel() {
		document.getElementById('load-archive').classList.remove('hidden');
		document.getElementById('load-archive-cancel').classList.add('hidden');
		this;
	}

	toStartMenu() {
		this.showMenu();
		this.showTitle();
		this.setImgBkg();
		this.removeBorder();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line">
				<button id="single-player-game" class="button">${language.singlePlayerGame}</button>
				<button id="multi-player-game" class="button">${language.multiPlayerGame}</button>
			</div>
			<div class="box-line" id="load-archive">
				<input id="load-archive-file" type="file" id="load-archive-file" class="file-loader" />
				<button id="load-archive-file-button" class="button">${language.uploadArchive}</button>
				<button id="load-archive-storage" class="button">${language.browserArchive}</button>
			</div>
			<button id="load-archive-cancel" class="button hidden">${language.cancelArchive}</button>
			<button id="game-setting" class="button">${language.setting}</button>
			<div class="box-line">
				<button id="help" class="button">${language.help}</button>
				<button id="about" class="button">${language.about}</button>
			</div>`;
		const singlePlayerGame = this.boxElem.querySelector('#single-player-game');
		singlePlayerGame.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.startGame(true);
		});
		const multiPlayerGame = this.boxElem.querySelector('#multi-player-game');
		multiPlayerGame.addEventListener('click', e => {
			e.stopPropagation();
			this.toSocketConfigMenu({ back: 'toStartMenu' });
		});
		const loadArchiveFile = this.boxElem.querySelector('#load-archive-file') as HTMLInputElement;
		loadArchiveFile.addEventListener('change', e => {
			e.stopPropagation();
			const { files } = loadArchiveFile;
			if (files.length === 0) return false;
			const file = files[0];
			const reader = new FileReader();
			reader.onload = () => {
				deepCopy(JSON.parse(reader.result as string), config);
				this.setNotify(language.loadArchiveSuccess);
				this.onLoadArchiveSuccess();
			};
			reader.readAsText(file);
			return false;
		});
		const loadArchiveFileButton = this.boxElem.querySelector('#load-archive-file-button') as HTMLInputElement;
		loadArchiveFileButton.addEventListener('click', e => {
			e.stopPropagation();
			loadArchiveFile.click();
		});
		const loadArchiveStorage = this.boxElem.querySelector('#load-archive-storage');
		loadArchiveStorage.addEventListener('click', e => {
			e.stopPropagation();
			const configLocalStorage = localStorage.getItem('config');
			if (configLocalStorage) {
				deepCopy(JSON.parse(configLocalStorage), config);
				this.setNotify(language.loadArchiveSuccess);
				this.onLoadArchiveSuccess();
			} else {
				this.setNotify(language.browserNoArchive);
			}
		});
		const loadArchiveCancel = this.boxElem.querySelector('#load-archive-cancel');
		loadArchiveCancel.addEventListener('click', e => {
			e.stopPropagation();
			deepCopy(defaultConfig, config);
			this.onLoadArchiveCancel();
			this.setNotify(language.cancelSuccess);
		});
		const gameSetting = this.boxElem.querySelector('#game-setting');
		gameSetting.addEventListener('click', e => {
			e.stopPropagation();
			this.toSettingMenu({ back: 'toStartMenu' });
		});
		const help = this.boxElem.querySelector('#help');
		help.addEventListener('click', e => {
			e.stopPropagation();
			this.toHelpMenu({ back: 'toStartMenu' });
		});
		const about = this.boxElem.querySelector('#about');
		about.addEventListener('click', e => {
			e.stopPropagation();
			this.toAboutMenu({ back: 'toStartMenu' });
		});
	}

	// TODO 实现Socket
	toSocketConfigMenu({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line title color-white">${language.multiPlayerGame}</div>
			<div class="radio-item"><input type="radio" name="play-mod" id="as-server" checked/><label for="as-server">${language.creatRoom}</label></div>
			<div class="radio-item"><input type="radio" name="play-mod" id="as-client" /><label for="as-client">${language.joinRoom}</label></div>
			<br/>
			<div class="box-line">
				<label  for="ip" class="fix-width color-white">${language.roomName}: </label><input type="text" class="text-input" id="ip" />
			</div>
			<div class="box-line">
				<label  for="password" class="fix-width color-white">${language.token}: </label><input type="text" class="text-input" id="password" />
				</div>
			<div class="box-line">
				<label  for="payer-number" class="fix-width color-white">${language.gameNumber}: </label><input type="text" class="text-input" id="payer-number" disabled />
			</div>
			<br/>
			<button id="socket-start-game" class="button">${language.startGame}</button>
			<button id="socket-join-room" class="button hidden">${language.joinRoom}</button>
			<button id="socket-exit-room" class="button hidden">${language.exitRoom}</button>
			<button class="button" id="backMenu">${language.backMenu}</button>`;
		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this[back]();
		});
	}

	toSettingMenu({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `<div class="box-line title ">${language.setting}</div>
		<div class="box-line">
			<div class="range-item">
				<label for="fov-range" class="fix-width">${language.fov}</label>
				<input type="range" class="range" id="fov-range" name="fov-range" min="30" max="120" step="10" />
				<label for="fov-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="fog-range" class="fix-width">${language.fogFactor}</label>
				<input type="range" class="range" id="fog-range" name="fog-range" min="0" max="10" step="1" />
				<label for="fog-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="stage-range" class="fix-width">${language.stageSize}</label>
				<input type="range" class="range" id="stage-range" name="stage-range" min="2" max="20" step="2" />
				<label for="stage-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<!--<div class="box-line">
			<div class="range-item">
				<label for="rend-range" class="fix-width">${language.rendDistance}</label>
				<input type="range" class="range" id="rend-range" name="rend-range" min="0" max="999" step="1" />
				<label for="rend-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>-->
		<!--<div class="box-line">
			<div class="range-item">
				<label for="op-sens-range" class="fix-width">${language.opSens}</label>
				<input type="range" class="range" id="op-sens-range" name="op-sens-range" min="1" max="50" step="1" />
				<label for="op-sens-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>-->
		<div class="box-line">
			<div class="range-item">
				<label for="op-range" class="fix-width">${language.opRange}</label>
				<input type="range" class="range" id="op-range" name="op-range" min="1" max="20" step="1" />
				<label for="op-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="volume-range" class="fix-width">${language.volume}</label>
				<input type="range" class="range" id="volume-range" name="volume-range" min="0" max="100" step="5" />
				<label for="volume-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<label for="thread-select" class="fix-width">${language.threadNumber}</label>
			<select class="select" name="thread-select" id="thread-select">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="4">4</option>
				<option value="8">8</option>
				<option value="16">16</option>
			</select>
			<label for="op-sens-select" class="fix-width">${language.opSens}</label>
			<select class="select" name="op-sens-select" id="op-sens-select">
				<option value="4">${language.high}</option>
				<option value="2">${language.norm}</option>
				<option value="1">${language.low}</option>
			</select>
		</div>
		<div class="box-line">
			<label for="lang-select" class="fix-width">${language.language}</label>
			<select class="select" name="lang-select" id="lang-select">
				<option value="0">中文</option>
				<option value="1">En&nbsp;&nbsp;</option>
			</select>
			<label for="operate-select" class="fix-width">${language.operation}</label>
			<select class="select" name="operate-select" id="operate-select">
				<option value="pc">${language.pcMode}</option>
				<option value="mobile">${language.mobileMode}</option>
				<option value="vr">${language.vrMode}</option>
			</select>
		</div>
		<div class="box-line">
			<label for="crosshair-select" class="fix-width">${language.crossHair}</label>
			<select class="select" name="crosshair-select" id="crosshair-select">
			<option value="light">${language.light}</option>
			<option value="dark">${language.dark}</option>
			</select>
			<label for="bag-type-select" class="fix-width">${language.bagMode}</label>
			<select class="select" name="bag-type-select" id="bag-type-select">
				<option value="pc">${language.pcMode}</option>
				<option value="mobile">${language.mobileMode}</option>
				<option value="vr">${language.vrMode}</option>
			</select>
		</div>

		<br />
		<button class="button" id="backMenu">${language.backMenu}</button>`;
		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this[back]();
		});
		const fovRange = document.getElementById('fov-range') as HTMLInputElement;
		fovRange.value = `${config.camera.fov}`;
		fovRange.nextElementSibling.innerHTML = `${config.camera.fov}`;
		fovRange.addEventListener('input', () => {
			config.camera.fov = Number.parseInt(fovRange.value, 10);
			fovRange.nextElementSibling.innerHTML = `${config.camera.fov}`;
		});
		const fogRange = document.getElementById('fog-range') as HTMLInputElement;
		fogRange.value = `${config.renderer.fog * 100}`;
		fogRange.nextElementSibling.innerHTML = `${(config.renderer.fog * 10).toFixed(1)}`;
		fogRange.addEventListener('input', () => {
			config.renderer.fog = Number.parseInt(fogRange.value, 10) / 100;
			// ! 这不是一个bug, fog指数应该在0.0-0.1, 但是设计UI的时候没考虑三位小数放不下的问题..., 所以这里就*10了
			fogRange.nextElementSibling.innerHTML = `${(config.renderer.fog * 10).toFixed(1)}`;
		});
		const stageRange = document.getElementById('stage-range') as HTMLInputElement;
		stageRange.value = `${Math.sqrt(config.renderer.stageSize)}`;
		stageRange.nextElementSibling.innerHTML = `${config.renderer.stageSize}`;
		stageRange.addEventListener('input', () => {
			config.renderer.stageSize = Number.parseInt(stageRange.value, 10) ** 2;
			stageRange.nextElementSibling.innerHTML = `${config.renderer.stageSize}`;
			// TODO 注意, 这里要防止线程炸掉
		});
		// const renderRange = document.getElementById('rend-range') as HTMLInputElement;
		// renderRange.value = `${config.renderer.renderDistance}`;
		// renderRange.nextElementSibling.innerHTML = `${config.renderer.renderDistance}`;
		// renderRange.addEventListener('input', () => {
		// 	config.renderer.renderDistance = Number.parseInt(renderRange.value, 10);
		// 	renderRange.nextElementSibling.innerHTML = `${config.renderer.renderDistance}`;
		// });
		// const opSensRange = document.getElementById('op-sens-range') as HTMLInputElement;
		// opSensRange.value = `${config.controller.opSens * 10}`;
		// opSensRange.nextElementSibling.innerHTML = `${config.controller.opSens}`;
		// opSensRange.addEventListener('input', () => {
		// 	config.controller.opSens = Number.parseInt(opSensRange.value, 10) / 10;
		// 	opSensRange.nextElementSibling.innerHTML = `${config.controller.opSens}`;
		// });
		const opRange = document.getElementById('op-range') as HTMLInputElement;
		opRange.value = `${config.controller.opRange}`;
		opRange.nextElementSibling.innerHTML = `${config.controller.opRange}`;
		opRange.addEventListener('input', () => {
			config.controller.opRange = Number.parseInt(opRange.value, 10);
			opRange.nextElementSibling.innerHTML = `${config.controller.opRange}`;
		});
		const volumeRange = document.getElementById('volume-range') as HTMLInputElement;
		volumeRange.value = `${config.controller.volume}`;
		volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		volumeRange.addEventListener('input', () => {
			config.controller.volume = Number.parseInt(volumeRange.value, 10);
			volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		});
		const langSelect = document.getElementById('lang-select') as HTMLInputElement;
		langSelect.value = `${config.controller.language}`;
		langSelect.addEventListener('change', () => {
			config.controller.language = langSelect.value;
			deepCopy(languages[Number.parseInt(langSelect.value, 10)], language);
			this.toSettingMenu({ back });
			this.controller.uiController.ui.actionControl.plugin.updateLang();
		});
		const bagSelect = document.getElementById('bag-type-select') as HTMLInputElement;
		bagSelect.value = `${config.bag.type}`;
		bagSelect.addEventListener('change', () => {
			config.bag.type = bagSelect.value;
			this.controller.uiController.ui.bag.type = bagSelect.value as 'pc' | 'mobile' | 'vr';
			this.controller.uiController.ui.bag.place();
		});
		const operateSelect = document.getElementById('operate-select') as HTMLInputElement;
		operateSelect.value = `${config.controller.operation}`;
		operateSelect.addEventListener('change', () => {
			config.controller.operation = operateSelect.value as 'pc' | 'mobile' | 'vr';
			this.controller.uiController.ui.actionControl.load();
		});
		const crosshairSelect = document.getElementById('crosshair-select') as HTMLInputElement;
		crosshairSelect.value = `${config.controller.crosshair}`;
		crosshairSelect.addEventListener('change', () => {
			config.controller.crosshair = crosshairSelect.value;
			this.controller.uiController.ui.crosshair.dark = config.controller.crosshair === 'dark';
			this.controller.uiController.ui.crosshair.updataColor();
		});
		const opSensSelect = document.getElementById('op-sens-select') as HTMLInputElement;
		opSensSelect.value = `${config.controller.opSens * 2}`;
		crosshairSelect.addEventListener('change', () => {
			config.controller.opSens = Number.parseInt('crosshairSelect.value', 10) / 2;
		});
		const threadSelect = document.getElementById('thread-select') as HTMLInputElement;
		threadSelect.value = `${config.controller.thread}`;
		threadSelect.addEventListener('change', () => {
			config.controller.thread = Number.parseInt(threadSelect.value, 10);
			// TODO 注意, 这里要防止线程炸掉
		});
	}

	toInnerGameSettingMenu() {
		this.toSettingMenu({ back: 'toInnerGameMenu' });
		this.removeTitle();
		this.setGrayBkg();
	}

	toInnerGameMenu() {
		this.showMenu();
		this.setGrayBkg();
		this.removeTitle();
		this.showBorder();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
		<button id="back-game" class="button">${language.backGame}</button>
		<button id="game-setting" class="button">${language.setting}</button>
		<button id="game-full-screen" class="button">${language.setFullScreen}</button>
		<div class="box-line color-white">
			<button id="game-fps-mode" class="button"></button>
			<button id="game-cheat-mode" class="button"></button>
		</div>
		<button id="help" class="button">${language.help}</button>
		<button id="about" class="button">${language.about}</button>
		<br>
		<button id="save-game" class="button">${language.saveGame}</button>
		<button id="exit-game" class="button">${language.exitGame}</button>`;

		const backGameButton = document.getElementById('back-game');
		backGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.runGame();
		});

		const settingGameButton = document.getElementById('game-setting');
		settingGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.toInnerGameSettingMenu();
		});

		const help = this.boxElem.querySelector('#help');
		help.addEventListener('click', e => {
			e.stopPropagation();
			this.toHelpMenu({ back: 'toInnerGameMenu' });
		});
		const about = this.boxElem.querySelector('#about');
		about.addEventListener('click', e => {
			e.stopPropagation();
			this.toAboutMenu({ back: 'toInnerGameMenu' });
		});
		const fullScreen = this.boxElem.querySelector('#game-full-screen');
		fullScreen.addEventListener('click', e => {
			e.stopPropagation();
			if (document.fullscreenElement) {
				document.exitFullscreen && document.exitFullscreen();
			} else {
				document.body.requestFullscreen && document.body.requestFullscreen();
			}
		});

		const saveGameButton = document.getElementById('save-game');
		saveGameButton.addEventListener('click', e => {
			e.stopPropagation();
			localStorage.setItem('config', JSON.stringify(config));
			downloadJson(JSON.stringify(config));
			this.setNotify(language.saveSuccess);
		});

		const cheatModeButton = document.getElementById('game-cheat-mode');
		cheatModeButton.innerText = `${language.cheatMode}: ${config.controller.cheat ? language.on : language.off}`;
		cheatModeButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.toggleCheatMode();
			cheatModeButton.innerText = `${language.cheatMode}: ${config.controller.cheat ? language.on : language.off}`;
		});

		const fpsModeButton = document.getElementById('game-fps-mode');
		fpsModeButton.innerText = `${language.fps}: ${config.controller.fps ? language.on : language.off}`;
		fpsModeButton.addEventListener('click', e => {
			e.stopPropagation();
			config.controller.fps = !config.controller.fps;
			if (config.controller.fps) this.controller.uiController.ui.fps.begin();
			else this.controller.uiController.ui.fps.stop();
			fpsModeButton.innerText = `${language.fps}: ${config.controller.fps ? language.on : language.off}`;
		});

		const exitGameButton = document.getElementById('exit-game');
		exitGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.endGame();
			this.toStartMenu();
		});
	}

	toHelpMenu({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line title color-white">${language.help}</div>
			<div class="box-line color-white">
				<ul id="help">
					<li>
						<b>${language.mobileMode}</b>
						<ul class="help-item">
							<li><b>${language.helps[0].k}</b>:${language.helps[0].v} </li>
							<li><b>${language.helps[1].k}</b>:${language.helps[1].v} </li>
							<li><b>${language.helps[2].k}</b>:${language.helps[2].v} </li>
							<li><b>${language.helps[3].k}</b>:${language.helps[3].v} </li>
							<li><b>${language.helps[4].k}</b>:${language.helps[4].v} </li>
							<li><b>${language.helps[5].k}</b>:${language.helps[5].v} </li>
							<li><b>${language.helps[6].k}</b>:${language.helps[6].v} </li>
							<li><b>${language.helps[7].k}</b>:${language.helps[7].v} </li>
							<li><b>${language.helps[8].k}</b>:${language.helps[8].v} </li>
							<li><b>${language.helps[9].k}</b>:${language.helps[9].v} </li>
							<li><b>${language.helps[10].k}</b>:${language.helps[10].v} </li>
							<li><b>${language.helps[11].k}</b>:${language.helps[11].v} </li>
						</ul>
					</li>
					<li>
						<b>${language.vrMode}</b>
						<ul class="help-item">
							<li><b>${language.helps[12].k}</b>: ${language.helps[12].v}</li>
							<li><b>${language.helps[13].k}</b>: ${language.helps[13].v}</li>
							<li><b>${language.helps[14].k}</b>: ${language.helps[14].v}</li>
						</ul>
					</li>
					<li>
						<b>${language.pcMode}</b>
						<ul class="help-item">
							<li><b>${language.helps[15].k}</b>: ${language.helps[15].v}</li>
							<li><b>${language.helps[16].k}</b>: ${language.helps[16].v}</li>
						</ul>
					</li>
				</ul>
			</div>
			<br/>
			<button class="button" id="backMenu">${language.backMenu}</button>`;
		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this[back]();
		});
	}

	toAboutMenu({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line title color-white">${language.about}</div>
			<div class="box-line color-white">
				${language.aboutItems[0]}
			</div>
			<div class="box-line color-white">
			${language.aboutItems[1]}<a href="https://github.com/KairuiLiu/ThreeCraft" target="blank">Github</a>${language.aboutItems[2]}
			</div>
			<div class="box-line color-white">
			${language.aboutItems[3]}
			</div>
			<br/>
			<button class="button" id="backMenu">${language.backMenu}</button>`;
		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this[back]();
		});
	}

	static templateElement = `
		<div class="hidden" id="title"></div>
		<div class="box">`;
}

export default Menu;

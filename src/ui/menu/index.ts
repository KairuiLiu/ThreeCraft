import { Controller } from '../../controller';
import { deepCopy } from '../../utils/deep-copy';
import { config, defaultConfig } from '../../controller/config';
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

	// TODO * 3
	toStartMenu() {
		this.showMenu();
		this.showTitle();
		this.setImgBkg();
		this.removeBorder();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line">
				<button id="single-player-game" class="button">单人游戏</button>
				<button id="multi-player-game" class="button">多人游戏</button>
			</div>
			<div class="box-line" id="load-archive">
				<input id="load-archive-file" type="file" id="load-archive-file" class="file-loader" />
				<button id="load-archive-file-button" class="button">上载存档</button>
				<button id="load-archive-storage" class="button">缓存读档</button>
			</div>
			<button id="load-archive-cancel" class="button hidden">已加载, 点击取消</button>
			<button id="game-setting" class="button">游戏设置</button>
			<div class="box-line">
				<button id="help" class="button">帮助</button>
				<button id="about" class="button">关于项目</button>
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
				this.setNotify('读档成功');
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
				this.setNotify('读档成功');
				this.onLoadArchiveSuccess();
			} else {
				this.setNotify('浏览器无存档');
			}
		});
		const loadArchiveCancel = this.boxElem.querySelector('#load-archive-cancel');
		loadArchiveCancel.addEventListener('click', e => {
			e.stopPropagation();
			deepCopy(defaultConfig, config);
			this.onLoadArchiveCancel();
			this.setNotify('取消成功');
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
			<div class="box-line title color-white">多人游戏</div>
			<div class="radio-item"><input type="radio" name="play-mod" id="as-server" checked/><label for="as-server">创建房间</label></div>
			<div class="radio-item"><input type="radio" name="play-mod" id="as-client" /><label for="as-client">加入房间</label></div>
			<br/>
			<div class="box-line">
				<label  for="ip" class="fix-width color-white">IP: </label><input type="text" class="text-input" id="ip" />
			</div>
			<div class="box-line">
				<label  for="password" class="fix-width color-white">口令: </label><input type="text" class="text-input" id="password" />
				</div>
			<div class="box-line">
				<label  for="payer-number" class="fix-width color-white">人数: </label><input type="text" class="text-input" id="payer-number" disabled />
			</div>
			<br/>
			<button id="socket-start-game" class="button">开始游戏</button>
			<button id="socket-join-room" class="button hidden">加入房间</button>
			<button id="socket-exit-room" class="button hidden">退出房间</button>
			<button class="button" id="backMenu">返回</button>`;
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
		this.boxElem.innerHTML = `<div class="box-line title ">游戏设置</div>
		<div class="box-line">
			<div class="range-item">
				<label for="fov-range" class="fix-width">FOV</label>
				<input type="range" class="range" id="fov-range" name="fov-range" min="30" max="120" step="10" />
				<label for="fov-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="fog-range" class="fix-width">雾气因子</label>
				<input type="range" class="range" id="fog-range" name="fog-range" min="0" max="10" step="1" />
				<label for="fog-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="sim-range" class="fix-width">模拟距离</label>
				<input type="range" class="range" id="sim-range" name="sim-range" min="0" max="999" step="1" />
				<label for="sim-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="rend-range" class="fix-width">渲染距离</label>
				<input type="range" class="range" id="rend-range" name="rend-range" min="0" max="999" step="1" />
				<label for="rend-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<div class="range-item">
				<label for="volume-range" class="fix-width">音量</label>
				<input type="range" class="range" id="volume-range" name="volume-range" min="0" max="100" step="5" />
				<label for="volume-range" class="fix-width-mini text-right">---</label>
			</div>
		</div>
		<div class="box-line">
			<label for="lang-select" class="fix-width">语言</label>
			<select class="select" name="lang-select" id="lang-select">
				<option value="cn">中文</option>
				<option value="en">En&nbsp;&nbsp;</option>
			</select>
			<label for="operate-select" class="fix-width">操纵模式</label>
			<select class="select" name="operate-select" id="operate-select">
				<option value="pc">PC端</option>
				<option value="mobile">移动端</option>
				<option value="vr">VR</option>
			</select>
		</div>
		<div class="box-line">
			<label for="camera-select" class="fix-width">相机角度</label>
			<select class="select" name="camera-select" id="camera-select">
				<option value="3">高</option>
				<option value="2">中</option>
				<option value="1">低</option>
			</select>
			<label for="bag-type-select" class="fix-width">背包模式</label>
			<select class="select" name="bag-type-select" id="bag-type-select">
				<option value="pc">PC端</option>
				<option value="mobile">移动端</option>
				<option value="vr">VR</option>
			</select>
		</div>
		<br />
		<button class="button" id="backMenu">返回</button>`;
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
		fogRange.value = `${config.renderer.fog * 10}`;
		fogRange.nextElementSibling.innerHTML = `${config.renderer.fog}`;
		fogRange.addEventListener('input', () => {
			config.renderer.fog = Number.parseInt(fogRange.value, 10) / 10;
			fogRange.nextElementSibling.innerHTML = `${config.renderer.fog}`;
		});
		const simRange = document.getElementById('sim-range') as HTMLInputElement;
		simRange.value = `${config.renderer.simulateDistance}`;
		simRange.nextElementSibling.innerHTML = `${config.renderer.simulateDistance}`;
		simRange.addEventListener('input', () => {
			config.renderer.simulateDistance = Number.parseInt(simRange.value, 10);
			simRange.nextElementSibling.innerHTML = `${config.renderer.simulateDistance}`;
		});
		const renderRange = document.getElementById('rend-range') as HTMLInputElement;
		renderRange.value = `${config.renderer.renderDistance}`;
		renderRange.nextElementSibling.innerHTML = `${config.renderer.renderDistance}`;
		renderRange.addEventListener('input', () => {
			config.renderer.renderDistance = Number.parseInt(renderRange.value, 10);
			renderRange.nextElementSibling.innerHTML = `${config.renderer.renderDistance}`;
		});
		const volumeRange = document.getElementById('volume-range') as HTMLInputElement;
		volumeRange.value = `${config.controller.volume}`;
		volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		volumeRange.addEventListener('input', () => {
			config.controller.volume = Number.parseInt(volumeRange.value, 10);
			volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		});
		const cameraSelect = document.getElementById('camera-select') as HTMLInputElement;
		cameraSelect.value = `${config.camera.camHeight}`;
		cameraSelect.addEventListener('change', () => {
			config.camera.camHeight = Number.parseInt(cameraSelect.value, 10);
		});
		const langSelect = document.getElementById('lang-select') as HTMLInputElement;
		langSelect.value = `${config.controller.language}`;
		langSelect.addEventListener('change', () => {
			config.controller.language = langSelect.value as 'cn' | 'en';
		});
		// TODO 同步背包模式与语言
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
		<button id="back-game" class="button">返回游戏</button>
		<button id="game-setting" class="button">游戏设置</button>
		<button id="game-full-screen" class="button">全屏/取消全屏</button>
		<div class="box-line color-white">
			<button id="game-fps-mode" class="button"></button>
			<button id="game-cheat-mode" class="button"></button>
		</div>
		<button id="help" class="button">帮助</button>
		<button id="about" class="button">关于项目</button>
		<br>
		<button id="save-game" class="button">存档</button>
		<button id="exit-game" class="button">退出</button>`;

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
				document.exitFullscreen();
			} else {
				document.body.requestFullscreen();
			}
		});

		const saveGameButton = document.getElementById('save-game');
		saveGameButton.addEventListener('click', e => {
			e.stopPropagation();
			localStorage.setItem('config', JSON.stringify(config));
			downloadJson(JSON.stringify(config));
			this.setNotify('保存成功');
		});

		const cheatModeButton = document.getElementById('game-cheat-mode');
		cheatModeButton.innerText = `作弊模式: ${config.controller.cheat ? '开' : '关'}`;
		cheatModeButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.toggleCheatMode();
			cheatModeButton.innerText = `作弊模式: ${config.controller.cheat ? '开' : '关'}`;
		});

		const fpsModeButton = document.getElementById('game-fps-mode');
		fpsModeButton.innerText = `FPS: ${config.controller.fps ? '开' : '关'}`;
		fpsModeButton.addEventListener('click', e => {
			e.stopPropagation();
			config.controller.fps = !config.controller.fps;
			if (config.controller.fps) this.controller.uiController.ui.fps.begin();
			else this.controller.uiController.ui.fps.stop();
			fpsModeButton.innerText = `FPS: ${config.controller.fps ? '开' : '关'}`;
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
			<div class="box-line title color-white">帮助</div>
			<div class="box-line color-white">
				<ul id="help">
					<li>
						<b>PC端</b>
						<ul class="help-item">
							<li><b>F键</b>: 全屏</li>
							<li><b>E键</b>: 开关背包</li>
							<li><b>C键</b>: 作弊模式</li>
							<li><b>ESC键</b>: 显示菜单</li>
							<li><b>数字键</b>: 切换手持方块</li>
							<li><b>空格键</b>: 跳跃</li>
							<li><b>WSAD键</b>: 前后左右移动</li>
							<li><b>Shift键</b>: 作弊模式时下降</li>
							<li><b>鼠标移动</b>: 变换朝向</li>
							<li><b>滚轮滚动</b>: 切换手持方块</li>
							<li><b>鼠标左/右击</b>: 摧毁/创建方块</li>
							<li><b>点击物品框</b>: 切换手持方块</li>
						</ul>
					</li>
					<li>
						<b>移动端</b>
						<ul class="help-item">
							<li><b>拖动屏幕</b>: 变换朝向</li>
							<li><b>点击物品框</b>: 切换手持方块</li>
							<li><b>点击激活的物品框</b>: 打开背包</li>
						</ul>
					</li>
					<li>
						<b>VR</b>
						<ul class="help-item">
							<li><b>转动头显</b>: 变换朝向</li>
							<li><b>使用遥控器</b>: 摧毁方块</li>
						</ul>
					</li>
				</ul>
			</div>
			<br/>
			<button class="button" id="backMenu">返回</button>`;
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
			<div class="box-line title color-white">关于</div>
			<div class="box-line color-white">
				基于Three.js的Minecraft实现.
			</div>
			<div class="box-line color-white">
				去<a href="https://github.com/KairuiLiu/ThreeCraft" target="blank">Github</a>了解更多:)
			</div>
			<br/>
			<button class="button" id="backMenu">返回</button>`;
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

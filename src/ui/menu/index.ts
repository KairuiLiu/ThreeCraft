import { Controller } from '../../controller';
import { deepCopy } from '../../utils/deep-copy';
import { config, defaultConfig, language, languages } from '../../controller/config';
import { downloadJson } from '../../utils/download';
import { chromeTest } from '../../utils/chrome-test';
import { addressTest } from '../../utils/address-test';

class Menu {
	elem: HTMLElement;

	titleElem: HTMLElement;

	boxElem: HTMLElement;

	controller: Controller;

	constructor(el: HTMLElement, controller) {
		this.controller = controller;
		// 清空挂载点下的元素
		[...el.children].forEach(d => d.getAttribute('id') === 'menu' && d.remove());
		this.elem = document.createElement('div');
		this.elem.setAttribute('id', 'menu');
		this.elem.innerHTML = Menu.templateElement;
		this.elem.classList.add('background-image');
		this.titleElem = this.elem.querySelector('#title');
		this.boxElem = this.elem.querySelector('.box');
		el.appendChild(this.elem);
		// 打开初始菜单
		this.toStartMenu();
	}

	// 删除菜单栏中选项
	clearMenuItem() {
		[...this.boxElem.children].forEach(d => d.remove());
	}

	// 显示背景图
	setImgBkg() {
		this.elem.classList.remove('background-pain-color');
		this.elem.classList.add('background-image');
	}

	// 显示灰色背景
	setGrayBkg() {
		this.elem.classList.add('background-pain-color');
		this.elem.classList.remove('background-image');
	}

	// 显示MC logo
	showTitle() {
		this.titleElem.classList.remove('hidden');
	}

	// 移除MC logo
	removeTitle() {
		this.titleElem.classList.add('hidden');
	}

	// 显示菜单外边框
	showBorder() {
		this.boxElem.classList.add('border-box');
	}

	// 移除菜单外边框
	removeBorder() {
		this.boxElem.classList.remove('border-box');
	}

	// 显示菜单
	showMenu() {
		this.elem.classList.remove('hidden');
	}

	// 移除菜单
	hideMenu() {
		this.elem.classList.add('hidden');
	}

	// 发出一个通知, 通知信息, 显示时长, 挂载位置
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

	// 上传存档成功回调
	onLoadArchiveSuccess() {
		document.getElementById('load-archive').classList.add('hidden');
		document.getElementById('load-archive-cancel').classList.remove('hidden');
		this;
	}

	// 上传存档取消回调
	onLoadArchiveCancel() {
		document.getElementById('load-archive').classList.remove('hidden');
		document.getElementById('load-archive-cancel').classList.add('hidden');
		this;
	}

	// 进入开始菜单
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
				<input id="load-archive-file" type="file" accept=".json" id="load-archive-file" class="file-loader" />
				<button id="load-archive-file-button" class="button">${language.uploadArchive}</button>
				<button id="load-archive-storage" class="button">${language.browserArchive}</button>
			</div>
			<button id="load-archive-cancel" class="button hidden">${language.cancelArchive}</button>
			<button id="game-setting" class="button">${language.setting}</button>
			<div class="box-line">
				<button id="help" class="button">${language.help}</button>
				<button id="about" class="button">${language.about}</button>
			</div>
			<button id="chrome-recommend" class="button hidden">${language.chromeSupport}</button>`;
		// 单人游戏
		const singlePlayerGame = this.boxElem.querySelector('#single-player-game');
		singlePlayerGame.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.startGame(true);
		});
		// 多人游戏
		const multiPlayerGame = this.boxElem.querySelector('#multi-player-game');
		multiPlayerGame.addEventListener('click', e => {
			e.stopPropagation();
			this.toSocketServer({ back: 'toStartMenu' });
		});
		// 上传存档文件的上传文件按钮(已经被隐藏了)
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
		// 上传存档文件的上传文件按钮(已经被隐藏了)
		const loadArchiveFileButton = this.boxElem.querySelector('#load-archive-file-button') as HTMLInputElement;
		loadArchiveFileButton.addEventListener('click', e => {
			e.stopPropagation();
			loadArchiveFile.click();
		});
		// 缓存读档
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
		// 取消使用存档
		const loadArchiveCancel = this.boxElem.querySelector('#load-archive-cancel');
		loadArchiveCancel.addEventListener('click', e => {
			e.stopPropagation();
			deepCopy(defaultConfig, config);
			this.onLoadArchiveCancel();
			this.setNotify(language.cancelSuccess);
		});
		// 游戏设置
		const gameSetting = this.boxElem.querySelector('#game-setting');
		gameSetting.addEventListener('click', e => {
			e.stopPropagation();
			this.toSettingMenu({ back: 'toStartMenu' });
		});
		// 游戏帮助
		const help = this.boxElem.querySelector('#help');
		help.addEventListener('click', e => {
			e.stopPropagation();
			this.toHelpMenu({ back: 'toStartMenu' });
		});
		// 关于项目
		const about = this.boxElem.querySelector('#about');
		about.addEventListener('click', e => {
			e.stopPropagation();
			this.toAboutMenu({ back: 'toStartMenu' });
		});
		// 如果不是Chrome则提供下载链接
		if (!chromeTest()) {
			const chromeRecommend = this.boxElem.querySelector('#chrome-recommend');
			chromeRecommend.classList.remove('hidden');
			chromeRecommend.addEventListener('click', () => {
				window.open(language.chromeAddress, 'target');
			});
		}
	}

	toSocketServer({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line title color-white">${language.linkServer}</div>
			<div class="radio-item"><input type="radio" name="server-mod" id="default-server" checked/><label for="default-server">${language.defaultServer}</label></div>
			<div class="radio-item"><input type="radio" name="server-mod" id="custom-server" /><label for="custom-server">${language.customServer}</label></div>
			<br/>
			<div class="box-line hidden" id="ip-row">
				<label for="ip" class="fix-width color-white">${language.serverAddress}: </label><input type="text" class="text-input" id="ip"  />
			</div>
			<br/>
			<button id="socket-link-server" class="button">${language.linkServer}</button>
			<button id="socket-cancel-link-server" class="button hidden">${language.cancelLink}</button>
			<button id="socket-choose-room" class="button hidden">${language.chooseRoom}</button>
			<button class="button" id="backMenu">${language.backMenu}</button>`;

		const serverModDefault = document.getElementById('default-server') as HTMLInputElement;
		const serverModCustom = document.getElementById('custom-server') as HTMLInputElement;
		const ipCustom = document.getElementById('ip') as HTMLInputElement;
		const ipRow = document.getElementById('ip-row');
		const linkServerButton = document.getElementById('socket-link-server') as HTMLInputElement;
		const cancelLinkServer = document.getElementById('socket-cancel-link-server');
		const chooseRoom = document.getElementById('socket-choose-room');

		serverModDefault.addEventListener('click', () => {
			ipRow.classList.add('hidden');
			linkServerButton.disabled = false;
		});

		serverModCustom.addEventListener('click', () => {
			ipRow.classList.remove('hidden');
			if (addressTest(ipCustom.value)) linkServerButton.disabled = false;
			else linkServerButton.disabled = true;
		});

		ipCustom.addEventListener('keyup', () => {
			if (addressTest(ipCustom.value)) linkServerButton.disabled = false;
			else linkServerButton.disabled = true;
		});

		linkServerButton.addEventListener('click', () => {
			linkServerButton.disabled = true;
			setTimeout(() => {
				linkServerButton.disabled = false;
			}, 3000);
			this.controller.multiPlay.init(serverModCustom.checked ? ipCustom.value : undefined);
			this.controller.multiPlay.bindMenuEvent({
				onConnect: () => {
					linkServerButton.classList.add('hidden');
					cancelLinkServer.classList.remove('hidden');
					chooseRoom.classList.remove('hidden');
					serverModDefault.disabled = true;
					serverModCustom.disabled = true;
				},
				onDisconnect: () => {
					this.setNotify(language.disconnect);
					linkServerButton.classList.remove('hidden');
					cancelLinkServer.classList.add('hidden');
					chooseRoom.classList.add('hidden');
					serverModDefault.disabled = false;
					serverModCustom.disabled = false;
				},
				onCreateRoom: null,
				onJoinRoom: null,
				onPlayerChange: null,
				onDissolve: null,
			});
		});

		cancelLinkServer.addEventListener('click', () => {
			this.controller.multiPlay.clear();
			linkServerButton.classList.remove('hidden');
			chooseRoom.classList.add('hidden');
			cancelLinkServer.classList.add('hidden');
			serverModDefault.disabled = false;
			serverModCustom.disabled = false;
		});

		chooseRoom.addEventListener('click', () => {
			this.toSocketConfigMenu({ back: 'toSocketServer' });
		});

		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			this.controller.multiPlay.clear();
			e.stopPropagation();
			this[back]();
		});
		this.setNotify(language.developing, 2000, this.boxElem);
	}

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
			<label for="nickName" class="fix-width color-white">${language.nickname}: </label><input type="text" class="text-input" id="nickName" />
			</div>
			<div class="box-line" id="roomNameContent">
				<label for="roomName" class="fix-width color-white">${language.roomName}: </label><input type="text" class="text-input" id="roomName" />
			</div>
			<div class="box-line" id="playerNameContent">
				<label for="player" class="fix-width color-white">${language.player}: </label><input type="text" class="text-input" id="player" disabled />
			</div>
			<br/>
			<button id="socket-start-game" class="button hidden">${language.startGame}</button>
			<button id="socket-create-room" class="button">${language.createRoom}</button>
			<button id="socket-dissolve-room" class="button hidden">${language.dissolveRoom}</button>
			<button id="socket-join-room" class="button hidden">${language.joinRoom}</button>
			<button id="socket-exit-room" class="button hidden">${language.exitRoom}</button>
			<button class="button" id="backMenu">${language.backMenu}</button>`;

		const asServerButton = document.getElementById('as-server') as HTMLInputElement;
		const asClientButton = document.getElementById('as-client') as HTMLInputElement;
		const roomName = document.getElementById('roomName') as HTMLInputElement;
		const nickName = document.getElementById('nickName') as HTMLInputElement;
		const playerName = document.getElementById('player') as HTMLInputElement;

		const startGameButton = document.getElementById('socket-start-game');
		const createRoomButton = document.getElementById('socket-create-room');
		const dissolveRoomButton = document.getElementById('socket-dissolve-room');
		const joinRoomButton = document.getElementById('socket-join-room');
		const exitRoomButton = document.getElementById('socket-exit-room');
		const gameButtons = [startGameButton, createRoomButton, dissolveRoomButton, joinRoomButton, exitRoomButton];

		this.controller.multiPlay.bindMenuEvent({
			onCreateRoom: res => {
				const { data } = res;
				roomName.value = data.roomInfo.roomId;
				playerName.value = [...this.controller.multiPlay.players].reduce((d, prev) => `${prev + d} `, '');
				createRoomButton.classList.add('hidden');
				dissolveRoomButton.classList.remove('hidden');
				asServerButton.disabled = true;
				asClientButton.disabled = true;
				nickName.disabled = true;
				roomName.disabled = true;
			},
			onJoinRoom: res => {
				if (res.message === 'JOIN_FAILED') {
					this.setNotify(language.joinFailed);
					return;
				}
				const { data } = res;
				roomName.value = data.roomInfo.roomId;
				playerName.value = [...this.controller.multiPlay.players].reduce((d, prev) => `${prev + d} `, '');
				joinRoomButton.classList.add('hidden');
				exitRoomButton.classList.remove('hidden');
				asServerButton.disabled = true;
				asClientButton.disabled = true;
				nickName.disabled = true;
				roomName.disabled = true;
			},
			onDissolve: () => {
				this.setNotify(language.dissolve);
				playerName.value = '';
				gameButtons.forEach(d => d.classList.add('hidden'));
				if (asServerButton.checked) createRoomButton.classList.remove('hidden');
				else joinRoomButton.classList.remove('hidden');
				asServerButton.disabled = false;
				asClientButton.disabled = false;
				nickName.disabled = false;
				roomName.disabled = false;
			},
			onPlayerChange: () => {
				playerName.value = [...this.controller.multiPlay.players].reduce((d, prev) => `${prev + d} `, '');
			},
			onDisconnect: () => {
				this.setNotify(language.disconnect);
				gameButtons.forEach(d => d.classList.add('hidden'));
				playerName.value = '';
				if (asServerButton.checked) createRoomButton.classList.remove('hidden');
				else joinRoomButton.classList.remove('hidden');
				asServerButton.disabled = false;
				asClientButton.disabled = false;
				nickName.disabled = false;
				roomName.disabled = false;
			},
			onConnect: null,
		});

		asServerButton.addEventListener('click', () => {
			gameButtons.forEach(d => d.classList.add('hidden'));
			createRoomButton.classList.remove('hidden');
		});

		asClientButton.addEventListener('click', () => {
			gameButtons.forEach(d => d.classList.add('hidden'));
			joinRoomButton.classList.remove('hidden');
		});

		createRoomButton.addEventListener('click', () => {
			this.controller.multiPlay.emitCreateRoom(nickName.value);
		});

		dissolveRoomButton.addEventListener('click', () => {
			this.controller.multiPlay.emitDissolveRoom();
		});

		startGameButton.addEventListener('click', () => {
			this.controller.multiPlay.emitStartGame();
		});

		joinRoomButton.addEventListener('click', () => {
			this.controller.multiPlay.emitJoinRoom(nickName.value);
		});

		exitRoomButton.addEventListener('click', () => {
			this.controller.multiPlay.emitLeaveRoom();
		});

		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.multiPlay.emitLeaveRoom();
			this[back]({ back: 'toStartMenu' });
		});
		this.setNotify(language.developing, 2000, this.boxElem);
	}

	// 设置菜单
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
				<input type="range" class="range" id="fog-range" name="fog-range" min="0" max="5" step="1" />
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
				<option value="xbox">${language.xbox}</option>
				<option value="ps">${language.ps45}</option>
				<!--<option value="vr">${language.vrMode}</option>-->
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
				<option value="xbox">${language.xbox}</option>
				<option value="ps">${language.ps45}</option>
				<!--<option value="vr">${language.vrMode}</option>-->
			</select>
		</div>

		<br />
		<button class="button" id="backMenu">${language.backMenu}</button>`;
		// 返回上一级
		const backMenu = document.getElementById('backMenu');
		backMenu.addEventListener('click', e => {
			e.stopPropagation();
			this[back]();
		});
		// FOV修改
		const fovRange = document.getElementById('fov-range') as HTMLInputElement;
		fovRange.value = `${config.camera.fov}`;
		fovRange.nextElementSibling.innerHTML = `${config.camera.fov}`;
		fovRange.addEventListener('input', () => {
			config.camera.fov = Number.parseInt(fovRange.value, 10);
			fovRange.nextElementSibling.innerHTML = `${config.camera.fov}`;
		});
		// 雾气因子
		const fogRange = document.getElementById('fog-range') as HTMLInputElement;
		// fog: 0.01-0.05
		fogRange.value = `${config.renderer.fog * 100}`;
		fogRange.nextElementSibling.innerHTML = `${(config.renderer.fog * 10).toFixed(1)}`;
		fogRange.addEventListener('input', () => {
			config.renderer.fog = Number.parseInt(fogRange.value, 10) / 100;
			// ! 这不是bug, fog指数应该在0.0-0.1, 但是设计UI的时候没考虑三位小数放不下的问题..., 所以这里就*10了
			fogRange.nextElementSibling.innerHTML = `${(config.renderer.fog * 10).toFixed(1)}`;
		});
		// 场景大小
		const stageRange = document.getElementById('stage-range') as HTMLInputElement;
		stageRange.value = `${Math.sqrt(config.renderer.stageSize)}`;
		stageRange.nextElementSibling.innerHTML = `${config.renderer.stageSize}`;
		stageRange.addEventListener('input', () => {
			config.renderer.stageSize = Number.parseInt(stageRange.value, 10) ** 2;
			stageRange.nextElementSibling.innerHTML = `${config.renderer.stageSize}`;
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
		// 操作范围
		const opRange = document.getElementById('op-range') as HTMLInputElement;
		opRange.value = `${config.controller.opRange}`;
		opRange.nextElementSibling.innerHTML = `${config.controller.opRange}`;
		opRange.addEventListener('input', () => {
			config.controller.opRange = Number.parseInt(opRange.value, 10);
			opRange.nextElementSibling.innerHTML = `${config.controller.opRange}`;
		});
		// 音量
		const volumeRange = document.getElementById('volume-range') as HTMLInputElement;
		volumeRange.value = `${config.controller.volume}`;
		volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		volumeRange.addEventListener('input', () => {
			config.controller.volume = Number.parseInt(volumeRange.value, 10);
			volumeRange.nextElementSibling.innerHTML = `${config.controller.volume}`;
		});
		// 语言
		const langSelect = document.getElementById('lang-select') as HTMLInputElement;
		langSelect.value = `${config.controller.language}`;
		langSelect.addEventListener('change', () => {
			config.controller.language = langSelect.value;
			deepCopy(languages[Number.parseInt(langSelect.value, 10)], language);
			this.toSettingMenu({ back });
			this.controller.uiController.ui.actionControl.plugin.updateLang();
		});
		// 背包模式
		const bagSelect = document.getElementById('bag-type-select') as HTMLInputElement;
		bagSelect.value = `${config.bag.type}`;
		bagSelect.addEventListener('change', () => {
			config.bag.type = bagSelect.value;
			this.controller.uiController.ui.bag.type = bagSelect.value as 'pc' | 'mobile' | 'vr';
			this.controller.uiController.ui.bag.place();
		});
		// 操作模式
		const operateSelect = document.getElementById('operate-select') as HTMLInputElement;
		operateSelect.value = `${config.controller.operation}`;
		operateSelect.addEventListener('change', () => {
			config.controller.operation = operateSelect.value as 'pc' | 'mobile' | 'vr';
			this.controller.uiController.ui.actionControl.load();
		});
		// 准星样式
		const crosshairSelect = document.getElementById('crosshair-select') as HTMLInputElement;
		crosshairSelect.value = `${config.controller.crosshair}`;
		crosshairSelect.addEventListener('change', () => {
			config.controller.crosshair = crosshairSelect.value;
			this.controller.uiController.ui.crosshair.dark = config.controller.crosshair === 'dark';
			this.controller.uiController.ui.crosshair.updataColor();
		});
		// 操纵灵敏度
		const opSensSelect = document.getElementById('op-sens-select') as HTMLInputElement;
		opSensSelect.value = `${config.controller.opSens * 2}`;
		crosshairSelect.addEventListener('change', () => {
			config.controller.opSens = Number.parseInt('crosshairSelect.value', 10) / 2;
		});
		// 线程数
		const threadSelect = document.getElementById('thread-select') as HTMLInputElement;
		threadSelect.value = `${config.controller.thread}`;
		threadSelect.addEventListener('change', () => {
			config.controller.thread = Number.parseInt(threadSelect.value, 10);
			this.controller.core.terrain.generator.setTreader(config.controller.thread);
		});
	}

	// 在游戏菜单中选择设置
	toInnerGameSettingMenu() {
		this.toSettingMenu({ back: 'toInnerGameMenu' });
		this.removeTitle();
		this.setGrayBkg();
	}

	// 调起游戏内菜单
	toInnerGameMenu() {
		this.showMenu();
		this.setGrayBkg();
		this.removeTitle();
		this.showBorder();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
		<div class="box-line color-white" id="back-game-line">
			<button id="back-game" class="button">${language.backGame}</button>
			<button id="back-game-vr" class="button hidden"></button>
		</div>
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
		// 返回游戏
		const backGameButton = document.getElementById('back-game');
		backGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.runGame();
		});
		// 进入/退出VR
		if (this.controller.vrSupport) {
			const backGameVRButton = document.getElementById('back-game-vr');
			backGameVRButton.classList.remove('hidden');
			backGameVRButton.innerText = this.controller.vr ? language.exitVR : language.enterVR;
			backGameVRButton.addEventListener('click', e => {
				e.stopPropagation();
				this.controller.vr = !this.controller.vr;
				this.controller.VRButtonElem.click();
				this.controller.runGame();
			});
		}
		// 游戏设置
		const settingGameButton = document.getElementById('game-setting');
		settingGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.toInnerGameSettingMenu();
		});
		// 帮助
		const help = this.boxElem.querySelector('#help');
		help.addEventListener('click', e => {
			e.stopPropagation();
			this.toHelpMenu({ back: 'toInnerGameMenu' });
		});
		// 关于
		const about = this.boxElem.querySelector('#about');
		about.addEventListener('click', e => {
			e.stopPropagation();
			this.toAboutMenu({ back: 'toInnerGameMenu' });
		});
		// 全屏/取消全屏
		const fullScreen = this.boxElem.querySelector('#game-full-screen');
		fullScreen.addEventListener('click', e => {
			e.stopPropagation();
			if (document.fullscreenElement) {
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozExitFullscreen) document.mozExitFullscreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			} else if (document.body.requestFullScreen) document.body.requestFullScreen();
			else if (document.body.mozRequestFullScreen) document.body.mozRequestFullScreen();
			else if (document.body.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
		});
		// 存档
		const saveGameButton = document.getElementById('save-game');
		saveGameButton.addEventListener('click', e => {
			e.stopPropagation();
			config.log = this.controller.log.export();
			localStorage.setItem('config', JSON.stringify(config));
			downloadJson(JSON.stringify(config));
			this.setNotify(language.saveSuccess);
		});
		// 开关作弊模式
		const cheatModeButton = document.getElementById('game-cheat-mode');
		cheatModeButton.innerText = `${language.cheatMode}: ${config.controller.cheat ? language.on : language.off}`;
		cheatModeButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.toggleCheatMode();
			cheatModeButton.innerText = `${language.cheatMode}: ${config.controller.cheat ? language.on : language.off}`;
		});
		// 开关FPS显示
		const fpsModeButton = document.getElementById('game-fps-mode');
		fpsModeButton.innerText = `${language.fps}: ${config.controller.fps ? language.on : language.off}`;
		fpsModeButton.addEventListener('click', e => {
			e.stopPropagation();
			config.controller.fps = !config.controller.fps;
			if (config.controller.fps) this.controller.uiController.ui.fps.begin();
			else this.controller.uiController.ui.fps.stop();
			fpsModeButton.innerText = `${language.fps}: ${config.controller.fps ? language.on : language.off}`;
		});
		// 推出游戏
		const exitGameButton = document.getElementById('exit-game');
		exitGameButton.addEventListener('click', e => {
			e.stopPropagation();
			this.controller.endGame();
			this.toStartMenu();
		});
	}

	// 帮助菜单
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
						<b>${language.pcMode}</b>
						<ul class="help-item">
							${language.helps.slice(0, 11).reduce((pre, d) => `${pre}<li><b>${d.k}</b>:${d.v}</li>`, '')}
						</ul>
					</li>
					<li>
						<b>${language.mobileMode}</b>
						<ul class="help-item">
							${language.helps.slice(11, 14).reduce((pre, d) => `${pre}<li><b>${d.k}</b>:${d.v}</li>`, '')}
						</ul>
					</li>
					<li>
						<b>${language.joystick}</b>
						<ul class="help-item">
							<details>
							<summary><b>${language.xboxJoystick}</b></summary>
							<img id="xbox-img" src="${language.xboxImg}"/>
							</details>
							<details>
							<summary><b>${language.psJoystick}</b></summary>
							<img id="ps-img" src="${language.psImg}"/>
							</details>
						</ul>
					</li>
					<li>
						<b>${language.vrMode}</b>
						<ul class="help-item">
							${language.helps.slice(14, 16).reduce((pre, d) => `${pre}<li><b>${d.k}</b>:${d.v}</li>`, '')}
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

	// 关于菜单
	toAboutMenu({ back }) {
		this.showMenu();
		this.showBorder();
		this.removeTitle();
		this.clearMenuItem();
		this.boxElem.innerHTML = `
			<div class="box-line title color-white">${language.about}</div>
			<div class="box-line color-white">${language.aboutItems[0]}</div>
			<div class="box-line color-white">
			${language.aboutItems[1]}<a href="https://github.com/KairuiLiu/ThreeCraft" target="blank">Github</a>${language.aboutItems[2]}
			</div>
			<div class="box-line color-white">
			${language.aboutItems[3]}
			</div>
			<br/>
			<div class="color-white">
				&copy; 2022${new Date().getFullYear() === 2022 ? '' : -new Date().getFullYear()} <span class="with-love">❤</span>&nbspLiu Kairui
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

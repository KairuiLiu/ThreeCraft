import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { BlockLog } from '../../utils/types/block';
import { Controller } from '..';
import type { ClientToServerEvents, ServerToClientEvents } from '../../utils/types/multiPlayer/server';
import { deepCopy } from '../../utils/deep-copy';
import { config, language } from '../config';
import PlayersController from './players';

class MultiPlay {
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;

	logs: BlockLog[];

	controller: Controller;

	working: boolean;

	roomId: string | null;

	playing: boolean;

	userName: string | null;

	players: Set<string>;

	playersController: PlayersController;

	lastUpdate: number;

	constructor(controller: Controller) {
		this.socket = null;
		this.controller = controller;
		this.logs = [];
		this.userName = null;
		this.working = false;
		this.roomId = null;
		this.playing = false;
		this.players = new Set();
		this.lastUpdate = 0;
		this.playersController = new PlayersController();
	}

	init(address = '') {
		this.socket?.disconnect();
		this.socket = io(address);
		this.working = true;
	}

	bindMenuEvent({ onConnect, onDisconnect, onCreateRoom, onJoinRoom, onPlayerChange, onDissolve }) {
		onConnect && this.socket?.on('connect', onConnect);
		onDisconnect && this.socket?.on('disconnect', onDisconnect);
		onCreateRoom &&
			this.socket?.on('RES_CREATE_ROOM', res => {
				this.roomId = res.data.roomInfo.roomId;
				res.data.roomInfo.players.forEach(d => this.players.add(d));
				onCreateRoom(res);
			});
		onJoinRoom &&
			this.socket?.on('RES_JOIN_ROOM', res => {
				if (res.message === 'JOIN_SUCCESS') {
					this.roomId = res.data.roomInfo.roomId;
					[...res.data.roomInfo.players].forEach(d => this.players.add(d));
				}
				onJoinRoom(res);
			});
		onPlayerChange &&
			this.socket?.on('PLAYER_CHANGE', res => {
				const { action, userName } = res;
				if (action === 'join') this.players.add(userName);
				else this.players.delete(userName);
				this.controller.ui.menu.setNotify(`${userName} ${action === 'join' ? language.wsMessage.PLAYER_CHANGE_JOIN : language.wsMessage.PLAYER_CHANGE_LEAVE}`);
				onPlayerChange(res);
			});
		onDissolve &&
			this.socket?.on('ROOM_DISSOLVE', res => {
				this.controller.ui.menu.setNotify(language.wsMessage.ROOM_DISSOLVED);
				onDissolve(res);
			});
		this.socket?.on('START_GAME', res => {
			if (this.controller.running) return;
			deepCopy(res.config, config);
			this.bindGame();
			this.controller.startGame(false);
			this.playersController.init(
				this.roomId,
				this.controller.core.scene,
				[...res.playerName].map(d => d[1].name).map(d => (d === this.userName ? null : d))
			);
		});
	}

	bindGame() {
		this.socket?.on('PLAYER_CHANGE', res => {
			const { userName, action } = res;
			if (action === 'join') this.players.add(userName);
			else {
				this.playersController.removeAll();
				this.players.delete(userName);
			}
			this.controller.ui.menu.setNotify(
				`${userName} ${action === 'join' ? language.wsMessage.PLAYER_CHANGE_JOIN : language.wsMessage.PLAYER_CHANGE_LEAVE}`,
				1000,
				this.controller.uiController.ui.actionControl.elem
			);
		});
		this.socket?.on('LOG_UPDATE', res => {
			const { userName, log, position } = res;
			if (userName !== this.userName) this.applyLog(log);
			this.playersController.update(userName, new THREE.Vector3(position.posX, position.posY, position.posZ), new THREE.Euler(position.dirX, position.dirY, position.dirZ, 'YXZ'));
		});
		this.socket?.on('ROOM_DISSOLVE', () => {
			this.controller.ui.menu.setNotify(language.wsMessage.ROOM_DISSOLVED, 1000, this.controller.uiController.ui.actionControl.elem);
			this.clear();
			this.playersController.removeAll();
		});
		this.socket?.on('disconnect', () => {
			this.controller.ui.menu.setNotify(language.wsMessage.DISCONNECT, 1000, this.controller.uiController.ui.actionControl.elem);
			this.playersController.removeAll();
		});
	}

	clear() {
		this.logs = [];
		this.working = false;
		this.roomId = null;
		this.playing = false;
		this.userName = '';
		this.players.clear();
	}

	insertLog(logs: BlockLog[]) {
		this.logs.push(...logs);
	}

	applyLog(logs: BlockLog[]) {
		this.controller.log.load(logs);
		this.controller.gameController.blockController.update(logs, true);
	}

	emitCreateRoom(userName) {
		this.userName = userName;
		this.socket.emit('CREATE_ROOM', {
			type: 'CREATE_ROOM',
			data: { userName: this.userName },
		});
	}

	emitJoinRoom(userName, roomId) {
		this.userName = userName;
		this.roomId = roomId;
		this.socket?.emit('JOIN_ROOM', {
			type: 'JOIN_ROOM',
			data: { roomId: this.roomId, userName: this.userName },
		});
	}

	emitLeaveRoom() {
		this.socket?.emit('LEAVE_ROOM', {
			type: 'LEAVE_ROOM',
			data: { roomId: this.roomId },
		});
		this.clear();
	}

	emitDissolveRoom() {
		this.socket?.emit('DISSOLVE_ROOM', {
			type: 'DISSOLVE_ROOM',
			data: { roomId: this.roomId },
		});
		this.clear();
	}

	emitStartGame() {
		this.controller.startGame(true);
		this.bindGame();
		this.socket?.emit('START_GAME', {
			type: 'START_GAME',
			data: { roomId: this.roomId, initConfig: MultiPlay.getConfig() },
		});
	}

	emitUpdateState() {
		const curTime = performance.now();
		if (curTime - this.lastUpdate < 150) return;
		this.lastUpdate = curTime;
		this.socket.emit('UPDATE_STATE', {
			type: 'UPDATE_STATE',
			data: {
				roomId: this.roomId,
				info: this.logs as BlockLog[],
				position: {
					...config.state,
					dirX: this.controller.core!.camera.rotation.x,
					dirY: this.controller.core!.camera.rotation.y,
					dirZ: this.controller.core!.camera.rotation.z,
				},
			},
		});
		this.logs = [];
	}

	static getConfig() {
		// eslint-disable-next-line
		return (({ seed, cloudSeed, treeSeed, weather, state, log }) => ({ seed, cloudSeed, treeSeed, weather, state, log }))(config);
	}
}

export default MultiPlay;

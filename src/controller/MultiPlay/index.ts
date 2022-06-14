import { io, Socket } from 'socket.io-client';
import { BlockLog } from '../../utils/types/block';
import { Controller } from '..';
import type { ClientToServerEvents, ServerToClientEvents } from '../../utils/types/multiPlayer/server';
import { deepCopy } from '../../utils/deep-copy';
import { config, language } from '../config';

class MultiPlay {
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;

	logs: BlockLog[];

	controller: Controller;

	working: boolean;

	roomId: string | null;

	playing: boolean;

	userName: string | null;

	players: Set<string>;

	constructor(controller: Controller) {
		this.socket = null;
		this.controller = controller;
		this.logs = [];
		this.userName = null;
		this.working = false;
		this.roomId = null;
		this.playing = false;
		this.players = new Set();
	}

	init(address = '/socket') {
		// this.socket = io(address);
		this.socket = io('http://127.0.0.1:9000');
	}

	bindMenuEvent({ onConnect, onDisconnect, onCreateRoom, onJoinRoom, onPlayerChange, onDissolve }) {
		onConnect && this.socket!.on('connect', onConnect);
		onDisconnect && this.socket!.on('disconnect', onDisconnect);
		onCreateRoom &&
			this.socket!.on('RES_CREATE_ROOM', res => {
				this.roomId = res.data.roomInfo.roomId;
				// ! BUG!! cause of internet
				// [...res.data.roomInfo.players].forEach(d => this.players.add(d[1].name));
				onCreateRoom(res);
			});
		onJoinRoom &&
			this.socket!.on('RES_JOIN_ROOM', res => {
				if (res.message !== 'JOIN_FAILED') {
					this.roomId = res.data.roomInfo.roomId;
					[...res.data.roomInfo.players].forEach(d => this.players.add(d[1].name));
				}
				onJoinRoom(res);
			});
		onPlayerChange &&
			this.socket!.on('PLAYER_CHANGE', res => {
				const { action, userName } = res.data;
				if (action === 'join') this.players.add(userName);
				else this.players.delete(userName);
				onPlayerChange(res);
			});
		onDissolve && this.socket!.on('ROOM_DISSOLVE', onDissolve);
		this.socket!.on('START_GAME', res => {
			const { data } = res;
			deepCopy(data.config, config);
			this.bindGame();
			this.controller.startGame(false);
		});
	}

	bindGame() {
		this.socket!.on('PLAYER_CHANGE', res => {
			const { userName, action } = res.data;
			if (action === 'join') this.players.add(userName);
			else this.players.delete(userName);
			this.controller.ui.menu.setNotify(`${userName} ${action === 'join' ? language.joinedRoom : language.leavedRoom}`, 1000, this.controller.uiController.ui.actionControl.elem);
		});
		this.socket!.on('LOG_UPDATE', res => {
			const { userName, log } = res.data;
			if (userName === this.userName) this.insertLog(log);
		});
		this.socket!.on('ROOM_DISSOLVE', () => {
			this.controller.ui.menu.setNotify(language.roomDissolved, 1000, this.controller.uiController.ui.actionControl.elem);
			this.clear();
		});
		this.socket!.on('disconnect', () => {
			this.controller.ui.menu.setNotify(language.connectLose, 1000, this.controller.uiController.ui.actionControl.elem);
			this.clear();
		});
	}

	clear() {
		this.socket.disconnect();
		this.socket = null;
		this.logs = [];
		this.working = false;
		this.roomId = null;
		this.playing = false;
		this.userName = '';
		this.players.clear();
	}

	insertLog(logs: iBlockLog[]) {
		this.logs.push(...logs);
	}

	applyLog(logs: iBlockLog[]) {
		this.controller.gameController.blockController.update(logs);
	}

	emitCreateRoom(userName) {
		this.userName = userName;
		this.socket.emit('CREATE_ROOM', {
			type: 'CREATE_ROOM',
			data: { userName: this.userName },
		});
	}

	emitJoinRoom(userName) {
		this.userName = userName;
		this.socket!.emit('JOIN_ROOM', {
			type: 'JOIN_ROOM',
			data: { roomId: this.roomId, userName: this.userName },
		});
	}

	emitLeaveRoom() {
		this.socket!.emit('LEAVE_ROOM', {
			type: 'LEAVE_ROOM',
			data: { roomId: this.roomId },
		});
	}

	emitDissolveRoom() {
		this.socket?.emit('DISSOLVE_ROOM', {
			type: 'DISSOLVE_ROOM',
			data: { roomId: this.roomId },
		});
		this.clear();
	}

	emitStartGame() {
		this.socket!.emit('START_GAME', {
			type: 'START_GAME',
			data: { roomId: this.roomId, initConfig: MultiPlay.getConfig() },
		});
	}

	emitUpdateState() {
		this.socket!.emit('UPDATE_STATE', {
			type: 'UPDATE_STATE',
			data: {
				roomId: this.roomId,
				info: this.logs as iBlockLog[],
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
		return (({ seed, cloudSeed, treeSeed, weather, state, log }) => arguments)(config) as unknown as iInitConfig;
	}
}

export default MultiPlay;

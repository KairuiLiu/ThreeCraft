import { io, Socket } from 'socket.io-client';
import { BlockLog } from '../../utils/types/block';
import { Controller } from '..';
import type { ClientToServerEvents, ServerToClientEvents } from '../../utils/types/multiPlayer/server';

class MultiPlayer {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	logs: BlockLog[];

	controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
		this.logs = [];
	}

	init(onConnect, address = '/socket') {
		this.socket = io(address);
		this.socket.on('connect', onConnect);
		this.socket.on('disconnect', () => {
			console.log('ok');
		});
		this.socket.on('START_GAME', res => {
			const { message, data } = res;
		});
	}

	insertLog(logs) {
		this.logs.push(...logs);
	}

	applyLog(logs) {
		this.controller.gameController.blockController.update(logs);
	}
}

export default MultiPlayer;

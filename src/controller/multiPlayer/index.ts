import { io, Socket } from 'socket.io-client';
import { BlockLog } from '../../utils/types/block';
import { Controller } from '..';
import type { ClientToServerEvents, ServerToClientEvents } from '../../utils/types/server';

class MultiPlayer {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;

	logs: BlockLog[];

	controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
		this.socket = io();
		this.init();
		this.logs = [];
	}

	connect(address = '/socket') {
		this.socket.connect();
	}

	init() {
		this.socket.on('connect', () => {
			console.log('connected!');
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

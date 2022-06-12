import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import controllers from './controller';
import type { ControllerKeys, ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './types/server.d.ts';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
	serveClient: false,
});

io.on('connection', socket => {
	Object.keys(controllers).forEach(key => {
		socket.on(key as string, async args => {
			const { type, data } = args;
			const res = await controllers[type](data, socket, io);
			if (res) socket.emit(res.type, res);
		});
	});
});

httpServer.listen(3000);

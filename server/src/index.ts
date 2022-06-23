import os from 'os';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import controllers from './controller/index.js';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
	serveClient: false,
	cors: {
		origin: '*',
		credentials: true,
	},
});

io.on('connection', socket => {
	Object.keys(controllers).forEach(key => {
		socket.on(key, async args => {
			const { type, data } = args;
			const res = await controllers[type as ControllerKeys](data, socket, io);
			if (res) socket.emit(res.type, res);
		});
		socket.on('disconnect', async () => {
			const res = await controllers.LEAVE_ROOM({}, socket, io);
			if (res) socket.emit(res.type, res);
		});
	});
});

(() => {
	const interfaces = os.networkInterfaces();
	for (const devName in interfaces) {
		const iface = interfaces[devName];
		for (let i = 0; i < iface!.length; i++) {
			const alias = iface![i];
			if (alias.address !== '127.0.0.1' && !alias.internal) {
				console.log(`ThreeCraft v1.0.0 game server running at:\n> Local:\thttp://localhost:9000\n> Network:\thttp://${alias.address}:9000\n`);
				console.log(`\x1b[40m\x1b[31mYOU MUST ENTER THE ADDRESS LIKE http://${alias.address}:9000 IN GAME, NO PART CAN BE OMITTED!\x1b[0m`);
				return;
			}
		}
	}
})();

httpServer.listen(9000);

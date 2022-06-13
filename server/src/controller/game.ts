import { Server } from 'socket.io';
import { roomCollisions } from './room.js';

function gameStart(room: iRoomInfo, initConfig: iInitConfig, io: Server) {
	room.status = 'GAMING';
	io.sockets.in(room.roomId).emit('START_GAME', { config: initConfig });
}

function logPush(room: iRoomInfo, userInfo: iUserInfo, log: iBlockLog[], io: Server) {
	io.sockets.in(room.roomId).emit('LOG_UPDATE', {
		userName: userInfo.name,
		log,
	});
}

const gameControllers: Controllers<ClientGameKeys, SocketType, ServerType> = {
	START_GAME: async (data, sc, io) => {
		const { roomId, initConfig } = data;
		const userId = sc.id;
		if (!roomCollisions.has(roomId) || roomCollisions.get(roomId)?.owner?.id !== userId || !initConfig)
			return {
				message: 'PERMISSION_DENIED',
				data: null,
				type: 'RES_START_GAME',
			};
		const room = roomCollisions.get(roomId)!;
		gameStart(room, initConfig, io);
		return {
			data: null,
			type: 'RES_START_GAME',
		};
	},
	UPDATE_STATE: async (data, sc, io) => {
		const { roomId, info } = data;
		const userId = sc.id;
		if (!roomCollisions.has(roomId) || !roomCollisions.get(roomId)?.players.has(userId))
			return {
				message: '房间不存在',
				data: null,
				type: 'RES_START_GAME',
			};
		const room = roomCollisions.get(roomId) as iRoomInfo;
		logPush(room, room.players.get(userId) as iUserInfo, info, io);
		return {
			data: null,
			type: 'RES_UPDATE_STATE',
		};
	},
};

export default gameControllers;

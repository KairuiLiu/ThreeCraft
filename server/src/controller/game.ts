import { Server } from 'socket.io';
import { roomCollisions } from './room';

function gameStart(room: iRoomInfo, initConfig: iInitConfig, io: Server) {
	room.status = 'GAMING';
	io.sockets.in(room.roomCode).emit('GAME_START', { info: initConfig });
}

function logPush(room: iRoomInfo, userInfo: iUserInfo, log: iBlockLog[], io: Server) {
	io.sockets.in(room.roomCode).emit('GAME_START', {
		userName: userInfo.name,
		log,
	});
}

const gameControllers: Controllers<ClientGameKeys, SocketType, ServerType> = {
	START_GAME: async (data, _, io) => {
		const { roomCode, userId, initConfig } = data;
		if (!roomCollisions.has(roomCode) || roomCollisions.get(roomCode)?.owner?.id !== userId || !initConfig)
			return {
				message: '房间不存在',
				data: null,
				type: 'RES_START_GAME',
			};
		const room = roomCollisions.get(roomCode) as iRoomInfo;
		// emit 开始游戏消息
		gameStart(room, initConfig, io);
		return {
			data: null,
			type: 'RES_START_GAME',
		};
	},
	UPDATE_STATE: async (data, _, io) => {
		const { roomCode, userId, info } = data;
		if (!roomCollisions.has(roomCode) || roomCollisions.get(roomCode)?.players.find(d => d.id === userId) === null)
			return {
				message: '房间不存在',
				data: null,
				type: 'RES_START_GAME',
			};
		const room = roomCollisions.get(roomCode) as iRoomInfo;
		logPush(room, roomCollisions.get(roomCode)?.players.find(d => d.id === userId) as iUserInfo, info, io);
		return {
			data: null,
			type: 'RES_UPDATE_STATE',
		};
	},
};

export default gameControllers;

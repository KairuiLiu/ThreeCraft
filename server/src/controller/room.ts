import { Server } from 'socket.io';
import { tryJoinRoom } from './user.js';

export const roomCollisions: Map<string, iRoomInfo> = new Map();

function createRoom(id: string, name: string) {
	let roomId;
	do {
		roomId = Math.random().toString(36).slice(-8).toUpperCase();
	} while (roomCollisions.has(roomId));
	const owner = { id, name };
	const room = {
		roomId,
		owner,
		players: new Map([[id, owner]]),
		status: 'WAITING',
	};
	roomCollisions.set(room.roomId, room as iRoomInfo);
	return room;
}

function dissolveRoom(roomId: string, io: Server) {
	io.sockets.in(roomId).emit('ROOM_DISSOLVE', null);
	roomCollisions.delete(roomId);
}

function updateUserInfo(room: iRoomInfo, name: string, action: string, io: Server) {
	io.sockets.in(room.roomId).emit('PLAYER_CHANGE', { userName: name, action });
}

const roomControllers: Controllers<ClientRoomKeys, SocketType, ServerType> = {
	CREATE_ROOM: async (data, sc) => {
		const { userName } = data;
		const room = createRoom(sc.id, userName) as iRoomInfo;
		// 创建频道
		sc.join(room.roomId);
		return {
			message: 'CREATE_ROOM_SUCCESS',
			data: { roomInfo: room },
			type: 'RES_CREATE_ROOM',
		};
	},
	JOIN_ROOM: async (data, sc, io) => {
		const { roomId, userName } = data;
		const { id } = sc;
		const room = roomCollisions.get(roomId);
		if (!room || !tryJoinRoom(id, userName, room))
			return {
				message: 'JOIN_FAILED',
				data: null,
				type: 'RES_JOIN_ROOM',
			};
		sc.join(room.roomId);
		updateUserInfo(room, userName, 'join', io);
		return {
			message: 'JOIN_SUCCESS',
			data: room,
			type: 'RES_JOIN_ROOM',
		};
	},
	LEAVE_ROOM: async (data, sc, io) => {
		const { roomId } = data;
		const room = roomCollisions.get(roomId);
		if (room && room.players.has(sc.id)) {
			const { name } = room.players.get(sc.id)!;
			room.players.delete(sc.id);
			sc.leave(roomId);
			if (room?.owner?.id === sc.id || room.players.size === 1) dissolveRoom(roomId, io);
			else updateUserInfo(room, name, 'leave', io);
			return {
				message: 'LEAVE_SUCCESS',
				data: null,
				type: 'RES_LEAVE_ROOM',
			};
		}
		return {
			message: 'ROOM_NOT_FOUND',
			data: null,
			type: 'RES_LEAVE_ROOM',
		};
	},
	DISSOLVE_ROOM: async (data, sc, io) => {
		const { roomId } = data;
		const room = roomCollisions.get(roomId);
		if (room?.owner?.id === sc.id) {
			dissolveRoom(roomId, io);
			io.socketsLeave(roomId);
			return {
				message: 'ROOM_DISSOLVED',
				data: null,
				type: 'RES_DISSOLVE_ROOM',
			};
		}
		return {
			message: 'PERMISSION_DENIED',
			data: null,
			type: 'RES_DISSOLVE_ROOM',
		};
	},
};

export default roomControllers;

import { Server } from 'socket.io';
import { tryJoinRoom } from './user';

export const roomCollisions: Map<string, iRoomInfo> = new Map();

function createRoom(roomInfo: iRoomInfo, userInfo: iUserInfo) {
	const room = {
		roomId: '123',
		roomName: roomInfo.roomName,
		owner: userInfo,
		roomCode: roomInfo.roomCode,
		players: [userInfo],
		status: 'WAITING',
	};
	roomCollisions.set(room.roomId, room as iRoomInfo);
	return room;
}

function dissolveRoom(room: iRoomInfo, io: Server) {
	roomCollisions.delete(room.roomCode);
	io.sockets.in(room.roomCode).emit('ROOM_DISSOLVE', null);
}

function updateUserInfo(room: iRoomInfo, userInfo: iUserInfo, action: string, io: Server) {
	io.sockets.in(room.roomCode).emit('UPDATE_USER', { userName: userInfo.name, action });
}

const roomControllers: Controllers<ClientRoomKeys, SocketType, ServerType> = {
	CREATE_ROOM: async (data, sc) => {
		const { userName, roomInfo } = data;
		const room = createRoom(roomInfo, userName) as iRoomInfo;
		// 创建频道
		sc.join(room.roomId);
		return {
			message: '房间创建成功',
			data: room,
			type: 'RES_CREATE_ROOM',
		};
	},
	JOIN_ROOM: async (data, sc, io) => {
		const { roomCode, userInfo } = data;
		const room = roomCollisions.get(roomCode);
		if (!room || room.status !== 'WAITING' || !tryJoinRoom(userInfo, room))
			return {
				message: '加入房间失败',
				data: null,
				type: 'RES_JOIN_ROOM',
			};
		sc.join(room.roomCode);
		updateUserInfo(room, userInfo, 'join', io);
		return {
			message: '加入房间成功',
			data: room,
			type: 'RES_JOIN_ROOM',
		};
	},
	LEAVE_ROOM: async (data, sc, io) => {
		const { roomCode, userInfo } = data;
		const room = roomCollisions.get(roomCode);
		if (room) {
			const idx = room.players.findIndex(d => d.id === userInfo.id);
			room.players.splice(idx, 1);
			sc.leave(roomCode);
			if (room?.owner?.id === userInfo.id || room.players.length === 1) dissolveRoom(room, io);
			else updateUserInfo(room, userInfo, 'leave', io);
			return {
				message: '您已离开房间',
				data: null,
				type: 'RES_LEAVE_ROOM',
			};
		}
		return {
			message: '房间不存在',
			data: null,
			type: 'RES_LEAVE_ROOM',
		};
	},
	DISSOLVE_ROOM: async (data, _, io) => {
		const { roomCode, userInfo } = data;
		const room = roomCollisions.get(roomCode);
		if (room?.owner?.id === userInfo.id) {
			dissolveRoom(room as iRoomInfo, io);
			io.socketsLeave(roomCode);
			return {
				message: '房间已解散',
				data: null,
				type: 'RES_DISSOLVE_ROOM',
			};
		}
		return {
			message: '您不是房主, 无法解散',
			data: null,
			type: 'RES_DISSOLVE_ROOM',
		};
	},
};

export default roomControllers;

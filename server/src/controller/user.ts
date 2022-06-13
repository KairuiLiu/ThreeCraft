export function tryJoinRoom(id: string, name: string, room: iRoomInfo) {
	if (room.status === 'WAITING' && [...room.players].findIndex(d => d[1].name === name)) return false;
	room.players.set(id, { id, name });
	return true;
}

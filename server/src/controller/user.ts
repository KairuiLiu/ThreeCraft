export function tryJoinRoom(userinfo: iUserInfo, room: iRoomInfo) {
	const { name } = userinfo;
	if (room.players.find(d => d.name === name)) return false;
	room.players.push(userinfo);
	return true;
}

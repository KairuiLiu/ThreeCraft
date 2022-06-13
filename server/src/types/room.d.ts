declare type iRoomInfo = {
	roomId: string;
	roomName: string;
	owner: iUserInfo | null;
	roomCode: string;
	players: iUserInfo[];
	status: 'WAITING' | 'GAMING' | 'END';
};

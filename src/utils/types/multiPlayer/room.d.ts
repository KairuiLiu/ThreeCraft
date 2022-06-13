declare type iRoomInfo = {
	roomId: string;
	players: Map<string, iUserInfo>;
	owner: iUserInfo | null;
	status: 'WAITING' | 'GAMING' | 'END';
};

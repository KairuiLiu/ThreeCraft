declare type iRoomInfo = {
	roomId: string;
	players: Map<string, iUserInfo>;
	owner: iUserInfo | null;
	status: 'WAITING' | 'GAMING' | 'END';
};

declare type iRoomInfoTrans = {
	roomId: string;
	players: string[];
	owner: iUserInfo | null;
	status: 'WAITING' | 'GAMING' | 'END';
};

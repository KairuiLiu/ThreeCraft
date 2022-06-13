declare interface ClientDataType<T, D> {
	type: T;
	data: D;
	message?: string;
}

declare interface ServerDataType<T, D> {
	type: T;
	data: D;
	message?: string;
}

declare type ServerEventListenersCb<T, D> = (args: ServerDataType<T, D>) => void;
declare type ClientEventListenersCb<T, D> = (args: ClientDataType<T, D>) => void;

export declare interface ClientToServerEvents {
	CREATE_ROOM: ClientEventListenersCb<
		'CREATE_ROOM',
		{
			userName: string;
			roomInfo: iRoomInfo;
		}
	>;
	JOIN_ROOM: ClientEventListenersCb<
		'JOIN_ROOM',
		{
			roomCode: string;
			userInfo: UserInfo;
		}
	>;
	LEAVE_ROOM: ClientEventListenersCb<
		'LEAVE_ROOM',
		{
			roomCode: string;
			userInfo: UserInfo;
		}
	>;
	DISSOLVE_ROOM: ClientEventListenersCb<
		'DISSOLVE_ROOM',
		{
			roomCode: string;
			userInfo: UserInfo;
		}
	>;
	START_GAME: ClientEventListenersCb<
		'START_GAME',
		{
			roomCode: string;
			userId: string;
			initConfig: iInitConfig;
		}
	>;
	UPDATE_STATE: ClientEventListenersCb<
		'UPDATE_STATE',
		{
			roomCode: string;
			userId: string;
			info: iBlockLog[];
		}
	>;
}

export declare interface ServerToClientEvents {
	RES_CREATE_ROOM: ServerEventListenersCb<'RES_CREATE_ROOM', RoomInfo>;
	RES_JOIN_ROOM: ServerEventListenersCb<'RES_JOIN_ROOM', { roomInfo: iRoomInfo }>;
	RES_LEAVE_ROOM: ServerEventListenersCb<'RES_LEAVE_ROOM', null>;
	RES_DISSOLVE_ROOM: ServerEventListenersCb<'RES_DISSOLVE_ROOM', null>;
	RES_START_GAME: ServerEventListenersCb<'START_GAME', null>;
	RES_GAME_END: ServerEventListenersCb<'GAME_END', null>;
	RES_UPDATE_STATE: ServerEventListenersCb<'STATE_UPDATE', null>;
}

type ClientKeys = keyof ClientToServerEvents;
type ServerKeys = keyof ServerToClientEvents;

declare type ClientRoomKeys = 'CREATE_ROOM' | 'JOIN_ROOM' | 'LEAVE_ROOM' | 'DISSOLVE_ROOM';
declare type ClientGameKeys = 'START_GAME' | 'UPDATE_STATE';

declare type ControllerKeys = ClientRoomKeys | ClientGameKeys;

declare type Controllers<T extends keyof EToD, S, I> = {
	[K in T]: (
		args: K extends keyof ClientToServerEvents ? GetDataTypeOfEventName<K> : unknown,
		sc: S,
		io: I
	) => Promise<addRESPrefix<K> extends keyof ClientToServerEvents ? ServerDataType<addRESPrefix<K>, GetDataTypeOfEventName<addRESPrefix<K>>> : void>;
};

// eslint-disable-next-line
declare interface InterServerEvents {}
declare type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;
declare type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;

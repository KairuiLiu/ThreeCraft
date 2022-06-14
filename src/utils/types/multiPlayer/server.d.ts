import './user';
import './room';
import './info';
import { Socket } from 'socket.io-client';

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
		}
	>;
	JOIN_ROOM: ClientEventListenersCb<
		'JOIN_ROOM',
		{
			roomId: string;
			userName: string;
		}
	>;
	LEAVE_ROOM: ClientEventListenersCb<
		'LEAVE_ROOM',
		{
			roomId: string;
		}
	>;
	DISSOLVE_ROOM: ClientEventListenersCb<
		'DISSOLVE_ROOM',
		{
			roomId: string;
		}
	>;
	START_GAME: ClientEventListenersCb<
		'START_GAME',
		{
			roomId: string;
			initConfig: iInitConfig;
		}
	>;
	UPDATE_STATE: ClientEventListenersCb<
		'UPDATE_STATE',
		{
			roomId: string;
			info: iBlockLog[];
			position: iPositionLog;
		}
	>;
}

export declare interface ServerToClientEvents {
	RES_CREATE_ROOM: ServerEventListenersCb<'RES_CREATE_ROOM', { roomInfo: iRoomInfo }>;
	RES_JOIN_ROOM: ServerEventListenersCb<'RES_JOIN_ROOM', { roomInfo: iRoomInfo }>;
	RES_LEAVE_ROOM: ServerEventListenersCb<'RES_LEAVE_ROOM', null>;
	RES_DISSOLVE_ROOM: ServerEventListenersCb<'RES_DISSOLVE_ROOM', null>;
	RES_START_GAME: ServerEventListenersCb<'START_GAME', null>;
	RES_UPDATE_STATE: ServerEventListenersCb<'STATE_UPDATE', null>;

	PLAYER_CHANGE: ServerEventListenersCb<'PLAYER_CHANGE', { userName: string; action: string }>;
	LOG_UPDATE: ServerEventListenersCb<
		'LOG_UPDATE',
		{
			userName: string;
			log: iBlockLog[];
			position: iPositionLog;
		}
	>;
	ROOM_DISSOLVE: ServerEventListenersCb<'ROOM_DISSOLVE', null>;
	START_GAME: ServerEventListenersCb<'START_GAME', { config: iInitConfig }>;
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
declare type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;

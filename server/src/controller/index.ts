import gameControllers from './game.js';
import roomControllers from './room.js';

const controllers: Controllers<ControllerKeys, SocketType, ServerType> = {
	...roomControllers,
	...gameControllers,
};

export default controllers;

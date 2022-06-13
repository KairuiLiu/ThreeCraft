import gameControllers from './game';
import roomControllers from './room';

const controllers: Controllers<ControllerKeys, SocketType, ServerType> = {
	...roomControllers,
	...gameControllers,
};

export default controllers;

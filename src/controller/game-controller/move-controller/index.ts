import Core from '../../../core';

class MoveController {
	core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	move(arg) {
		console.log('move', arg);
		this;
	}
}

export default MoveController;

import Core from '../../../core';

class MoveController {
	core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	positionMove(arg) {
		console.log('pos move', arg);
		this;
	}

	viewDirectionMove(arg) {
		console.log('view move', arg);
		this;
	}
}

export default MoveController;

import Core from '../../../core';
import { Block } from '../index';

class BlockController {
	core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	update(blocks: Block[]) {
		// console.log('Controller>gameController>blockController>update', blocks);
		this;
	}
}

export default BlockController;

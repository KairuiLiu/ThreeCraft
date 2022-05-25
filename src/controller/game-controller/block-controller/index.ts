import Core from '../../../core';
import { Block } from '../index';

class BlockController {
	core: Core;

	constructor(core: Core) {
		this.core = core;
	}

	update(blocks: Block[]) {
		// console.log('Controller>gameController>blockController>update', blocks);

		// TODO 记录位置
		this;
	}
}

export default BlockController;

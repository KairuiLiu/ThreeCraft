import Core from '../../core';
import BlockController from './block-controller';
import MoveController from './move-controller';

class GameController {
	core: Core;

	blockController: BlockController; // ! 这个对象是直接和WebGL打交道的

	moveController: MoveController; // ! 这个对象是直接和WebGL打交道的

	constructor(core: Core) {
		this.core = core;
		this.blockController = new BlockController(this.core);
		this.moveController = new MoveController(this.core);
	}
}

export default GameController;

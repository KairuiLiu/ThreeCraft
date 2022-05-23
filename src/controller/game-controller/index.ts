import Core from '../../core';
import BlockController from './block-controller';
import MoveController from './move-controller';
import { collisionCheck } from '../../utils/collision';
import { config } from '../config';

// eslint-disable-next-line
enum actionBlockEvent {
	ADD,
	REMOVE,
}

class GameController {
	core: Core;

	blockController: BlockController; // ! 这个对象是直接和WebGL打交道的

	moveController: MoveController; // ! 这个对象是直接和WebGL打交道的

	constructor(core: Core) {
		this.core = core;
		this.blockController = new BlockController(this.core);
		this.moveController = new MoveController(this.core);
	}

	// TODO
	handleMoveAction({ font, left, up }) {
		if (!config.controller.cheat && up !== 0 && config.state.jumping) {
			up = 0;
		}
		const collision = collisionCheck({
			posX: config.state.posX,
			posY: config.state.posY,
			posZ: config.state.posZ,
			dirX: font,
			dirY: left,
			dirZ: up,
			gl: this.core,
		});
		if (!collision)
			this.moveController.positionMove({
				font,
				left,
				up,
			});
	}

	handleBlockAction(key: actionBlockEvent) {
		this;
		console.log('block', key);
	}

	handleViewAction({ vertical, horizontal }) {
		this.moveController.viewDirectionMove({ vertical, horizontal });
	}
}

export { GameController, actionBlockEvent };

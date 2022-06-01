import Core from '../../core';
import BlockController from './block-controller';
import MoveController from './move-controller';
import { config } from '../config';
import { relativeCollisionCheck } from '../../core/collision';

// eslint-disable-next-line
enum actionBlockEvent {
	ADD,
	REMOVE,
}

interface Block {
	type: string | null;
	posX: number;
	posY: number;
	posZ: number;
	action: actionBlockEvent;
}

class GameController {
	core: Core;

	blockController: BlockController; // ! 这个对象是直接和WebGL打交道的

	moveController: MoveController; // ! 这个对象是直接和WebGL打交道的

	nextTrickMoveTask: {
		font: number;
		left: number;
		up: number;
	};

	nextTrickViewTask: {
		viewHorizontal: number;
		viewVertical: number;
	};

	nextTrickBlockTask: Block[];

	constructor(core: Core) {
		this.core = core;
		this.blockController = new BlockController(this.core);
		this.moveController = new MoveController(this.core);
		this.nextTrickBlockTask = [];
		this.nextTrickMoveTask = {
			font: 0,
			left: 0,
			up: 0,
		};
		this.nextTrickViewTask = {
			viewHorizontal: 0,
			viewVertical: 0,
		};
	}

	// 请求将状态设置为X
	handleMoveAction(args) {
		this.nextTrickMoveTask = {
			...this.nextTrickMoveTask,
			...args,
		};
	}

	handleViewAction({ vertical, horizontal }) {
		this.nextTrickViewTask.viewHorizontal += horizontal;
		this.nextTrickViewTask.viewVertical += vertical;
	}

	handleBlockAction(key: actionBlockEvent) {
		// TODO FIX
		return;
		const collision = relativeCollisionCheck({
			posX: this.core.camera.position.x,
			posY: this.core.camera.position.y,
			posZ: this.core.camera.position.z,
			font: config.controller.opRange,
			left: 0,
			up: 0,
			core: this.core,
		});
		if (collision === null) return;

		// TODO IMPROVE get target block
		// if (key === actionBlockEvent.ADD) {
		// 	target.targetBlock.x += target.targetSideNorm.x;
		// 	target.targetBlock.y += target.targetSideNorm.y;
		// 	target.targetBlock.z += target.targetSideNorm.z;
		// 	if (
		// 		hasBlockCheck({
		// 			posX: target.targetBlock.x,
		// 			posY: target.targetBlock.y,
		// 			posZ: target.targetBlock.z,
		// 		})
		// 	)
		// 		return false;
		// 	this.nextTrickBlockTask.push({
		// 		type: config.bag.bagItem[config.bag.activeIndex],
		// 		action: actionBlockEvent.ADD,
		// 		posX: target.targetBlock.x,
		// 		posY: target.targetBlock.y,
		// 		posZ: target.targetBlock.z,
		// 	});
		// } else {
		// 	// TODO 增加特判(打洞)
		// 	this.nextTrickBlockTask.push({
		// 		type: null,
		// 		action: actionBlockEvent.REMOVE,
		// 		posX: target.targetBlock.x,
		// 		posY: target.targetBlock.y,
		// 		posZ: target.targetBlock.z,
		// 	});
		// }

		if (key === actionBlockEvent.ADD) {
			this.core.blockAction.addBlock(collision.obj.object.position.add(collision.obj.face.normal.multiplyScalar(10)));
		} else {
			this.core.blockAction.removeBlock(collision.obj);
		}
	}

	update() {
		this.moveController.viewDirectionMove(this.nextTrickViewTask);
		this.moveController.positionMove(this.nextTrickMoveTask);
		this.nextTrickViewTask = { viewHorizontal: 0, viewVertical: 0 };
		this.blockController.update(this.nextTrickBlockTask);
		this.nextTrickBlockTask.length = 0;
		this.blockController.highlightCurrentBlock();
	}
}

export { GameController, actionBlockEvent, Block };

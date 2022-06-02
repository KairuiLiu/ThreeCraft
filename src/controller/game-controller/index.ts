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

// 块修改事件
interface Block {
	type: string | null;
	posX: number;
	posY: number;
	posZ: number;
	action: actionBlockEvent;
}

class GameController {
	core: Core;

	// 块操作控制器, 直接操作Scene中块的CRUD
	blockController: BlockController;

	// 运动控制器, 直接修改Camera的状态
	moveController: MoveController; // ! 这个对象是直接和WebGL打交道的

	// 下一帧需要运动的相对方向记录
	nextTrickMoveTask: {
		font: number;
		left: number;
		up: number;
	};

	// 下一帧相机需要运动方向记录
	nextTrickViewTask: {
		viewHorizontal: number;
		viewVertical: number;
	};

	// 下一帧有哪些块要修改
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

	// 请求将相对运动状态设置为{...args}
	handleMoveAction(args) {
		this.nextTrickMoveTask = {
			...this.nextTrickMoveTask,
			...args,
		};
	}

	// 请求移动相机角度
	handleViewAction({ vertical, horizontal }) {
		this.nextTrickViewTask.viewHorizontal += horizontal;
		this.nextTrickViewTask.viewVertical += vertical;
	}

	// 请求块操作
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

	// 当下一帧渲染时执行请求, 并重设状态
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

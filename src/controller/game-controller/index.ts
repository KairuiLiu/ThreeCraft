import { blockTypes } from '../../core/loader/index';
import Core from '../../core';
import BlockController from './block-controller';
import MoveController from './move-controller';
import { config } from '../config';
import { relativeOperateCollisionCheck } from '../../core/collision';
import { Controller } from '..';
import { actionBlockEvent, BlockLog } from '../../utils/types/block';
import weatherType from '../../core/weather';

class GameController {
	core: Core;

	// 块操作控制器, 直接操作Scene中块的CRUD
	blockController: BlockController;

	// 运动控制器, 直接修改Camera的状态
	moveController: MoveController; // ! 这个对象是直接和WebGL打交道的

	host: Controller;

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
	nextTrickBlockTask: BlockLog[];

	constructor(core: Core, host) {
		this.core = core;
		this.host = host;
		this.blockController = new BlockController(this.core, this);
		this.moveController = new MoveController(this.core, this);
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
		const collision = relativeOperateCollisionCheck({
			posX: this.core.camera.position.x,
			posY: this.core.camera.position.y,
			posZ: this.core.camera.position.z,
			font: config.controller.opRange,
			left: 0,
			up: 0,
			core: this.core,
			log: this.blockController.host.host.log,
			access: false,
		});
		if (collision === null) return;

		let { posX, posY, posZ } = collision.pos;
		[posX, posY, posZ] = [posX, posY, posZ].map(Math.round);

		const target: BlockLog = {
			posX,
			posY,
			posZ,
			type: null,
			action: actionBlockEvent.REMOVE,
		};
		if (key === actionBlockEvent.ADD) {
			target.posX += collision.obj.face.normal.x;
			target.posY += collision.obj.face.normal.y;
			target.posZ += collision.obj.face.normal.z;
			target.type = blockTypes[config.bag.bagItem[config.bag.activeIndex]];
			target.action = actionBlockEvent.ADD;
		} else this.checkRemoveFloor(target);
		this.host.log.insert(target);
		this.nextTrickBlockTask.push(target);
	}

	// 当下一帧渲染时执行请求, 并重设状态
	update() {
		this.moveController.viewDirectionMove(this.nextTrickViewTask);
		this.moveController.positionMove(this.nextTrickMoveTask);
		this.nextTrickViewTask = { viewHorizontal: 0, viewVertical: 0 };
		this.blockController.update(this.nextTrickBlockTask);
		this.blockController.highlightCurrentBlock();
		this.nextTrickBlockTask.length = 0;
	}

	checkRemoveFloor(target) {
		const floorHeight = this.core.terrain.getFloorHeight(target.posX, target.posZ);
		if (floorHeight >= target.posY) {
			this.testAndInsert({ ...target, posY: target.posY - 1 });
		}
		if (floorHeight > target.posY) {
			this.testAndInsert({ ...target, posZ: target.posZ + 1 });
			this.testAndInsert({ ...target, posZ: target.posZ - 1 });
			this.testAndInsert({ ...target, posX: target.posX + 1 });
			this.testAndInsert({ ...target, posX: target.posX - 1 });
		}
		if (floorHeight > target.posY + 1) {
			this.testAndInsert({ ...target, posY: target.posY + 1 });
		}
	}

	testAndInsert(target) {
		// 是被用户手动挖开的/有块 / 那么什么都不做, 否则加块
		if (this.host.log.query(target.posX, target.posZ, target.posY) || this.core.terrain.hasBlock(target.posX, target.posZ, target.posY)) return;
		this.host.log.insert({ ...target, type: blockTypes[weatherType[config.weather][2]] });
		this.nextTrickBlockTask.push({ ...target, type: blockTypes[weatherType[config.weather][2]] });
	}
}

export { GameController, actionBlockEvent };

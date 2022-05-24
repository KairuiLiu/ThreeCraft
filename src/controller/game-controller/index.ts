import Core from '../../core';
import BlockController from './block-controller';
import MoveController from './move-controller';
import { collisionCheck } from '../../utils/collision';
import { hasBlockCheck } from '../../utils/hasBlock';
import { config } from '../config';

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

	lastMove: {
		haveChange: boolean;
		font: number;
		left: number;
		up: number;
	};

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
		this.lastMove = {
			haveChange: false,
			font: 0,
			left: 0,
			up: 0,
		};
	}

	handleMoveAction({ font, left, up }) {
		if (!config.controller.cheat && up !== 0 && config.state.jumping) {
			up = 0;
		}
		if (!config.controller.cheat && up < 0) {
			up = 0;
		}
		this.nextTrickMoveTask.font += font;
		this.nextTrickMoveTask.left += left;
		this.nextTrickMoveTask.up += up;
		this.lastMove.haveChange = true;
		this.lastMove = {
			haveChange: true,
			font,
			left,
			up,
		};
	}

	handleViewAction({ vertical, horizontal }) {
		this.nextTrickViewTask.viewHorizontal += horizontal;
		this.nextTrickViewTask.viewVertical += vertical;
	}

	handleBlockAction(key: actionBlockEvent) {
		const target = {
			targetBlock: { x: 1, y: 2, z: 3 },
			targetSideNorm: { x: 1, y: 2, z: 3 },
		};
		// TODO get target block
		if (!target) return false;
		if (key === actionBlockEvent.ADD) {
			target.targetBlock.x += target.targetSideNorm.x;
			target.targetBlock.y += target.targetSideNorm.y;
			target.targetBlock.z += target.targetSideNorm.z;
			if (
				hasBlockCheck({
					posX: target.targetBlock.x,
					posY: target.targetBlock.y,
					posZ: target.targetBlock.z,
				})
			)
				return false;
			this.nextTrickBlockTask.push({
				type: config.bag.bagItem[config.bag.activeIndex],
				action: actionBlockEvent.ADD,
				posX: target.targetBlock.x,
				posY: target.targetBlock.y,
				posZ: target.targetBlock.z,
			});
		} else {
			// TODO 增加特判(打洞)
			this.nextTrickBlockTask.push({
				type: null,
				action: actionBlockEvent.REMOVE,
				posX: target.targetBlock.x,
				posY: target.targetBlock.y,
				posZ: target.targetBlock.z,
			});
		}
		return true;
	}

	update() {
		if (config.controller.operation === 'mobile' && !this.lastMove.haveChange) {
			this.nextTrickMoveTask = { ...this.lastMove };
		}
		// TODO camear.lookat + config.position + this.nextTrackMove => nextPosition
		const nextPosition = {
			posX: config.state.posX,
			posY: config.state.posY,
			posZ: config.state.posZ,
		};
		if (!collisionCheck({ ...nextPosition, core: this.core })) {
			this.moveController.positionMove(this.nextTrickMoveTask);
		}
		this.moveController.viewDirectionMove(this.nextTrickViewTask);
		this.blockController.update(this.nextTrickBlockTask);
		this.nextTrickBlockTask.length = 0;
		this.nextTrickMoveTask = { font: 0, left: 0, up: 0 };
		this.nextTrickViewTask = { viewHorizontal: 0, viewVertical: 0 };
		// TODO record block action
		config.state = { ...config.state, ...nextPosition };
		this.lastMove.haveChange = false;
	}
}

export { GameController, actionBlockEvent, Block };

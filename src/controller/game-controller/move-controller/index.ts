import * as THREE from 'three';
import Core from '../../../core';
import { config, symConfig } from '../../config/index';
import { getTargetPosition, relativeCollisionCheckAll } from '../../../core/collision';

class MoveController {
	core: Core;

	jumping: boolean;

	jumpingSpeed: number;

	constructor(core: Core) {
		this.core = core;
		this.jumping = true;
		this.jumpingSpeed = 0;
	}

	getVerticalMove() {
		this.jumpingSpeed -= symConfig.actionsScale.g;
		return this.jumpingSpeed + symConfig.actionsScale.g / 2;
	}

	// positionMove({ font, left, up }) {
	// 	if (left === 0 && font === 0 && up === 0 && !this.jumping && this.jumpingSpeed === 0) return;
	// 	const relativeMove = new THREE.Vector3(-left, 0, -font);

	// 	// 计算水平面移动长度
	// 	if (left !== 0 || font !== 0) {
	// 		const speed = Math.sqrt(font ** 2 + left ** 2);
	// 		relativeMove.normalize(); // 获得方向向量
	// 		relativeMove.multiplyScalar(
	// 			speed * (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens
	// 		);
	// 	}

	// 	// 处理跳跃事件 增加跳跃控制
	// 	if (config.controller.cheat) relativeMove.y = up * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * symConfig.actionsScale.cheatFactor * config.controller.opSens;
	// 	else {
	// 		if (!this.jumping && up > 0) {
	// 			this.jumping = true;
	// 			this.jumpingSpeed = up * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
	// 		}
	// 		relativeMove.y = this.getVerticalMove();
	// 	}

	// 	// 如果完全没有撞击, 那么目标位置
	// 	let targetPosition = getTargetPosition({
	// 		...config.state,
	// 		font: -relativeMove.z,
	// 		left: -relativeMove.x,
	// 		up: relativeMove.y,
	// 		core: this.core,
	// 	});

	// 	// 若不再作弊模式则开启碰撞检测
	// 	if (!config.controller.cheat) {
	// 		const tmpPosition = { ...config.state };
	// 		// Y轴不能变换的XZ
	// 		const collisionOY = relativeCollisionCheckAll({
	// 			...tmpPosition,
	// 			font: 0,
	// 			left: 0,
	// 			up: relativeMove.y,
	// 			core: this.core,
	// 		});
	// 		if (collisionOY) {
	// 			if (this.jumpingSpeed < 0) this.jumping = false;
	// 			this.jumpingSpeed = 0;
	// 			tmpPosition.posY = collisionOY.pos.posY;
	// 		} else {
	// 			tmpPosition.posY = targetPosition.posY;
	// 		}

	// 		const collisionOXZ = relativeCollisionCheckAll({
	// 			...tmpPosition,
	// 			font: -relativeMove.z,
	// 			left: -relativeMove.x,
	// 			up: 0,
	// 			core: this.core,
	// 		});
	// 		if (collisionOXZ) {
	// 			tmpPosition.posX = collisionOXZ.pos.posX;
	// 			tmpPosition.posZ = collisionOXZ.pos.posZ;
	// 		} else {
	// 			tmpPosition.posX = targetPosition.posX;
	// 			tmpPosition.posZ = targetPosition.posZ;
	// 		}
	// 		targetPosition = tmpPosition;
	// 	}

	// 	this.core.camera.position.set(targetPosition.posX, targetPosition.posY, targetPosition.posZ);
	// 	config.state = { ...targetPosition };
	// }

	positionMove({ font, left, up }) {
		if (config.controller.cheat) {
			const targetPos = getTargetPosition({ ...config.state, font, left, up, core: this.core });
			this.core.camera.position.set(targetPos.posX, targetPos.posY, targetPos.posZ);
			config.state = { ...targetPos };
			return;
		}

		if (!this.jumping && up > 0) {
			this.jumping = true;
			this.jumpingSpeed = up * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
		}

		const speed = Math.sqrt(font ** 2 + left ** 2);
		const relativeMove = new THREE.Vector3(-left, 0, -font);
		relativeMove.normalize(); // 获得方向向量
		relativeMove.multiplyScalar(
			speed * (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens
		);
		relativeMove.y = this.getVerticalMove();

		const moveTargetPos = getTargetPosition({ ...config.state, font: -relativeMove.z, left: -relativeMove.x, up: relativeMove.y, core: this.core });
		// check XOZ
		const collisionXOZ = relativeCollisionCheckAll({
			...config.state,
			font: -relativeMove.z,
			left: -relativeMove.x,
			up: 0,
			core: this.core,
		});
		if (collisionXOZ) {
			config.state.posX = collisionXOZ.pos.posX;
			config.state.posZ = collisionXOZ.pos.posZ;
		} else {
			config.state.posX = moveTargetPos.posX;
			config.state.posZ = moveTargetPos.posZ;
		}

		// check OY
		const collisionOY = relativeCollisionCheckAll({
			...config.state,
			font: 0,
			left: 0,
			up: relativeMove.y,
			core: this.core,
		});
		if (collisionOY) {
			config.state.posY = collisionOY.pos.posY;
			if (relativeMove.y < 0) this.jumping = false;
			this.jumpingSpeed = 0;
		} else {
			config.state.posY = moveTargetPos.posY;
		}

		this.core.camera.position.set(config.state.posX, config.state.posY, config.state.posZ);
	}

	viewDirectionMove({ viewHorizontal, viewVertical }) {
		if (viewHorizontal === 0 && viewVertical === 0) return;
		this.core.camera.rotation.y += -viewHorizontal * symConfig.actionsScale.viewScale * config.controller.opSens;
		while (this.core.camera.rotation.y > Math.PI) this.core.camera.rotation.y -= Math.PI * 2;
		while (this.core.camera.rotation.y < -Math.PI) this.core.camera.rotation.y += Math.PI * 2;
		this.core.camera.rotation.x += viewVertical * symConfig.actionsScale.viewScale;
		this.core.camera.rotation.x = Math.max(Math.min(this.core.camera.rotation.x, Math.PI * 0.495), -Math.PI * 0.495);
		this.core.camera.updateMatrix();
	}
}

export default MoveController;

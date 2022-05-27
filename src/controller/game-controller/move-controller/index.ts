import * as THREE from 'three';
import Core from '../../../core';
import { config, symConfig } from '../../config/index';
import { collisionCheck } from '../../../utils/collision';

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
		this.jumpingSpeed -= 9.8;

		// ! 这里有一个bug, 如果这次跳的过程是先上后下, 但到顶前撞顶, 就检测不了了. 但是我不想改:(
		const collision = collisionCheck({
			...config.state,
			dirX: 0,
			dirY: 0,
			dirZ: this.jumpingSpeed + 4.8,
			core: this.core,
		});
		if (collision.check) {
			if (this.jumpingSpeed < 0) {
				this.jumping = false;
			}
			this.jumpingSpeed = 0;
			return collision.side.posZ;
		}

		return this.jumpingSpeed + 4.8;
	}

	positionMove({ font, left, up }) {
		if (left === 0 && font === 0 && up === 0 && !this.jumping && this.jumpingSpeed === 0) return;

		// 先不处理跳跃事件
		const speed = Math.sqrt(font ** 2 + left ** 2);
		const absoluteMove = new THREE.Vector3(-left, 0, -font);
		const revMat = new THREE.Matrix3();
		revMat.setFromMatrix4(this.core.camera.matrixWorld);
		absoluteMove.applyMatrix3(revMat);
		absoluteMove.y = 0;
		absoluteMove.normalize(); // 获得方向向量
		absoluteMove.multiplyScalar(
			speed * (config.controller.cheat ? symConfig.actionsScale.cheatFactor : 1) * symConfig.actionsScale.walking * symConfig.actionsScale.moveScale * config.controller.opSens
		);

		// 处理跳跃事件 增加跳跃控制
		if (config.controller.cheat) absoluteMove.y = up * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * symConfig.actionsScale.cheatFactor * config.controller.opSens;
		else {
			if (!this.jumping && up > 0) {
				this.jumping = true;
				this.jumpingSpeed = up * symConfig.actionsScale.jump * symConfig.actionsScale.moveScale * config.controller.opSens;
			}
			absoluteMove.y = this.getVerticalMove();
		}

		const nextPosition = {
			posX: config.state.posX + absoluteMove.x,
			posY: config.state.posY + absoluteMove.y,
			posZ: config.state.posZ + absoluteMove.z,
		};
		this.core.camera.position.set(nextPosition.posX, nextPosition.posY, nextPosition.posZ);
		config.state = { ...nextPosition };
	}

	viewDirectionMove({ viewHorizontal, viewVertical }) {
		if (viewHorizontal === 0 && viewVertical === 0) return;
		this.core.camera.rotation.y += -viewHorizontal * symConfig.actionsScale.viewScale * config.controller.opSens;
		while (this.core.camera.rotation.y > Math.PI) this.core.camera.rotation.y -= Math.PI * 2;
		while (this.core.camera.rotation.y < -Math.PI) this.core.camera.rotation.y += Math.PI * 2;
		this.core.camera.rotation.x += viewVertical * symConfig.actionsScale.viewScale;
		this.core.camera.rotation.x = Math.max(Math.min(this.core.camera.rotation.x, Math.PI * 0.5), -Math.PI * 0.5);
		this.core.camera.updateMatrix();
	}
}

export default MoveController;

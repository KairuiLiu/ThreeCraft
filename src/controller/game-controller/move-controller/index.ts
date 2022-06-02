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

	positionMove({ font, left, up }) {
		if (left === 0 && font === 0 && up === 0 && !this.jumping && this.jumpingSpeed === 0) return;

		if (config.controller.cheat) {
			const targetPos = getTargetPosition({ ...config.state, font, left, up, core: this.core });
			this.core.camera.position.set(targetPos.posX, targetPos.posY, targetPos.posZ);
			config.state = { ...targetPos };
			return;
		}

		if (!this.jumping && up > 0) {
			this.jumping = true;
			this.jumpingSpeed = up;
		}
		up = this.getVerticalMove();
		const targetPos = getTargetPosition({ ...config.state, font, left, up, core: this.core });

		const collisions = relativeCollisionCheckAll({
			...config.state,
			font,
			left,
			up,
			core: this.core,
		});

		if (collisions[0] === null) config.state.posX = targetPos.posX;
		if (collisions[2] === null) config.state.posZ = targetPos.posZ;
		if (collisions[1] === null) config.state.posY = targetPos.posY;
		else {
			if (this.jumpingSpeed < 0) this.jumping = false;
			this.jumpingSpeed = 0;
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

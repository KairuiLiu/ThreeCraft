import Core from '../../../core';
import { config, symConfig } from '../../config/index';
import { getTargetPosition, relativeCollisionCheckAll } from '../../../core/collision';
import { GameController } from '..';

class MoveController {
	core: Core;

	host: GameController;

	// 是否正在悬空
	jumping: boolean;

	// 向下速度
	jumpingSpeed: number;

	constructor(core: Core, host) {
		this.core = core;
		this.jumping = true;
		this.jumpingSpeed = 0;
		this.host = host;
	}

	// 获取没有阻碍物时人物应该下落距离
	getVerticalMove() {
		// v_y' = v_y - g
		this.jumpingSpeed -= symConfig.actionsScale.g;
		// x = v_y * 1 - 0.5 * g * 1 * 1 = v_y' + 0.5 * g
		return this.jumpingSpeed + symConfig.actionsScale.g / 2;
	}

	// 尝试执行注册的运动
	positionMove({ font, left, up }) {
		// 如果在作弊模式下就不进行碰撞检测, 直接设置位置
		if (config.controller.cheat) {
			const targetPos = getTargetPosition({ ...config.state, font, left, up, core: this.core });
			this.core.camera.position.set(targetPos.posX, targetPos.posY, targetPos.posZ);
			config.state = { ...targetPos };
			return;
		}
		// 如果没在跳跃, 但是请求跳跃
		if (!this.jumping && up > 0) {
			this.jumping = true;
			this.jumpingSpeed = up;
		}
		// 获取理应下降的距离
		up = this.getVerticalMove();
		// 获取没有碰撞物时理想位置
		const targetPos = getTargetPosition({ ...config.state, font, left, up, core: this.core });
		// 碰撞测试
		const collisions = relativeCollisionCheckAll({
			...config.state,
			font,
			left,
			up,
			core: this.core,
			log: this.host.host.log,
		});

		// 如果OX方向没有撞上, 就替换为理想位置, 注意: 如果撞上去了, 就不让他运动, 而不是让他运动到碰撞点, 否则会造成因浮点误差产生了相机进入方块的问题
		if (collisions[0] === null) config.state.posX = targetPos.posX;
		// 如果OZ方向没有撞上, 就替换为理想位置
		if (collisions[2] === null) config.state.posZ = targetPos.posZ;
		// 如果OY方向没有撞上, 就替换为理想位置
		if (collisions[1] === null) config.state.posY = targetPos.posY;
		else {
			// 如果撞上了, 那么不管是撞上面还是下面了, 速度都为0, 如果撞地, 那么停止跳跃
			if (this.jumpingSpeed < 0 && this.jumping === false && (left !== 0 || font !== 0)) this.core.audio.play('step', collisions[1].obj.object.name.split('_')[2], false);
			if (this.jumpingSpeed < 0) this.jumping = false;
			this.jumpingSpeed = 0;
		}
		if (collisions[0] || collisions[2]) {
			this.host.host.ui.actionControl.tryVibration(700);
		}

		this.core.camera.position.set(config.state.posX, config.state.posY, config.state.posZ);
	}

	// 修正相机角度
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

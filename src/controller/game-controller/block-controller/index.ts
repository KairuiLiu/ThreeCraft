import * as THREE from 'three';
import { highLightBlockMesh } from '../../../core/loader/index';
import { config } from '../../config';
import Core from '../../../core';
import { relativeOperateCollisionCheck } from '../../../core/collision';
import { Block } from '../index';

class BlockController {
	core: Core;

	curHighlight: THREE.Mesh | null;

	constructor(core: Core) {
		this.core = core;
		this.curHighlight = highLightBlockMesh;
		this.core.scene.add(this.curHighlight);
	}

	// 处理注册的块事件
	update(blocks: Block[]) {
		// console.log('Controller>gameController>blockController>update', blocks);

		// TODO 记录位置
		this;
	}

	// 高亮当前块
	highlightCurrentBlock() {
		const collision = relativeOperateCollisionCheck({
			posX: this.core.camera.position.x,
			posY: this.core.camera.position.y,
			posZ: this.core.camera.position.z,
			font: config.controller.opRange,
			left: 0,
			up: 0,
			core: this.core,
		});

		if (collision) {
			let { posX, posY, posZ } = collision.pos;
			[posX, posY, posZ] = [posX, posY, posZ].map(Math.round);
			this.curHighlight.position.set(posX, posY, posZ);
			this.core.scene.add(this.curHighlight);
		} else {
			this.core.scene.remove(this.curHighlight);
		}
	}
}

export default BlockController;

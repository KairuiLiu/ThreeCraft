import * as THREE from 'three';
import { highLightBlockMesh } from '../../../core/loader/index';
import { config } from '../../config';
import Core from '../../../core';
import { relativeCollisionCheck } from '../../../core/collision';
import { Block } from '../index';

class BlockController {
	core: Core;

	curHighlight: THREE.Mesh | null;

	constructor(core: Core) {
		this.core = core;
		this.curHighlight = highLightBlockMesh;
		this.core.scene.add(this.curHighlight);
	}

	update(blocks: Block[]) {
		// console.log('Controller>gameController>blockController>update', blocks);

		// TODO 记录位置
		this;
	}

	highlightCurrentBlock() {
		const collision = relativeCollisionCheck({
			posX: this.core.camera.position.x,
			posY: this.core.camera.position.y,
			posZ: this.core.camera.position.z,
			font: config.controller.opRange,
			left: 0,
			up: 0,
			core: this.core,
		});

		if (collision) {
			// let { x, y, z } = collision.obj.point;
			// x = Math.floor(x + 0.5);
			// y = Math.floor(y - 0.5);
			// z = Math.floor(z + 0.5);
			// this.curHighlight.position.set(x, y, z);
			// this.core.scene.add(this.curHighlight);
			console.log(collision);
		} else {
			// this.core.scene.remove(this.curHighlight);
		}
	}
}

export default BlockController;

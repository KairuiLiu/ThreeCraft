import { config } from '../../config';
import Core from '../../../core';
import { relativeCollisionCheck } from '../../../utils/collision';
import { Block } from '../index';

class BlockController {
	core: Core;

	curHighlight: THREE.Mesh | null;

	constructor(core: Core) {
		this.core = core;
		this.curHighlight = null;
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
		if (this.curHighlight === collision?.obj?.object) return;
		if (this.curHighlight !== null) this.core.blockAction.cancelHighLightOne(this.curHighlight);
		if (collision) this.core.blockAction.highLightOne(collision.obj.object as THREE.Mesh);
		this.curHighlight = collision ? (collision.obj.object as THREE.Mesh) : null;
	}
}

export default BlockController;

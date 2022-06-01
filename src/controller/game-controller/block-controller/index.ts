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
			this.curHighlight.visible = true;
			this.curHighlight.position.copy(collision.obj.object.position);
			this.core.scene.add(this.curHighlight);
			console.log(collision.obj.object.position);
			console.log({
				posX: this.core.camera.position.x,
				posY: this.core.camera.position.y,
				posZ: this.core.camera.position.z,
			});
		} else {
			this.curHighlight.visible = false;
		}
	}
}

export default BlockController;

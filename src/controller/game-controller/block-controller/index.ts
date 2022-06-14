import * as THREE from 'three';
import { highLightBlockMesh } from '../../../core/loader/index';
import { config } from '../../config';
import Core from '../../../core';
import { relativeOperateCollisionCheck } from '../../../core/collision';
import { BlockLog } from '../../../utils/types/block';
import { GameController } from '..';

class BlockController {
	core: Core;

	curHighlight: THREE.Mesh | null;

	host: GameController;

	constructor(core: Core, host) {
		this.core = core;
		this.host = host;
		this.curHighlight = highLightBlockMesh;
	}

	// 处理注册的块事件
	update(blocks: BlockLog[], ignoreMultiPlay = false) {
		if (this.host.host.multiPlay.working && !ignoreMultiPlay) this.host.host.multiPlay.insertLog([...blocks]);
		blocks.forEach(d => {
			if (d.type === null) this.core.blockAction.removeBlock(d);
			else this.core.blockAction.placeBlock(d);
		});
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
			log: this.host.host.log,
			access: false,
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

import * as THREE from 'three';
import { config } from '../../controller/config';
import Core from '..';
import { blockTypes } from '../loader';
import Generate from './generate';

class Terrain {
	core: Core;

	seed: number;

	generator: Generate;

	size: number;

	deltaLength: number;

	originX: number;

	originZ: number;

	constructor(core) {
		this.core = core;
		this.generator = new Generate(this);
		this.size = config.renderer.simulateDistance * 2;
		this.deltaLength = this.size * 0.1;
		this.originX = config.state.posX;
		this.originZ = config.state.posZ;
	}

	updateState({ size, deltaLength, originX, originZ }) {
		if (size !== undefined) this.size = size;
		if (deltaLength !== undefined) this.deltaLength = deltaLength;
		if (originX !== undefined) this.originX = originX;
		if (originZ !== undefined) this.originZ = originZ;
	}

	setSeed(seed) {
		this.seed = seed;
	}

	buildWorld() {
		// 灯光
		const sunLight = new THREE.PointLight(0xffffff, 0.5);
		sunLight.position.set(500, 500, 500);
		this.core.scene.add(sunLight);

		const sunLight2 = new THREE.PointLight(0xffffff, 0.2);
		sunLight2.position.set(-500, 500, -500);
		this.core.scene.add(sunLight2);

		const reflectionLight = new THREE.AmbientLight(0x404040);
		this.core.scene.add(reflectionLight);

		const geometry = new THREE.BoxGeometry();
		blockTypes.forEach((d, i) => {
			const blockInstance = new THREE.InstancedMesh(geometry, this.core.getMaterial(i), this.core.maxCount);
			blockInstance.name = d;
			this.core.blockInstances[i] = blockInstance;
			this.core.scene.add(blockInstance);
		});

		// 地形生成
		debugger;
		this.generator.generateAll(this.originX - this.size / 2, this.originZ - this.size / 2, this.originX + this.size / 2, this.originZ + this.size / 2);
	}

	tryUpdateScene() {
		// ! diff 算法有点复杂, 先全局刷新吧...
		// if (Math.abs(config.state.posZ - this.originZ) > this.deltaLength) {
		// 	if (config.state.posZ < this.originZ) {
		// 		this.generator.generateArea(this.originX - this.size / 2, this.originZ - this.size / 2, this.originX + this.size / 2, this.originZ - this.size / 2 - this.deltaLength);
		// 	} else {
		// 		this.generator.generateArea(this.originX - this.size / 2, this.originZ + this.size / 2, this.originX + this.size / 2, this.originZ + this.size / 2 + this.deltaLength);
		// 	}
		// }
		// if (Math.abs(config.state.posX - this.originX) > this.deltaLength) {
		// 	if (config.state.posX < this.originX) {
		// 		this.generator.generateArea(this.originX - this.size / 2 - this.deltaLength, this.originZ - this.size / 2, this.originX - this.size / 2, this.originZ + this.size / 2);
		// 	} else {
		// 		this.generator.generateArea(this.originX + this.size / 2 + this.deltaLength, this.originZ - this.size / 2, this.originX - this.size / 2, this.originZ + this.size / 2);
		// 	}
		// }
		let targetOriginX = this.originX;
		let targetOriginZ = this.originZ;
		let flag = false;
		if (Math.abs(config.state.posZ - this.originZ) > this.deltaLength) {
			if (config.state.posZ < this.originZ) {
				targetOriginZ -= this.deltaLength;
			} else {
				targetOriginZ += this.deltaLength;
			}
			flag = true;
		}
		if (Math.abs(config.state.posX - this.originX) > this.deltaLength) {
			if (config.state.posX < this.originX) {
				targetOriginX -= this.deltaLength;
			} else {
				targetOriginX += this.deltaLength;
			}
			flag = true;
		}
		if (flag) {
			this.generator.generateAll(targetOriginX - this.size / 2, targetOriginZ - this.size / 2, targetOriginX + this.size / 2, targetOriginZ + this.size / 2);
		}
	}

	onUpdateScene({ blocksPos, blockCnt }) {
		// TODO concat log
		// TODO write to matrix
		blockCnt.forEach((d, i) => {
			// const counts = this.core.blockTypeCounts[i];
			this.core.blockTypeCounts[i] = d;
			// this.core.blockInstances[i].count = d;
			for (let j = 0; j < d; j += 1) {
				this.core.blockInstances[i].setMatrixAt(j, blocksPos[i][j]);
			}
			// ! remove over indexed block
		});
	}

	clear() {
		while (this.core.scene.children.length) {
			this.core.scene.remove(this.core.scene.children[0]);
		}
	}
}

export default Terrain;

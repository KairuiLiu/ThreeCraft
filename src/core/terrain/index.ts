import * as THREE from 'three';
import Core from '..';
import { blockTypes } from '../loader';
import { generate } from './generate';

class Terrain {
	core: Core;

	seed: number;

	constructor(core) {
		this.core = core;
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

		const gBlocks = generate({
			stx: -500,
			sty: -500,
			edx: 500,
			edy: 500,
		});

		console.log('stGen');
		gBlocks.forEach((d, i) => {
			d.forEach(dd => {
				const matrix = new THREE.Matrix4();
				matrix.setPosition(dd.x, Math.floor(dd.y * 30), dd.z);
				this.core.blockInstances[i].setMatrixAt(this.core.blockTypeCounts[i], matrix);
				this.core.blockTypeCounts[i] += 1;
			});
		});
		console.log('edGen');
	}

	updateScene() {
		this;
	}

	build() {
		this;
	}

	remove() {
		this;
	}

	clear() {
		while (this.core.scene.children.length) {
			this.core.scene.remove(this.core.scene.children[0]);
		}
	}
}

export default Terrain;

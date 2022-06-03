import * as THREE from 'three';
import Core from '..';

class BlockAction {
	core: Core;

	constructor(core) {
		this.core = core;
	}

	highLightOne(obj: THREE.Mesh | null) {
		if (obj === null) return;
		(obj.material as THREE.Material).opacity = 0.8;
		this;
	}

	cancelHighLightOne(obj: THREE.Mesh | null) {
		if (obj === null) return;
		(obj.material as THREE.Material).opacity = 1;
		this;
	}

	removeBlock(obj) {
		this.core.scene.remove(obj);
	}

	addBlock({ x, y, z }) {
		const cube = new THREE.Mesh(
			new THREE.BoxBufferGeometry(10, 10, 10),
			new THREE.MeshBasicMaterial({
				color: 0xbbffaa,
				transparent: true,
			})
		);
		cube.position.set(x, y, z);
		this.core.scene.add(cube);
	}
}

export default BlockAction;

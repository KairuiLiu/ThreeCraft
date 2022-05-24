import * as THREE from 'three';
import Core from '..';

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

		// TODO 加载初始世界
		const axesHelper = new THREE.AxesHelper(10000);
		this.core.scene.add(axesHelper);
		const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		this.core.scene.add(cube);
		const plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0xbbffaa }));
		plane.rotation.set(0, 0.5 * Math.PI, 0);
		this.core.scene.add(plane);
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
		console.log(this.core.scene);
	}
}

export default Terrain;

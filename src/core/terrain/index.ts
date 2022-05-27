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
		// const axesHelper = new THREE.AxesHelper(1000);
		// this.core.scene.add(axesHelper);

		const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0xbbffaa, transparent: true }));
		this.core.scene.add(cube);
		const cube2 = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		cube2.position.x = 20;
		cube2.position.z = 20;
		this.core.scene.add(cube2);
		const cube3 = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		cube3.position.x = 40;
		cube3.position.z = 40;
		this.core.scene.add(cube3);

		const sphTop = new THREE.Mesh(new THREE.SphereBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		sphTop.position.y = -200;
		sphTop.position.z = -40;
		this.core.scene.add(sphTop);

		const sphBtn = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		sphBtn.position.y = 200;
		sphBtn.position.z = -40;
		this.core.scene.add(sphBtn);
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

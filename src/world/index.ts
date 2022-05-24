import * as THREE from 'three';

function addLight(core) {
	const sunLight = new THREE.PointLight(0xffffff, 0.5);
	sunLight.position.set(500, 500, 500);
	core.scene.add(sunLight);

	const sunLight2 = new THREE.PointLight(0xffffff, 0.2);
	sunLight2.position.set(-500, 500, -500);
	core.scene.add(sunLight2);

	const reflectionLight = new THREE.AmbientLight(0x404040);
	core.scene.add(reflectionLight);
}

function addTestScene(core) {
	const axesHelper = new THREE.AxesHelper(10000);
	core.scene.add(axesHelper);
	const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
	core.scene.add(cube);
	const plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0xbbffaa }));
	plane.rotation.set(0, 0.5 * Math.PI, 0);
	core.scene.add(plane);
}

export function loadWorld(core) {
	addLight(core);
	addTestScene(core);
}

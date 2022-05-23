// eslint-disable-next-line
// import * as THREE from '../../node_modules/three/build/three.module';
import * as THREE from 'three';
import { config, symConfig } from '../controller/config';

class Core {
	camera: THREE.PerspectiveCamera;

	scene: THREE.Scene;

	renderer: THREE.WebGLRenderer;

	constructor() {
		this.camera = new THREE.PerspectiveCamera();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.init();
	}

	init() {
		this.initCamera();
		this.initScene();
		this.initRenderer();
		this.work();
	}

	initCamera() {
		this.camera.fov = config.camera.fov;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.near = 0.01;
		this.camera.far = config.renderer.renderDistance;
		this.camera.updateProjectionMatrix();
		this.camera.position.set(
			symConfig.camera.initPosition.x * config.camera.camHeight,
			symConfig.camera.initPosition.y * config.camera.camHeight,
			symConfig.camera.initPosition.z * config.camera.camHeight
		);

		// TODO
		this.camera.lookAt(symConfig.camera.lookAt.x, symConfig.camera.lookAt.y, symConfig.camera.lookAt.z);

		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
	}

	initScene() {
		this.scene = new THREE.Scene();
		const backgroundColor = symConfig.stage.skyBackground;

		this.scene.fog = new THREE.FogExp2(backgroundColor, config.renderer.fog);
		this.scene.background = new THREE.Color(backgroundColor);

		const sunLight = new THREE.PointLight(0xffffff, 0.5);
		sunLight.position.set(500, 500, 500);
		this.scene.add(sunLight);

		const sunLight2 = new THREE.PointLight(0xffffff, 0.2);
		sunLight2.position.set(-500, 500, -500);
		this.scene.add(sunLight2);

		const reflectionLight = new THREE.AmbientLight(0x404040);
		this.scene.add(reflectionLight);
	}

	initRenderer() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('game-stage').appendChild(this.renderer.domElement);

		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	addTestScene() {
		this;
	}

	work() {
		this.renderer.render(this.scene, this.camera);
	}
}

export default Core;

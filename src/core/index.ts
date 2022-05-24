import * as THREE from 'three';
import { config, symConfig } from '../controller/config';

class Core {
	camera: THREE.PerspectiveCamera;

	scene: THREE.Scene;

	renderer: THREE.WebGLRenderer;

	loaded: boolean;

	constructor() {
		this.loaded = false;
		this.camera = new THREE.PerspectiveCamera();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	init() {
		this.loaded = true;
		this.initCamera();
		this.initScene();
		this.initRenderer();
		this.addTestScene();
	}

	initCamera() {
		this.camera.fov = config.camera.fov;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.near = 0.01;
		this.camera.far = config.renderer.renderDistance;
		this.camera.updateProjectionMatrix();
		// this.camera.position.set(
		// 	symConfig.camera.initPosition.x * config.camera.camHeight,
		// 	symConfig.camera.initPosition.y * config.camera.camHeight,
		// 	symConfig.camera.initPosition.z * config.camera.camHeight
		// );
		this.camera.position.set(config.state.posX * config.camera.camHeight, config.state.posY * config.camera.camHeight, config.state.posZ * config.camera.camHeight);

		// TODO 修正相机配置 采用crosshair | default sym config
		this.camera.lookAt(symConfig.camera.lookAt.x, symConfig.camera.lookAt.y, symConfig.camera.lookAt.z);
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
	}

	addTestScene() {
		const axesHelper = new THREE.AxesHelper(10000);
		this.scene.add(axesHelper);
		const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
		this.scene.add(cube);
		const plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0xbbffaa }));
		plane.rotation.set(0, 0.5 * Math.PI, 0);
		this.scene.add(plane);
	}

	tryRender() {
		this.renderer.render(this.scene, this.camera);
	}

	updateGL() {
		this.scene.fog = new THREE.FogExp2(symConfig.stage.skyBackground, config.renderer.fog);
		this.camera.fov = config.camera.fov;
		this.camera.far = config.renderer.renderDistance;
		this.camera.position.set(config.state.posX * config.camera.camHeight, config.state.posY * config.camera.camHeight, config.state.posZ * config.camera.camHeight);
		this.camera.updateProjectionMatrix();
		console.log(this.scene);
		console.log(this.camera);
	}
}

export default Core;

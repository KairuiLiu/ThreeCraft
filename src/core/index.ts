import * as THREE from 'three';
import { config, symConfig } from '../controller/config';
import Audio from './audio';
import Terrain from './terrain';
import Loader from './loader';

class Core {
	camera: THREE.PerspectiveCamera;

	scene: THREE.Scene;

	renderer: THREE.WebGLRenderer;

	terrain: Terrain;

	loader: Loader;

	audio: Audio;

	constructor() {
		this.camera = new THREE.PerspectiveCamera();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();

		this.loader = new Loader();
		this.terrain = new Terrain(this);
		this.audio = new Audio(this);

		this.init();
	}

	init() {
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});

		this.camera.fov = config.camera.fov;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.near = 0.01;
		this.camera.far = config.renderer.renderDistance;
		this.camera.updateProjectionMatrix();
		this.camera.position.set(config.state.posX * config.camera.camHeight, config.state.posY * config.camera.camHeight, config.state.posZ * config.camera.camHeight);
		// TODO 修正相机配置 采用crosshair | default sym config
		this.camera.lookAt(0, 0, 0);

		this.scene = new THREE.Scene();
		const backgroundColor = symConfig.stage.skyBackground;
		this.scene.fog = new THREE.FogExp2(backgroundColor, config.renderer.fog);
		this.scene.background = new THREE.Color(backgroundColor);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('game-stage').appendChild(this.renderer.domElement);
	}

	tryRender() {
		this.renderer.render(this.scene, this.camera);
	}

	updateCore() {
		(this.scene.fog as THREE.FogExp2).density = config.renderer.fog;
		this.camera.fov = config.camera.fov;
		this.camera.far = config.renderer.renderDistance;
		this.camera.position.set(config.state.posX * config.camera.camHeight, config.state.posY * config.camera.camHeight, config.state.posZ * config.camera.camHeight);
		this.camera.updateProjectionMatrix();
	}
}

export default Core;

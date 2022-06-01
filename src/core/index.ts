import * as THREE from 'three';
import { blockLoader, blockTypes } from './loader';
import { config, symConfig } from '../controller/config';
import Audio from './audio';
import Terrain from './terrain';
import BlockAction from './block-action';

class Core {
	camera: THREE.PerspectiveCamera;

	scene: THREE.Scene;

	renderer: THREE.WebGLRenderer;

	terrain: Terrain;

	audio: Audio;

	blockAction: BlockAction;

	vr: boolean;

	constructor() {
		this.camera = new THREE.PerspectiveCamera();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();

		this.terrain = new Terrain(this);
		this.audio = new Audio(this);
		this.blockAction = new BlockAction(this);
		this.vr = false;

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
		this.camera.far = Math.max(233, config.renderer.stageSize * Math.sqrt(3));
		this.camera.updateProjectionMatrix();
		this.camera.position.set(config.state.posX, config.state.posY, config.state.posZ);
		// this.camera.lookAt(0, 0, 0);
		this.camera.rotation.order = 'YXZ';

		this.scene = new THREE.Scene();
		const backgroundColor = symConfig.stage.skyBackground;
		this.scene.fog = new THREE.FogExp2(backgroundColor, config.renderer.fog);
		this.scene.background = new THREE.Color(backgroundColor);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('game-stage').appendChild(this.renderer.domElement);
	}

	tryRender() {
		this.terrain.tryUpdateScene();
		this.renderer.render(this.scene, this.camera);
	}

	updateCore() {
		(this.scene.fog as THREE.FogExp2).density = config.renderer.fog;
		this.camera.fov = config.camera.fov;
		this.camera.far = Math.max(233, config.renderer.stageSize * Math.sqrt(3));
		this.camera.position.set(config.state.posX, config.state.posY, config.state.posZ);
		this.camera.updateProjectionMatrix();
	}

	static getMaterial(idx) {
		if (blockLoader[blockTypes[idx]].textureImg instanceof Array) return blockLoader[blockTypes[idx]].textureImg.map(d => new THREE.MeshStandardMaterial({ map: d }));
		return new THREE.MeshStandardMaterial({ map: blockLoader[blockTypes[idx]].textureImg });
	}
}

export default Core;

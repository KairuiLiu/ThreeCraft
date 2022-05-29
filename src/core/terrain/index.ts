import * as THREE from 'three';
import { iBlockFragment } from '../../utils/types/block';
import Core from '..';
import Generate from './generate';
import { config } from '../../controller/config';

class Terrain {
	core: Core;

	seed: number;

	cloudSeed: number;

	treeSeed: number;

	generator: Generate;

	size: number;

	// 块大小
	fragmentSize: number;

	originX: number;

	originZ: number;

	thread: number;

	// 块滚动数组
	blockFragments: iBlockFragment[][];

	constructor(core) {
		this.core = core;
		this.generator = new Generate(this);
	}

	// 更新世界
	updateState() {
		// TODO 注意, 防止线程爆炸
		this.clear();
		this.seed = config.seed;
		this.cloudSeed = config.cloudSeed;
		this.treeSeed = config.treeSeed;
		this.size = config.renderer.stageSize;
		this.fragmentSize = Math.sqrt(this.size);
		this.originX = Math.floor(config.state.posX / this.fragmentSize) * this.fragmentSize;
		this.originZ = Math.floor(config.state.posZ / this.fragmentSize) * this.fragmentSize;
		this.thread = config.controller.thread;
		this.blockFragments = new Array(this.fragmentSize);
		this.generator.setSeed(this.seed, this.cloudSeed, this.treeSeed);
		for (let i = 0; i < this.fragmentSize; i += 1) {
			this.blockFragments[i] = new Array(this.fragmentSize);
			for (let j = 0; j < this.fragmentSize; j += 1) {
				this.blockFragments[i][j] = {
					timestamp: 0,
					posX: null,
					posZ: null,
					group: null,
					types: [],
				};
			}
		}
		this.buildWorld();
		return true;
	}

	// 创建世界
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

		this.generator.setSeed(config.seed, config.cloudSeed, config.treeSeed);

		// const geometry = new THREE.BoxGeometry();
		// blockTypes.forEach((d, i) => {
		// 	const blockInstance = new THREE.InstancedMesh(geometry, this.core.getMaterial(i), this.core.maxCount);
		// 	blockInstance.name = d;
		// 	this.core.blockInstances[i] = blockInstance;
		// 	this.core.scene.add(blockInstance);
		// });

		this.tryUpdateAll();
	}

	tryUpdateAll() {
		this.generator.generateAll({
			stx: this.originX - (this.fragmentSize * this.fragmentSize) / 2,
			edx: this.originX + (this.fragmentSize * this.fragmentSize) / 2,
			stz: this.originZ - (this.fragmentSize * this.fragmentSize) / 2,
			edz: this.originZ + (this.fragmentSize * this.fragmentSize) / 2,
			thread: this.thread,
			onMessage: this.onUpdateLine,
			fragmentSize: this.fragmentSize,
		});
	}

	tryUpdateScene() {
		let nextX = this.originX;
		let nextZ = this.originZ;
		if (Math.abs(config.state.posZ - this.originZ) > this.fragmentSize) {
			let stz = this.originZ;
			let edz = this.originZ;
			if (config.state.posZ < this.originZ) {
				stz -= this.fragmentSize * (this.fragmentSize / 2 + 1);
				edz -= (this.fragmentSize * this.fragmentSize) / 2;
				nextZ -= this.fragmentSize;
			} else {
				stz += (this.fragmentSize * this.fragmentSize) / 2;
				edz += this.fragmentSize * (this.fragmentSize / 2 + 1);
				nextZ += this.fragmentSize;
			}
			this.generator.generateLine({
				stx: this.originX - (this.fragmentSize * this.fragmentSize) / 2,
				edx: this.originX + (this.fragmentSize * this.fragmentSize) / 2,
				stz,
				edz,
				thread: this.thread,
				onMessage: this.onUpdateLine,
				fragmentSize: this.fragmentSize,
			});
		}
		if (Math.abs(config.state.posX - this.originX) > this.fragmentSize) {
			let stx = this.originX;
			let edx = this.originX;
			if (config.state.posZ < this.originZ) {
				stx -= this.fragmentSize * (this.fragmentSize / 2 + 1);
				edx -= (this.fragmentSize * this.fragmentSize) / 2;
				nextX -= this.fragmentSize;
			} else {
				stx += (this.fragmentSize * this.fragmentSize) / 2;
				edx += this.fragmentSize * (this.fragmentSize / 2 + 1);
				nextX += this.fragmentSize;
			}
			this.generator.generateLine({
				stz: this.originZ - (this.fragmentSize * this.fragmentSize) / 2,
				edz: this.originZ + (this.fragmentSize * this.fragmentSize) / 2,
				stx,
				edx,
				thread: this.thread,
				onMessage: this.onUpdateLine,
				fragmentSize: this.fragmentSize,
			});
		}
		this.originX = nextX;
		this.originZ = nextZ;
	}

	// 部分刷新回调
	onUpdateLine(ev) {
		// 忽略出问题的多线程
		const { fragmentSize } = ev.data;
		const fragments = ev.data.res as iBlockFragment[];
		if (this.fragmentSize !== fragmentSize) return;
		fragments.forEach(d => {
			// 忽略越界的部分
			const blkX = Math.abs(d.posX - this.originX) / fragmentSize;
			const blkZ = Math.abs(d.posZ - this.originZ) / fragmentSize;
			if (blkX > fragmentSize || blkZ > fragmentSize) return;
			const oldFrag = this.blockFragments[blkZ][blkX];
			this.core.scene.remove(oldFrag.group);
			this.blockFragments[blkZ][blkX] = d;
			this.core.scene.add(d.group);
		});
	}

	// 清除世界
	clear() {
		while (this.core.scene.children.length) {
			this.core.scene.remove(this.core.scene.children[0]);
		}
	}
}

export default Terrain;

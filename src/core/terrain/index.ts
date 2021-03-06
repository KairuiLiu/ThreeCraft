import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { iBlockFragment } from '../../utils/types/block';
import Core from '..';
import Generate from './generate';
import { config, symConfig } from '../../controller/config';
import { blockLoader, blockGeom, cloudGeom, cloudMaterial } from '../loader';

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

	// 更新世界, 重设场景信息, 用于更新场景大小时候
	updateState() {
		this.clear();
		this.seed = config.seed;
		this.cloudSeed = config.cloudSeed;
		this.treeSeed = config.treeSeed;
		this.size = config.renderer.stageSize;
		this.fragmentSize = Math.sqrt(this.size);
		this.originX = Math.floor(config.state.posX / this.fragmentSize) * this.fragmentSize;
		this.originZ = Math.floor(config.state.posZ / this.fragmentSize) * this.fragmentSize;
		this.thread = config.controller.thread;
		if (this.generator.treaders.length !== this.thread) {
			this.generator.setTreader(this.thread);
		}
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
					templateMesh: [],
					idMap: new Map(),
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

		this.tryUpdateAll();
	}

	// 生成刷新整个世界
	tryUpdateAll() {
		this.generator.generateAll({
			stx: this.originX - (this.fragmentSize * this.fragmentSize) / 2,
			edx: this.originX + (this.fragmentSize * this.fragmentSize) / 2,
			stz: this.originZ - (this.fragmentSize * this.fragmentSize) / 2,
			edz: this.originZ + (this.fragmentSize * this.fragmentSize) / 2,
			thread: this.thread,
			fragmentSize: this.fragmentSize,
		});
	}

	// 尝试部分刷新世界
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
			this.originZ = nextZ;
			this.generator.generateLine({
				stx: this.originX - (this.fragmentSize * this.fragmentSize) / 2,
				edx: this.originX + (this.fragmentSize * this.fragmentSize) / 2,
				stz,
				edz,
				thread: this.thread,
				fragmentSize: this.fragmentSize,
			});
		}
		if (Math.abs(config.state.posX - this.originX) > this.fragmentSize) {
			let stx = this.originX;
			let edx = this.originX;
			if (config.state.posX < this.originX) {
				stx -= this.fragmentSize * (this.fragmentSize / 2 + 1);
				edx -= (this.fragmentSize * this.fragmentSize) / 2;
				nextX -= this.fragmentSize;
			} else {
				stx += (this.fragmentSize * this.fragmentSize) / 2;
				edx += this.fragmentSize * (this.fragmentSize / 2 + 1);
				nextX += this.fragmentSize;
			}
			this.originX = nextX;
			this.generator.generateLine({
				stz: this.originZ - (this.fragmentSize * this.fragmentSize) / 2,
				edz: this.originZ + (this.fragmentSize * this.fragmentSize) / 2,
				stx,
				edx,
				thread: this.thread,
				fragmentSize: this.fragmentSize,
			});
		}
	}

	// 刷新成功后回调
	onUpdateLine(ev) {
		const matrix = new THREE.Matrix4();
		const { fragmentSize, frags } = ev.data;
		// 忽略场景重刷前的线程
		if (this.fragmentSize !== fragmentSize) return;
		frags.forEach((d: iBlockFragment) => {
			// 忽略越界的部分
			if (
				d.posX < this.originX - (fragmentSize * fragmentSize) / 2 ||
				d.posX >= this.originX + (fragmentSize * fragmentSize) / 2 ||
				d.posZ < this.originZ - (fragmentSize * fragmentSize) / 2 ||
				d.posZ >= this.originZ + (fragmentSize * fragmentSize) / 2
			)
				return;

			// 计算在数组中的index
			let blkX = d.posX + (fragmentSize * fragmentSize) / 2;
			while (blkX < 0) blkX += fragmentSize * fragmentSize;
			blkX = (blkX / fragmentSize) % fragmentSize;
			let blkZ = d.posZ + (fragmentSize * fragmentSize) / 2;
			while (blkZ < 0) blkZ += fragmentSize * fragmentSize;
			blkZ = (blkZ / fragmentSize) % fragmentSize;

			const oldFrag = this.blockFragments[blkZ][blkX];
			// 忽略生成太晚的线程
			if (d.timestamp < oldFrag.timestamp) return;
			// 回收空间
			if (oldFrag.group !== null) {
				oldFrag.types.forEach(dd => {
					dd.instancedMesh.dispose();
				});
				oldFrag.cloudMesh && oldFrag.cloudMesh.dispose();
				oldFrag.templateMesh.forEach(dd => {
					oldFrag.group.remove(dd);
					dd.remove();
				});
				this.core.scene.remove(oldFrag.group);
			}
			this.blockFragments[blkZ][blkX] = d;
			// 生成Mesh, 写入Group
			d.group = new THREE.Group();
			d.types.forEach(dd => {
				dd.instancedMesh = new THREE.InstancedMesh(blockGeom, blockLoader[dd.blocks.type].material, dd.blocks.count);
				dd.instancedMesh.name = `${blkZ}_${blkX}_${dd.blocks.type}`;
				for (let i = 0; i < dd.blocks.count; i += 1) {
					// if (dd.blocks.position[3 * i + 1] < 99999) continue;
					matrix.setPosition(dd.blocks.position[3 * i], dd.blocks.position[3 * i + 1], dd.blocks.position[3 * i + 2]);
					dd.instancedMesh.setMatrixAt(i, matrix);
				}
				dd.instancedMesh.instanceMatrix.needsUpdate = true;
				d.group.add(dd.instancedMesh);
			});

			d.cloudMesh = new THREE.InstancedMesh(cloudGeom, cloudMaterial, d.cloudPos.length / 3);
			for (let i = 0; i < d.cloudPos.length / 3; i += 1) {
				matrix.setPosition(d.cloudPos[i * 3], d.cloudPos[i * 3 + 1], d.cloudPos[i * 3 + 2]);
				d.cloudMesh.setMatrixAt(i, matrix);
			}
			d.cloudMesh.instanceMatrix.needsUpdate = true;
			d.group.add(d.cloudMesh);

			this.core.scene.add(d.group);
		});
	}

	// 清除世界
	clear() {
		while (this.core.scene.children.length) {
			this.core.scene.remove(this.core.scene.children[0]);
		}
	}

	getFloorHeight(x, z) {
		const noiseGen = new ImprovedNoise();
		const { maxHeight } = symConfig.stage;
		const { seed } = config;
		const { seedGap } = symConfig.noiseGap;
		return Math.floor(noiseGen.noise(x / seedGap, z / seedGap, seed) * maxHeight);
		this;
	}

	hasBlock(x, z, y) {
		const idx = this.getFragIdx(x, z);
		return this.blockFragments[idx.z][idx.x].idMap.get(`${x}_${y}_${z}`);
	}

	getFragIdx(x, z) {
		let blkX = x + (this.fragmentSize * this.fragmentSize) / 2;
		while (blkX < 0) blkX += this.fragmentSize * this.fragmentSize;
		blkX = Math.floor(blkX / this.fragmentSize) % this.fragmentSize;
		let blkZ = z + (this.fragmentSize * this.fragmentSize) / 2;
		while (blkZ < 0) blkZ += this.fragmentSize * this.fragmentSize;
		blkZ = Math.floor(blkZ / this.fragmentSize) % this.fragmentSize;
		return { x: blkX, z: blkZ };
	}
}

export default Terrain;

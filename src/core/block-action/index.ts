import * as THREE from 'three';
import { blockGeom, blockLoader } from '../loader/index';
import { BlockLog } from '../../utils/types/block';
import Core from '..';

class BlockAction {
	core: Core;

	matrix: THREE.Matrix4;

	constructor(core) {
		this.core = core;
		this.matrix = new THREE.Matrix4();
	}

	removeBlock(blk: BlockLog) {
		const fragIdx = this.getFragIdx(blk.posX, blk.posZ);
		if (this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].idMap.has(`${blk.posX}_${blk.posY}_${blk.posZ}`)) {
			const oldBlock = this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].idMap.get(`${blk.posX}_${blk.posY}_${blk.posZ}`);
			if (oldBlock.temp) {
				this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].group.remove(this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].templateMesh[oldBlock.idx]);
			} else {
				this.matrix.setPosition(0, -1000, 0);
				this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].types[oldBlock.typeIdx].instancedMesh.setMatrixAt(oldBlock.idx, this.matrix.clone());
				this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].types[oldBlock.typeIdx].instancedMesh.instanceMatrix.needsUpdate = true;
			}
			this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].idMap.delete(`${blk.posX}_${blk.posY}_${blk.posZ}`);
		}
	}

	placeBlock(blk: BlockLog) {
		const fragIdx = this.getFragIdx(blk.posX, blk.posZ);
		const mesh = new THREE.Mesh(blockGeom, blockLoader[blk.type].material);
		mesh.position.set(blk.posX, blk.posY, blk.posZ);
		if (this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].idMap.has(`${blk.posX}_${blk.posY}_${blk.posZ}`)) {
			this.removeBlock(blk);
		}
		this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].group.add(mesh);
		this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].idMap.set(`${blk.posX}_${blk.posY}_${blk.posZ}`, {
			temp: true,
			idx: this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].templateMesh.length,
		});
		this.core.terrain.blockFragments[fragIdx.z][fragIdx.x].templateMesh.push(mesh);
	}

	getFragIdx(x, z) {
		const { fragmentSize } = this.core.terrain;
		let blkX = x + (fragmentSize * fragmentSize) / 2;
		while (blkX < 0) blkX += fragmentSize * fragmentSize;
		blkX = Math.floor(blkX / fragmentSize) % fragmentSize;
		let blkZ = z + (fragmentSize * fragmentSize) / 2;
		while (blkZ < 0) blkZ += fragmentSize * fragmentSize;
		blkZ = Math.floor(blkZ / fragmentSize) % fragmentSize;
		return { x: blkX, z: blkZ };
	}
}

export default BlockAction;

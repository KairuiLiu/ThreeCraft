import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { iBlockFragment } from '../../../utils/types/block';
import { blockTypes, treeTypes, blockGeom, blockLoader, cloudGeom, cloudMaterial } from '../../loader';
import weatherTypes from '../../weather';
import { symConfig, config } from '../../../controller/config';
import Log from '../../../controller/log';

function insertInstancedBlock(fragment, typeIdx, x, y, z) {
	if (fragment.idMap.has(`${x}_${y}_${z}`) && y > -1000000) return;

	fragment.types[typeIdx].blocks.position.push(x, y, z);
	fragment.idMap.set(`${x}_${y}_${z}`, {
		temp: false,
		idx: fragment.types[typeIdx].blocks.count,
		typeIdx,
	});
	fragment.types[typeIdx].blocks.count += 1;
}

// 同步生成指定位置的包围盒(access: 穿越不穿越可穿越的)
export function generateFragSync(stx: number, edx: number, stz: number, edz: number, sty: number, edy: number, access: boolean, logger: Log) {
	stx = Math.floor(stx);
	sty = Math.floor(sty);
	stz = Math.floor(stz);
	edx = Math.ceil(edx);
	edy = Math.ceil(edy);
	edz = Math.ceil(edz);

	const { weather } = config;
	const noiseGen = new ImprovedNoise();
	const { seed, cloudSeed, treeSeed } = config;
	const [water, surface, base] = weatherTypes[weather];
	const { seedGap, cloudSeedGap, treeSeedGap } = symConfig.noiseGap;
	const { horizonHeight, treeBaseHeight, maxHeight, skyHeight } = symConfig.stage;
	const log = logger.queryArea(stx, edx, stz, edz);

	sty = Math.floor(sty);
	edy = Math.ceil(edy);

	const blockFragment: iBlockFragment = {
		timestamp: performance.now(),
		posX: stx,
		posZ: stz,
		group: new THREE.Group(),
		types: new Array(blockTypes.length),
		cloudPos: [],
		idMap: new Map(),
		templateMesh: [],
	};

	for (let i = 0; i < blockFragment.types.length; i += 1) {
		blockFragment.types[i] = {
			instancedMesh: null,
			blocks: {
				type: blockTypes[i],
				count: 0,
				position: [],
			},
		};
	}

	for (let i = stx; i < edx; i += 1) {
		for (let j = stz; j < edz; j += 1) {
			const y = Math.floor(noiseGen.noise(i / seedGap, j / seedGap, seed) * maxHeight);
			const adjY = Math.min(Math.max(y, sty), edy);
			// 岩石和水
			if (adjY < horizonHeight) {
				if (y >= sty || y <= edy) insertInstancedBlock(blockFragment, base, i, y, j);
				if (!access || !blockLoader[blockFragment.types[water].blocks.type]?.accessible)
					for (let yy = adjY + 1; yy <= horizonHeight && yy <= edy; yy += 1) insertInstancedBlock(blockFragment, water, i, yy, j);
			} else {
				// 表面和树
				if (y >= sty || y <= edy) insertInstancedBlock(blockFragment, surface, i, y, j);
				// tree 生成
				if (y > treeBaseHeight) {
					const treeType = y % treeTypes.length;
					const treeHeight = Math.floor(noiseGen.noise(i / treeSeedGap, j / treeSeedGap, treeSeed) * maxHeight * 1.5);
					if (treeHeight > 4 && treeHeight % 2 === i % 3 && treeHeight % 2 === j % 3) {
						for (let wl = 0; wl <= treeHeight; wl += 1) if (sty <= y + 1 + wl && y + 1 + wl <= edy) insertInstancedBlock(blockFragment, treeTypes[treeType][0], i, y + 1 + wl, j);
						if (!access || !blockLoader[blockFragment.types[treeTypes[treeType][1]].blocks.type]?.accessible) {
							const stxL = i - Math.floor(treeHeight / 3.5);
							const edxL = i + Math.floor(treeHeight / 3.5);
							const stzL = j - Math.floor(treeHeight / 3.5);
							const edzL = j + Math.floor(treeHeight / 3.5);
							for (let leaveX = stxL; leaveX <= edxL; leaveX += 1) {
								for (let leaveZ = stzL; leaveZ <= edzL; leaveZ += 1) {
									const deltaY = Math.max(Math.abs(Math.floor((noiseGen.noise(leaveX / treeSeedGap / 10, leaveZ / treeSeedGap / 10, treeSeed) * maxHeight) / 2)), 2);
									const fromY = y + 1 + treeHeight - deltaY;
									const endY = y + 1 + treeHeight + deltaY;
									if (leaveX === stxL || leaveX === edxL || leaveZ === stzL || leaveZ === edzL)
										for (let leaveY = Math.max(fromY + 1, sty); leaveY < Math.min(edy, endY); leaveY += 1)
											if (!blockFragment.idMap.has(`${leaveX}_${leaveY}_${leaveZ}`)) insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, leaveY, leaveZ);
									insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, fromY, leaveZ);
									insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, endY, leaveZ);
								}
							}
						}
					}
				}
			}

			// cloud 生成
			const cloudGen = noiseGen.noise(i / cloudSeedGap, j / cloudSeedGap, cloudSeed);
			if (!access && (cloudGen > 0.8 || cloudGen < -0.8)) {
				blockFragment.cloudPos.push(stx + (i - stx) * 4, cloudGen * maxHeight + skyHeight, stz + (j - stz) * 3);
			}
		}
	}

	log.forEach(d => {
		if (d.type === null || blockFragment.idMap.has(`${d.posX}_${d.posY}_${d.posZ}`)) {
			if (!blockFragment.idMap.has(`${d.posX}_${d.posY}_${d.posZ}`)) return;
			const block = blockFragment.idMap.get(`${d.posX}_${d.posY}_${d.posZ}`);
			blockFragment.types[block.typeIdx].blocks.position[block.idx * 3] = 0;
			blockFragment.types[block.typeIdx].blocks.position[block.idx * 3 + 1] = -1000000;
			blockFragment.types[block.typeIdx].blocks.position[block.idx * 3 + 2] = 0;
			blockFragment.idMap.delete(`${d.posX}_${d.posY}_${d.posZ}`);
		}
		if (d.type !== null) {
			const typeIdx = blockTypes.indexOf(d.type);
			insertInstancedBlock(blockFragment, typeIdx, d.posX, d.posY, d.posZ);
		}
	});

	let idx = 0;
	blockFragment.types.forEach(d => {
		if (d.blocks.count === 0) return;
		d.blocks.newIdx = idx;
		idx += 1;
	});
	blockFragment.idMap.forEach(d => {
		d.typeIdx = blockFragment.types[d.typeIdx].blocks.newIdx;
	});
	blockFragment.types = blockFragment.types.filter(d => d.blocks.count);

	const matrix = new THREE.Matrix4();

	blockFragment.types.forEach(dd => {
		dd.instancedMesh = new THREE.InstancedMesh(blockGeom, blockLoader[dd.blocks.type].material, dd.blocks.count);
		for (let i = 0; i < dd.blocks.count; i += 1) {
			matrix.setPosition(dd.blocks.position[3 * i], dd.blocks.position[3 * i + 1], dd.blocks.position[3 * i + 2]);
			dd.instancedMesh.setMatrixAt(i, matrix);
		}
		dd.instancedMesh.instanceMatrix.needsUpdate = true;
		blockFragment.group.add(dd.instancedMesh);
	});

	if (!access) {
		blockFragment.cloudMesh = new THREE.InstancedMesh(cloudGeom, cloudMaterial, blockFragment.cloudPos.length / 3);
		for (let i = 0; i < blockFragment.cloudPos.length / 3; i += 1) {
			matrix.setPosition(blockFragment.cloudPos[i * 3], blockFragment.cloudPos[i * 3 + 1], blockFragment.cloudPos[i * 3 + 2]);
			blockFragment.cloudMesh.setMatrixAt(i, matrix);
		}
		blockFragment.cloudMesh.instanceMatrix.needsUpdate = true;
		blockFragment.group.add(blockFragment.cloudMesh);
	}

	return blockFragment;
}

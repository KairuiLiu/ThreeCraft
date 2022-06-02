import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { blockTypes, treeTypes, blockGeom, blockLoader, cloudGeom, cloudMaterial } from '../../loader';
import { iBlockFragment } from '../../../utils/types/block';
import weatherTypes from '../../weather';
import { symConfig, config } from '../../../controller/config';

export function generateFragSync(stx: number, edx: number, stz: number, edz: number, sty: number, edy: number, access: boolean) {
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

	let hasTree = false;

	sty = Math.floor(sty);
	edy = Math.ceil(edy);

	const blockFragment: iBlockFragment = {
		timestamp: performance.now(),
		posX: stx,
		posZ: stz,
		group: new THREE.Group(),
		types: new Array(blockTypes.length),
		cloudPos: [],
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
			if (adjY < horizonHeight) {
				for (let yy = adjY; yy >= sty; yy -= 1) {
					blockFragment.types[base].blocks.position.push(i, yy, j);
					blockFragment.types[base].blocks.count += 1;
				}
				// water 生成
				if (!access || !blockLoader[blockFragment.types[water].blocks.type]?.accessible) {
					for (let yy = adjY + 1; yy <= horizonHeight && yy <= edy; yy += 1) {
						blockFragment.types[water].blocks.position.push(i, yy, j);
						blockFragment.types[water].blocks.count += 1;
					}
				}
			} else {
				for (let yy = adjY; yy >= sty; yy -= 1) {
					blockFragment.types[surface].blocks.position.push(i, yy, j);
					blockFragment.types[surface].blocks.count += 1;
				}
				// tree 生成
				if (!hasTree) {
					const treeHeight = Math.floor(noiseGen.noise(i / treeSeedGap, j / treeSeedGap, treeSeed) * maxHeight * 2);
					if (y > treeBaseHeight && treeHeight >= 7) {
						hasTree = true;
						for (let wl = 0; wl <= treeHeight && y + 1 + wl < edy; wl += 1) {
							blockFragment.types[treeTypes[y % treeTypes.length][0]].blocks.position.push(i, y + 1 + wl, j);
							blockFragment.types[treeTypes[y % treeTypes.length][0]].blocks.count += 1;
						}
						if (!access) {
							for (let leaveX = i - Math.floor(treeHeight / 3.5); leaveX <= i + Math.floor(treeHeight / 3.5); leaveX += 1) {
								for (let leaveZ = j - Math.floor(treeHeight / 3.5); leaveZ <= j + Math.floor(treeHeight / 3.5); leaveZ += 1) {
									let deltaY = Math.abs(Math.floor(Math.floor(noiseGen.noise(leaveX / treeSeedGap, leaveZ / treeSeedGap, treeSeed) * maxHeight) / 2));
									if (deltaY < 2) deltaY = 2;
									const fromY = y + 1 + treeHeight - deltaY;
									const endY = y + 1 + treeHeight + deltaY;
									if (
										leaveX === i - Math.floor(treeHeight / 3.5) ||
										leaveX === i + Math.floor(treeHeight / 3.5) ||
										leaveZ === j - Math.floor(treeHeight / 3.5) ||
										leaveZ === j + Math.floor(treeHeight / 3.5)
									)
										for (let leaveY = fromY + 1; leaveY < endY; leaveY += 1) {
											blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, leaveY, leaveZ);
											blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count += 1;
										}
									blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, fromY, leaveZ);
									blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, endY, leaveZ);
									blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count += 2;
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
	// TODO Log 生成

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

	blockFragment.types = blockFragment.types.filter(d => d.blocks.count > 0);

	return blockFragment;
}

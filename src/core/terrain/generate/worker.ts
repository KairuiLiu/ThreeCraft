// import * as THREE from 'three';
// const matrix = new THREE.Matrix4();
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { iBlockFragment } from '../../../utils/types/block';

// 对于一个区间, 生成BlockFrags
onmessage = (
	msg: MessageEvent<{
		timestamp: number;
		stx: number;
		edx: number;
		stz: number;
		edz: number;
		fragmentSize: number;
		noiseSeed: {
			seed: number;
			cloudSeed: number;
			treeSeed: number;
		};
		noiseGap: {
			seedGap: number;
			cloudSeedGap: number;
			treeSeedGap: number;
		};
		weather: number;
		blockTypes;
		weatherTypes;
		horizonHeight: number;
		treeBaseHeight: number;
		maxHeight: number;
		skyHeight: number;
	}>
) => {
	const { skyHeight, weatherTypes, noiseGap, blockTypes, horizonHeight, maxHeight, timestamp, stx, edx, stz, edz, fragmentSize, noiseSeed, weather, treeBaseHeight } = msg.data;
	const { seed, cloudSeed, treeSeed } = noiseSeed;
	const { seedGap, cloudSeedGap, treeSeedGap } = noiseGap;
	const [water, surface, base] = weatherTypes[weather];
	const noiseGen = new ImprovedNoise();

	const frags = [];

	for (let curX = stx; curX < edx; curX += fragmentSize) {
		for (let curZ = stz; curZ < edz; curZ += fragmentSize) {
			const blockFragment: iBlockFragment = {
				timestamp,
				posX: curX,
				posZ: curZ,
				// group: new THREE.Group(),
				group: null,
				// types: new Array(blockTypes.length),
				types: new Array(blockTypes.length),
				treePos: [],
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
			// surface 生成
			for (let i = curX; i < edx; i += 1) {
				for (let j = curZ; j < edz; j += 1) {
					const y = Math.floor(noiseGen.noise(i / seedGap, j / seedGap, seed) * maxHeight);
					// matrix.setPosition(i, y, j);
					if (y < horizonHeight) {
						// blockFragment.types[base].blocks.position.push(matrix.clone());
						blockFragment.types[base].blocks.position.push(i, y, j);
						blockFragment.types[base].blocks.count += 1;
						// water 生成
						// const mat4 = new THREE.Matrix4();
						// for (let yy = y + 1; yy <= horizonHeight; yy += 1) {
						// mat4.setPosition(i, yy, j);
						// blockFragment.types[water].blocks.position.push(mat4.clone());
						blockFragment.types[water].blocks.position.push(i, y, j);
						blockFragment.types[water].blocks.position.push(i, horizonHeight, j);
						blockFragment.types[water].blocks.count += 2;
						// }
					} else {
						// blockFragment.types[surface].blocks.position.push(matrix.clone());
						blockFragment.types[surface].blocks.position.push(i, y, j);
						blockFragment.types[surface].blocks.count += 1;
						// tree 生成
						if (y < treeBaseHeight && noiseGen.noise(i / treeSeedGap, j / treeSeedGap, treeSeed) * maxHeight > y) {
							blockFragment.treePos.push(i, y + 1, j);
						}
					}

					// cloud 生成
					const cloudGen = noiseGen.noise(i / cloudSeedGap, j / cloudSeedGap, cloudSeed);
					if (cloudGen > 0.8 || cloudGen < -0.8) {
						blockFragment.cloudPos.push(curX + (i - curX) * 4, cloudGen * maxHeight + skyHeight, curZ + (j - curZ) * 3);
					}
				}
			}
			// TODO Log 生成

			// ! 在此处不能生成实例
			// blockFragment.types.forEach((d, i) => {
			// 	if (d.blocks.count > 0) {
			// 		d.instancedMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), blockLoader[blockTypes[i]].material, d.blocks.count);
			// 		d.blocks.position.forEach((dd, ii) => d.instancedMesh.setMatrixAt(ii, dd));
			// 		blockFragment.group.add(d.instancedMesh);
			// 	}
			// });

			blockFragment.types = blockFragment.types.filter(d => d.blocks.count > 0);
			frags.push(blockFragment);
		}
	}

	postMessage({ frags, fragmentSize });
};

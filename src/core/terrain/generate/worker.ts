import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { iBlockFragment } from '../../../utils/types/block';
import { blockLoader } from '../../loader';

const matrix = new THREE.Matrix4();

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
		weather: number;
		blockTypes: string[];
		symConfig;
		weatherTypes;
	}>
) => {
	// 准备
	const { symConfig, blockTypes, timestamp, weatherTypes, stx, edx, stz, edz, fragmentSize, noiseSeed, weather } = msg.data;
	const { seed, cloudSeed, treeSeed } = noiseSeed;
	const [water, surface, base] = weatherTypes[weather];
	const noiseGen = new ImprovedNoise();

	const res = [];

	for (let curX = stx; curX < edx; curX += fragmentSize) {
		for (let curZ = stz; curZ < edz; curZ += fragmentSize) {
			const blockFragment: iBlockFragment = {
				timestamp,
				posX: curX,
				posZ: curZ,
				group: new THREE.Group(),
				types: new Array(blockTypes.length),
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
			// TODO surface 生成
			for (let i = curX; i < fragmentSize; i += 1) {
				for (let j = curZ; j < edz; j += 1) {
					const y = Math.floor(noiseGen.noise(i, j, seed) * symConfig.stage.maxHeight);
					matrix.setPosition(i, y, j);
					if (y < symConfig.stage.horizonHeight) {
						// TODO water 生成
						blockFragment.types[base].blocks.position.push(matrix.clone());
						blockFragment.types[base].blocks.count += 1;
					} else {
						blockFragment.types[surface].blocks.position.push(matrix.clone());
						blockFragment.types[surface].blocks.count += 1;
					}
				}
			}
			// TODO cloud 生成
			// TODO Log 生成
			blockFragment.types.forEach((d, i) => {
				if (d.blocks.count > 0) {
					d.instancedMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), blockLoader[blockTypes[i]].material, d.blocks.count);
					d.blocks.position.forEach((dd, ii) => d.instancedMesh.setMatrixAt(ii, dd));
					blockFragment.group.add(d.instancedMesh);
				}
			});
			res.push(blockFragment);
		}
	}

	postMessage({ res, fragmentSize });
};

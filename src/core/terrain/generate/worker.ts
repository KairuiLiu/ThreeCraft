import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { BlockLog, iBlockFragment } from '../../../utils/types/block';

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
		treeTypes: number[][];
		log: BlockLog[];
	}>
) => {
	const { log, treeTypes, skyHeight, weatherTypes, noiseGap, blockTypes, horizonHeight, maxHeight, timestamp, stx, edx, stz, edz, fragmentSize, noiseSeed, weather, treeBaseHeight } = msg.data;
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
				group: null,
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

			for (let i = curX; i < curX + fragmentSize; i += 1) {
				for (let j = curZ; j < curZ + fragmentSize; j += 1) {
					const y = Math.floor(noiseGen.noise(i / seedGap, j / seedGap, seed) * maxHeight);
					if (y < horizonHeight) {
						// surface 生成
						insertInstancedBlock(blockFragment, base, i, y, j);
						// water 生成
						for (let yy = y + 1; yy <= horizonHeight; yy += 1) insertInstancedBlock(blockFragment, water, i, yy, j);
					} else {
						insertInstancedBlock(blockFragment, surface, i, y, j);
						if (y > treeBaseHeight) {
							const treeType = y % treeTypes.length;
							const treeHeight = Math.floor(noiseGen.noise(i / treeSeedGap, j / treeSeedGap, treeSeed) * maxHeight * 1.5);
							if (treeHeight > 4 && treeHeight % 2 === i % 3 && treeHeight % 2 === j % 3) {
								for (let wl = 0; wl <= treeHeight; wl += 1) insertInstancedBlock(blockFragment, treeTypes[treeType][0], i, y + 1 + wl, j);
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
											for (let leaveY = fromY + 1; leaveY < endY; leaveY += 1)
												if (!blockFragment.idMap.has(`${leaveX}_${leaveY}_${leaveZ}`)) insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, leaveY, leaveZ);
										insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, fromY, leaveZ);
										insertInstancedBlock(blockFragment, treeTypes[treeType][1], leaveX, endY, leaveZ);
									}
								}
							}
						}
					}

					// cloud 生成
					const cloudGen = noiseGen.noise(i / cloudSeedGap, j / cloudSeedGap, cloudSeed);
					if (cloudGen > 0.8 || cloudGen < -0.8) {
						blockFragment.cloudPos.push(curX + (i - curX) * 4, cloudGen * maxHeight + skyHeight, curZ + (j - curZ) * 3);
					}
				}
			}

			log.forEach(d => {
				if (d.posX < curX || d.posX >= curX + fragmentSize || d.posZ < curZ || d.posZ >= curZ + fragmentSize) return;
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

			frags.push(blockFragment);
		}
	}

	postMessage({ frags, fragmentSize });
};

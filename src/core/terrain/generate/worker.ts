import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { BlockLog, iBlockFragment } from '../../../utils/types/block';

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
			let hasTree = false;
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

			// surface 生成
			for (let i = curX; i < edx; i += 1) {
				for (let j = curZ; j < edz; j += 1) {
					const y = Math.floor(noiseGen.noise(i / seedGap, j / seedGap, seed) * maxHeight);
					if (y < horizonHeight) {
						blockFragment.types[base].blocks.position.push(i, y, j);
						blockFragment.idMap.set(`${i}_${y}_${j}`, {
							temp: false,
							idx: blockFragment.types[base].blocks.count,
							typeIdx: base,
						});
						blockFragment.types[base].blocks.count += 1;
						// water 生成
						for (let yy = y + 1; yy <= horizonHeight; yy += 1) {
							blockFragment.types[water].blocks.position.push(i, yy, j);
							blockFragment.idMap.set(`${i}_${y}_${j}`, {
								temp: false,
								idx: blockFragment.types[water].blocks.count,
								typeIdx: water,
							});
							blockFragment.types[water].blocks.count += 1;
						}
					} else {
						blockFragment.types[surface].blocks.position.push(i, y, j);
						blockFragment.idMap.set(`${i}_${y}_${j}`, {
							temp: false,
							idx: blockFragment.types[surface].blocks.count,
							typeIdx: surface,
						});
						blockFragment.types[surface].blocks.count += 1;

						// tree 生成
						if (!hasTree) {
							const treeHeight = Math.floor(noiseGen.noise(i / treeSeedGap, j / treeSeedGap, treeSeed) * maxHeight * 2);
							if (y > treeBaseHeight && treeHeight >= 7) {
								hasTree = true;
								for (let wl = 0; wl <= treeHeight; wl += 1) {
									blockFragment.types[treeTypes[y % treeTypes.length][0]].blocks.position.push(i, y + 1 + wl, j);
									blockFragment.idMap.set(`${i}_${y}_${j}`, {
										temp: false,
										idx: blockFragment.types[treeTypes[y % treeTypes.length][0]].blocks.count,
										typeIdx: treeTypes[y % treeTypes.length][0],
									});
									blockFragment.types[treeTypes[y % treeTypes.length][0]].blocks.count += 1;
								}
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
												// eslint-disable-next-line
												if (blockFragment.idMap.has(`${leaveX}_${leaveY}_${leaveZ}`)) continue;
												blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, leaveY, leaveZ);
												blockFragment.idMap.set(`${leaveX}_${leaveY}_${leaveZ}`, {
													temp: false,
													idx: blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count,
													typeIdx: treeTypes[y % treeTypes.length][1],
												});
												blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count += 1;
											}
										blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, fromY, leaveZ);
										blockFragment.idMap.set(`${leaveX}_${fromY}_${leaveZ}`, {
											temp: false,
											idx: blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count,
											typeIdx: treeTypes[y % treeTypes.length][1],
										});
										blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.position.push(leaveX, endY, leaveZ);
										blockFragment.idMap.set(`${leaveX}_${endY}_${leaveZ}`, {
											temp: false,
											idx: blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count + 1,
											typeIdx: treeTypes[y % treeTypes.length][1],
										});
										blockFragment.types[treeTypes[y % treeTypes.length][1]].blocks.count += 2;
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
				if (d.type === null || blockFragment.idMap.has(`${d.posX}_${d.posY}_${d.posZ}`)) {
					if (!blockFragment.idMap.has(`${d.posX}_${d.posY}_${d.posZ}`)) return;
					const block = blockFragment.idMap.get(`${d.posX}_${d.posY}_${d.posZ}`);
					blockFragment.types[block.typeIdx].blocks.position[block.idx * 3] = 0;
					blockFragment.types[block.typeIdx].blocks.position[block.idx * 3 + 1] = -10000;
					blockFragment.types[block.typeIdx].blocks.position[block.idx * 3 + 2] = 0;
					blockFragment.idMap.delete(`${d.posX}_${d.posY}_${d.posZ}`);
				}
				if (d.type !== null) {
					const typeIdx = blockTypes.indexOf(d.type);
					const posIdx = blockFragment.types[typeIdx].blocks.count;
					blockFragment.types[typeIdx].blocks.position[posIdx * 3] = d.posX;
					blockFragment.types[typeIdx].blocks.position[posIdx * 3 + 1] = d.posY;
					blockFragment.types[typeIdx].blocks.position[posIdx * 3 + 2] = d.posZ;
					blockFragment.idMap.set(`${d.posX}_${d.posY}_${d.posZ}`, {
						temp: false,
						idx: posIdx,
						typeIdx,
					});
				}
			});

			blockFragment.types = blockFragment.types.filter(d => d.blocks.count > 0);
			const newTypeIdx = new Map();
			blockFragment.types.forEach((d, i) => newTypeIdx.set(blockTypes.indexOf(d.blocks.type), i));
			blockFragment.idMap.forEach(d => {
				d.typeIdx = newTypeIdx.get(d.typeIdx);
			});

			frags.push(blockFragment);
		}
	}

	postMessage({ frags, fragmentSize });
};

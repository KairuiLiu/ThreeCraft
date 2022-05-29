import * as THREE from 'three';

const matrix = new THREE.Matrix4();

onmessage = (
	msg: MessageEvent<{
		usedTypes: string[];
		noiseSeed: number;
		blockTypes: string[];
		stx: number;
		stz: number;
		edx: number;
		edz: number;
	}>
) => {
	// 准备
	const { usedTypes, blockTypes, noiseSeed, stx, stz, edx, edz } = msg.data;
	const blockCnt = new Array(blockTypes.length).fill(0);
	const blocksPos: THREE.Matrix4[][] = new Array(blockTypes.length);
	for (let i = 0; i < blocksPos.length; i += 1) {
		blocksPos[i] = [];
	}

	// surface 生成
	for (let i = stx; i < edx; i += 1) {
		for (let j = stz; j < edz; j += 1) {
			matrix.setPosition(i, Math.floor(Math.random() * 30), j);
			blocksPos[usedTypes[1]].push(matrix.clone());
			blockCnt[usedTypes[1]] += 1;
		}
	}

	postMessage({ blocksPos, blockCnt });
};

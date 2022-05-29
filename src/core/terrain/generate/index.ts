import { blockTypes } from '../../loader/index';
import { config, symConfig } from '../../../controller/config';
import '../../../utils/types/worker.d.ts';
import Worker from './worker?worker';
import Terrain from '..';
import weatherTypes from '../../weather';

class Generate {
	terrain: Terrain;

	workChain: (() => boolean)[][]; // 多线程chain

	noiseSeed: {
		seed: number;
		cloudSeed: number;
		treeSeed: number;
	};

	constructor(terrain) {
		this.terrain = terrain;
		this.noiseSeed = null;
	}

	setSeed(seed, cloudSeed, treeSeed) {
		this.noiseSeed = { seed, cloudSeed, treeSeed };
	}

	// ! 生成一条, 注意顺序
	generateLine({ stx, edx, stz, edz, fragmentSize, thread, onMessage }) {
		if (stx > edx) [stx, edx] = [edx, stx];
		if (stz > edz) [stz, edz] = [edz, stz];
		const deltaX = (edx - stx) / thread;
		const deltaZ = (edz - stz) / thread;
		const timeStep = performance.now();
		for (let i = 0; i < thread; i += 1) {
			const worker = new Worker();
			worker.onmessage = onMessage;
			worker.postMessage({
				timeStep,
				stx: stx + deltaX * i,
				edx: i === thread - 1 ? edx : stx + deltaX * (i + 1),
				stz: stz + deltaZ * i,
				edz: i === thread - 1 ? edz : stz + deltaZ * (i + 1),
				fragmentSize,
				noiseSeed: this.noiseSeed,
				weather: config.weather,
				blockTypes,
				symConfig,
				weatherTypes,
			});
		}
	}

	generateAll({ stx, edx, stz, edz, fragmentSize, thread, onMessage }) {
		if (stx > edx) [stx, edx] = [edx, stx];
		if (stz > edz) [stz, edz] = [edz, stz];
		const deltaZ = (edz - stz) / thread;
		const timeStep = performance.now();
		for (let i = 0; i < thread; i += 1) {
			const worker = new Worker();
			worker.onmessage = onMessage;
			worker.postMessage({
				timeStep,
				stx,
				edx,
				stz: stz + deltaZ * i,
				edz: i === thread - 1 ? edz : stz + deltaZ * (i + 1),
				fragmentSize,
				noiseSeed: this.noiseSeed,
				weather: config.weather,
				blockTypes,
				symConfig,
				weatherTypes,
			});
		}
	}
}

export default Generate;

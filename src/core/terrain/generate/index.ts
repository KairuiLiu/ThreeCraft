import { blockTypes, treeTypes } from '../../loader/index';
import { config, symConfig } from '../../../controller/config';
import '../../../utils/types/worker.d.ts';
import Worker from './worker?worker';
import Terrain from '..';
import weatherTypes from '../../weather';

class Generate {
	terrain: Terrain;

	noiseSeed: {
		seed: number;
		cloudSeed: number;
		treeSeed: number;
	};

	treaders: Worker[];

	constructor(terrain) {
		this.terrain = terrain;
		this.noiseSeed = null; // 额外保存一份随机数种子, 防止线程出现问题
		this.treaders = []; // 当前所有线程
	}

	// 设置种子
	setSeed(seed, cloudSeed, treeSeed) {
		this.noiseSeed = { seed, cloudSeed, treeSeed };
	}

	// 动态调节线程数
	setTreader(num) {
		if (this.treaders.length > num) {
			for (let i = num; i < this.treaders.length; i += 1) {
				this.treaders[i].terminate();
			}
			this.treaders.length = num;
		} else {
			for (let i = this.treaders.length; i < num; i += 1) {
				const worker = new Worker();
				worker.onmessage = this.terrain.onUpdateLine.bind(this.terrain);
				this.treaders.push(worker);
			}
		}
	}

	// 生成一条地形
	generateLine({ stx, edx, stz, edz, fragmentSize, thread }) {
		if (stx > edx) [stx, edx] = [edx, stx];
		if (stz > edz) [stz, edz] = [edz, stz];
		const timestamp = performance.now();
		const fragCountZ = (edz - stz) / fragmentSize;
		const fragCountX = (edx - stx) / fragmentSize;
		if (fragCountZ === 1) {
			let curFragX = 0;
			for (let i = 0; i < thread; i += 1) {
				const stx2 = stx + curFragX * fragmentSize;
				const edx2 = i === thread - 1 ? edx : stx + Math.floor(((i + 1) / thread) * fragCountX) * fragmentSize;
				this.treaders[i].postMessage({
					timestamp,
					stx: stx2,
					edx: edx2,
					stz,
					edz,
					fragmentSize,
					noiseSeed: this.noiseSeed,
					noiseGap: symConfig.noiseGap,
					weather: config.weather,
					blockTypes,
					weatherTypes,
					horizonHeight: symConfig.stage.horizonHeight,
					treeBaseHeight: symConfig.stage.treeBaseHeight,
					maxHeight: symConfig.stage.maxHeight,
					skyHeight: symConfig.stage.skyHeight,
					treeTypes,
					log: this.terrain.core.controller.log.queryArea(stx2, edx2, stz, edz),
				});
				curFragX = Math.floor(((i + 1) / thread) * fragCountX);
			}
		} else {
			let curFragZ = 0;
			for (let i = 0; i < thread; i += 1) {
				const stz2 = stz + curFragZ * fragmentSize;
				const edz2 = i === thread - 1 ? edz : stz + Math.floor(((i + 1) / thread) * fragCountZ) * fragmentSize;
				this.treaders[i].postMessage({
					timestamp,
					stz: stz2,
					edz: edz2,
					stx,
					edx,
					fragmentSize,
					noiseSeed: this.noiseSeed,
					noiseGap: symConfig.noiseGap,
					weather: config.weather,
					blockTypes,
					weatherTypes,
					horizonHeight: symConfig.stage.horizonHeight,
					treeBaseHeight: symConfig.stage.treeBaseHeight,
					maxHeight: symConfig.stage.maxHeight,
					skyHeight: symConfig.stage.skyHeight,
					treeTypes,
					log: this.terrain.core.controller.log.queryArea(stx, edx, stz2, edz2),
				});
				curFragZ = Math.floor(((i + 1) / thread) * fragCountZ);
			}
		}
	}

	// 生成全部地形
	generateAll({ stx, edx, stz, edz, fragmentSize, thread }) {
		if (stx > edx) [stx, edx] = [edx, stx];
		if (stz > edz) [stz, edz] = [edz, stz];
		const fragCount = (edz - stz) / fragmentSize;
		let curFrag = 0;
		const timestamp = performance.now();
		for (let i = 0; i < thread; i += 1) {
			const stz2 = stz + curFrag * fragmentSize;
			const edz2 = i === thread - 1 ? edz : stz + Math.floor(((i + 1) / thread) * fragCount) * fragmentSize;
			this.treaders[i].postMessage({
				timestamp,
				stx,
				edx,
				stz: stz2,
				edz: edz2,
				fragmentSize,
				noiseSeed: this.noiseSeed,
				noiseGap: symConfig.noiseGap,
				weather: config.weather,
				blockTypes,
				weatherTypes,
				horizonHeight: symConfig.stage.horizonHeight,
				treeBaseHeight: symConfig.stage.treeBaseHeight,
				maxHeight: symConfig.stage.maxHeight,
				skyHeight: symConfig.stage.skyHeight,
				treeTypes,
				log: this.terrain.core.controller.log.queryArea(stx, edx, stz2, edz2),
			});
			curFrag = Math.floor(((i + 1) / thread) * fragCount);
		}
	}
}

export default Generate;

import { blockTypes } from '../../loader/index';
import { config } from '../../../controller/config';
import '../../../utils/types/worker.d.ts';
import weatherConfig from '../../weather';
import Worker from './worker?worker';
import Terrain from '..';

class Generate {
	terrain: Terrain;

	constructor(terrain) {
		this.terrain = terrain;
	}

	static getOnGeneratedAll(self) {
		return e => {
			const { blocksPos, blockCnt } = e.data;
			self.terrain.onUpdateScene({ blocksPos, blockCnt });
		};
	}

	generateArea(stx, stz, edx, edz) {
		if (stx > edx) {
			const t = edx;
			edx = stx;
			stx = t;
		}
		if (stz > edz) {
			const t = edz;
			edz = stz;
			stz = t;
		}
		this;
		// worker.pos;
	}

	generateAll(stx, stz, edx, edz) {
		const worker = new Worker();

		worker.onmessage = Generate.getOnGeneratedAll(this);

		worker.postMessage({
			genType: 'all',
			blockTypes,
			usedTypes: weatherConfig[config.weather],
			stx,
			stz,
			edx,
			edz,
		});
	}
}

export default Generate;

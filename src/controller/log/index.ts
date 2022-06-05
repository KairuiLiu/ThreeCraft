import { BlockLog } from '../../utils/types/block';
import Splay from './splay';

class Log {
	data: Splay<number, Splay<number, Map<number, BlockLog>>>;

	constructor(logs: BlockLog[]) {
		this.data = new Splay();
		this.load(logs);
	}

	load(logs: BlockLog[]) {
		logs.forEach(d => this.insert(d));
	}

	insert(blocklog: BlockLog) {
		const { posX, posY, posZ } = blocklog;
		const treeY = this.data.queryAndInit(posX, new Splay()).value!;
		const mapZ = treeY.queryAndInit(posY, new Map()).value!;
		mapZ.set(posZ, blocklog);
	}

	query(x = null, y = null, z = null) {
		if (x === null) return this;
		const treeY = this.data.query(x)?.value;
		if (y === null || !treeY) return treeY;
		const mapZ = treeY.query(y)?.value;
		if (z === null || !mapZ) return mapZ;
		return mapZ.get(z);
	}

	next(x: number, y = null) {
		if (y === null) return this.data.next(x);
		const treeY = this.data.query(x);
		return treeY?.value?.next(y);
	}

	prev(x: number, y = null) {
		if (y === null) return this.data.prev(x);
		const treeY = this.data.query(x);
		return treeY?.value?.prev(y);
	}

	queryArea(stx: number, edx: number, sty: number, edy: number) {
		const res = [] as BlockLog[];
		let treeY = this.data.lowerBound(stx);
		while (treeY && treeY.key! <= edx) {
			let mapZ = treeY.value!.lowerBound(sty);
			while (mapZ && mapZ.key! <= edy) {
				res.push(...[...mapZ.value!].map(d => d[1]));
				mapZ = treeY.value!.nodeNext(mapZ);
			}
			treeY = this.data.nodeNext(treeY);
		}
		return res;
	}

	export() {
		const res = [] as BlockLog[];
		let treeY = this.data.begin();
		while (treeY && !treeY.empty) {
			let mapZ = treeY.value!.begin();
			while (mapZ && !mapZ.empty) {
				res.push(...[...mapZ.value!].map(d => d[1]));
				mapZ = treeY.value!.nodeNext(mapZ)!;
			}
			treeY = this.data.nodeNext(treeY)!;
		}
		return res;
	}
}

export default Log;

import { BlockLog } from '../../utils/types/block';
import Splay from './Splay';

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
		const treeY = this.data.queryAndInit(posX, new Splay()).value;
		const mapZ = treeY.queryAndInit(posY, new Map()).value;
		mapZ.set(posZ, blocklog);
	}

	query(x = null, y = null, z = null) {
		if (x === null) return this;
		const treeY = this.data.query(x).value;
		if (y === null) return treeY;
		const mapZ = treeY.query(y).value;
		if (z === null) return mapZ;
		return mapZ.get(z);
	}

	next(x, y = null) {
		if (y === null) return this.data.next(x);
		const treeY = this.data.query(x);
		return treeY.value.next(y);
	}

	prev(x = null, y = null) {
		if (x === null) return this;
		if (y === null) return this.data.prev(x);
		const treeY = this.data.query(x);
		return treeY.value.prev(y);
	}

	queryArea(stx, edx, sty, edy) {
		console.log(stx, edx, sty, edy);
		this;
	}

	export() {
		this;
	}
}

export default Log;

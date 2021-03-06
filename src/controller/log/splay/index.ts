import SNode from './snode';

class Splay<K, V> {
	root: SNode<K, V>;

	cmp: (a: K, b: K) => number;

	constructor(cmp = Splay.defaultCmp) {
		this.root = new SNode(null);
		this.cmp = cmp;
	}

	isRight(n: SNode<K, V>) {
		if (n.parent === null) return false;
		return n.parent.right === n;
		this;
	}

	rotate(x: SNode<K, V>) {
		if (x === this.root) return;
		const y = x.parent!;
		const z = y.parent;
		const yRight = this.isRight(y);

		if (this.isRight(x)) {
			y.right = x.left;
			x.left!.parent = y;
			x.left = y;
		} else {
			y.left = x.right;
			x.right!.parent = y;
			x.right = y;
		}
		y.parent = x;
		x.parent = z;
		if (z)
			if (yRight) z.right = x;
			else z.left = x;
	}

	splay(x: SNode<K, V>) {
		for (let f = x.parent; f !== null; ) {
			if (f.parent !== null) this.rotate(this.isRight(f) === this.isRight(x) ? f : x);
			this.rotate(x);
			f = x.parent;
		}
		this.root = x;
	}

	// 插入一个K-V, 返回V所在SNode
	insert(k: K, v: V) {
		let cur = this.root;
		// eslint-disable-next-line
		while (true) {
			if (cur.empty) {
				cur.setValue(k, v);
				this.splay(cur);
				return cur;
			}
			const t = this.cmp(cur.key!, k);
			if (t === 0) {
				cur.setValue(k, v);
				this.splay(cur);
				return cur;
			}
			if (t < 0) cur = cur.right!;
			else cur = cur.left!;
		}
	}

	// 查询一个K, 返回K所在SNode
	query(k: K) {
		let cur = this.root;
		while (cur) {
			if (cur.empty) return null;
			const t = this.cmp(cur.key!, k);
			if (t === 0) {
				this.splay(cur);
				return cur;
			}
			if (t < 0) cur = cur.right!;
			else cur = cur.left!;
		}
		return null;
	}

	// query Key, 返回 SNode
	queryAndInit(k: K, v: V) {
		const node = this.query(k);
		if (node === null) {
			return this.insert(k, v);
		}
		return node;
	}

	lowerBound(k: K) {
		let cur = this.root;
		while (cur) {
			if (cur.empty) return null;
			const t = this.cmp(cur.key!, k);
			if (t === 0) {
				this.splay(cur);
				return cur;
			}
			if (t < 0) {
				if (cur.right.empty) {
					this.splay(cur);
					return this.next(cur.key);
				}
				cur = cur.right;
			} else {
				if (cur.left.empty) {
					this.splay(cur);
					return cur;
				}
				cur = cur.left!;
			}
		}
		return null;
	}

	// 返回前一个SNode
	prev(k: K) {
		let cur = this.query(k)?.left;
		if (!cur || cur.empty) return null;
		while (cur) {
			if (cur.right!.empty) return cur;
			cur = cur.right;
		}
		return null;
	}

	next(k: K) {
		let cur = this.query(k)?.right;
		if (!cur || cur.empty) return null;
		while (cur) {
			if (cur.left!.empty) return cur;
			cur = cur.left;
		}
		return null;
	}

	nodePrev(n: SNode<K, V>) {
		this.splay(n);
		let cur = n.left;
		if (cur!.empty) return null;
		while (cur) {
			if (cur.right!.empty) return cur;
			cur = cur.right;
		}
		return null;
	}

	nodeNext(n: SNode<K, V>) {
		this.splay(n);
		let cur = n.right;
		if (cur!.empty) return null;
		while (cur) {
			if (cur.left!.empty) return cur;
			cur = cur.left;
		}
		return null;
	}

	begin() {
		let cur = this.root;
		if (cur.empty) return cur;
		while (!cur.left!.empty) cur = cur.left!;
		return cur;
	}

	end() {
		let cur = this.root;
		if (cur.empty) return cur;
		while (!cur.right!.empty) cur = cur.right!;
		return cur;
	}

	static defaultCmp(a: any, b: any) {
		return a - b;
	}
}

export default Splay;

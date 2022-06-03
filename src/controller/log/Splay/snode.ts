class SNode<K, V> {
	key: K;

	value: V;

	// eslint-disable-next-line
	left: SNode<K, V>;

	// eslint-disable-next-line
	right: SNode<K, V>;

	// eslint-disable-next-line
	parent: SNode<K, V>;

	empty: boolean;

	constructor(parent = null, k = null, v = null) {
		this.empty = true;
		if (parent !== null) this.parent = parent;
		if (k !== null) {
			this.empty = false;
			this.key = k;
			this.value = v;
			this.left = new SNode(this);
			this.right = new SNode(this);
		}
	}

	setValue(k, v) {
		if (this.empty) {
			this.empty = false;
			this.key = k;
			this.value = v;
			this.left = new SNode(this);
			this.right = new SNode(this);
		} else {
			this.value = v;
		}
	}
}

export default SNode;

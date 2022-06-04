class SNode<K, V> {
	key: K | null;

	value: V | null;

	// eslint-disable-next-line
	left: SNode<K, V> | null;

	// eslint-disable-next-line
	right: SNode<K, V> | null;

	// eslint-disable-next-line
	parent: SNode<K, V> | null;

	empty: boolean;

	constructor(parent: SNode<K, V> | null, k = null, v = null) {
		this.empty = true;
		this.left = null;
		this.right = null;
		this.value = null;
		this.key = null;
		this.parent = parent;
		if (k !== null) {
			this.empty = false;
			this.key = k;
			this.value = v;
			this.left = new SNode(this);
			this.right = new SNode(this);
		}
	}

	setValue(k: K, v: V) {
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
